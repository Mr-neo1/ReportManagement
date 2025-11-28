/**
 * Google Drive API Integration Utilities
 * Handles authentication, folder creation, and file uploads
 */

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'drive_access_token',
  BASE_FOLDER_ID: 'drive_base_folder_id',
  BASE_FOLDER_NAME: 'drive_base_folder_name',
};

/**
 * Initialize Google Identity Services token client
 */
export const initializeGoogleAuth = (clientId, callback) => {
  if (!window.google?.accounts?.oauth2) {
    console.error('Google Identity Services not loaded');
    return null;
  }

  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: DRIVE_SCOPES,
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        console.error('Token error:', tokenResponse.error);
        callback(null, tokenResponse.error);
        return;
      }
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.access_token);
      callback(tokenResponse.access_token, null);
    },
  });

  return tokenClient;
};

/**
 * Get stored access token
 */
export const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Remove stored token (sign out)
 */
export const clearStoredToken = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getStoredToken();
};

/**
 * Request access token (sign in)
 */
export const requestToken = (tokenClient) => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    const originalCallback = tokenClient.callback;
    tokenClient.callback = (tokenResponse) => {
      originalCallback(tokenResponse);
      if (tokenResponse.access_token) {
        resolve(tokenResponse.access_token);
      } else {
        reject(new Error(tokenResponse.error || 'Failed to get token'));
      }
    };

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
};

/**
 * Get stored base folder ID
 */
export const getBaseFolderId = () => {
  return localStorage.getItem(STORAGE_KEYS.BASE_FOLDER_ID);
};

/**
 * Get stored base folder name
 */
export const getBaseFolderName = () => {
  return localStorage.getItem(STORAGE_KEYS.BASE_FOLDER_NAME) || 'Mail Reports';
};

/**
 * Save base folder info
 */
export const setBaseFolder = (folderId, folderName) => {
  localStorage.setItem(STORAGE_KEYS.BASE_FOLDER_ID, folderId);
  localStorage.setItem(STORAGE_KEYS.BASE_FOLDER_NAME, folderName || 'Mail Reports');
};

/**
 * Clear base folder info
 */
export const clearBaseFolder = () => {
  localStorage.removeItem(STORAGE_KEYS.BASE_FOLDER_ID);
  localStorage.removeItem(STORAGE_KEYS.BASE_FOLDER_NAME);
};

/**
 * Make authenticated Drive API request
 */
const driveRequest = async (url, options = {}, token = null) => {
  const accessToken = token || getStoredToken();
  if (!accessToken) {
    throw new Error('Not authenticated. Please sign in to Google Drive.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      throw new Error('Authentication expired. Please sign in again.');
    }
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(error.error?.message || `Drive API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Find or create a folder in Drive
 */
export const findOrCreateFolder = async (folderName, parentId = null) => {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  // Try to find existing folder
  const query = parentId
    ? `name='${folderName}' and '${parentId}' in parents and mimeType='${DRIVE_FOLDER_MIME}' and trashed=false`
    : `name='${folderName}' and mimeType='${DRIVE_FOLDER_MIME}' and trashed=false`;

  const searchUrl = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;
  
  try {
    const searchResult = await driveRequest(searchUrl, {}, token);
    if (searchResult.files && searchResult.files.length > 0) {
      return searchResult.files[0].id;
    }
  } catch (error) {
    console.warn('Folder search failed, will create new folder:', error);
  }

  // Create new folder
  const folderMetadata = {
    name: folderName,
    mimeType: DRIVE_FOLDER_MIME,
    ...(parentId && { parents: [parentId] }),
  };

  const createUrl = `${DRIVE_API_BASE}/files?fields=id,name`;
  const newFolder = await driveRequest(createUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(folderMetadata),
  }, token);

  return newFolder.id;
};

/**
 * Create folder structure: Base -> Year -> Date -> Cycle
 */
export const createReportFolderStructure = async (reportDate, reportCycle) => {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const baseFolderId = getBaseFolderId();
  if (!baseFolderId) {
    throw new Error('Base folder not set. Please configure in Settings.');
  }

  const dateObj = new Date(reportDate);
  const year = dateObj.getFullYear().toString();
  const dateFolderName = reportDate; // Format: YYYY-MM-DD
  const cycleFolderName = reportCycle || 'Default';
  
  // Sanitize folder names (remove invalid characters)
  const sanitize = (name) => name.replace(/[<>:"/\\|?*]/g, '_').trim();
  const safeCycleName = sanitize(cycleFolderName);

  try {
    // Create/find Year folder
    const yearFolderId = await findOrCreateFolder(year, baseFolderId);

    // Create/find Date folder (YYYY-MM-DD)
    const dateFolderId = await findOrCreateFolder(dateFolderName, yearFolderId);

    // Create/find Cycle folder
    const cycleFolderId = await findOrCreateFolder(safeCycleName, dateFolderId);

    return {
      yearFolderId,
      dateFolderId,
      cycleFolderId,
      path: `${getBaseFolderName()}/${year}/${dateFolderName}/${safeCycleName}`,
    };
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw error;
  }
};

/**
 * Upload file to Drive
 */
export const uploadFileToDrive = async (fileBlob, fileName, folderId, mimeType = 'application/msword') => {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  // Create metadata
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: mimeType,
  };

  // Create FormData for multipart upload
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', fileBlob);

  const uploadUrl = `${DRIVE_UPLOAD_API}?uploadType=multipart&fields=id,name,webViewLink`;
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      throw new Error('Authentication expired. Please sign in again.');
    }
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(error.error?.message || `Upload failed: ${response.status}`);
  }

  const result = await response.json();
  return {
    fileId: result.id,
    fileName: result.name,
    webViewLink: result.webViewLink,
  };
};

/**
 * Load Google Picker API
 */
const loadPickerAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) {
      resolve();
      return;
    }

    if (window.gapi?.load) {
      window.gapi.load('picker', { callback: resolve, onerror: reject });
    } else {
      // Wait for gapi to load
      let attempts = 0;
      const checkGapi = setInterval(() => {
        attempts++;
        if (window.gapi?.load) {
          clearInterval(checkGapi);
          window.gapi.load('picker', { callback: resolve, onerror: reject });
        } else if (attempts > 50) {
          clearInterval(checkGapi);
          reject(new Error('Failed to load Google Picker API'));
        }
      }, 100);
    }
  });
};

/**
 * Use Google Picker to select a Drive folder
 */
export const openFolderPicker = async (clientId, appId, callback) => {
  const token = getStoredToken();
  if (!token) {
    callback(null, 'Please sign in to Google Drive first');
    return;
  }

  try {
    // Load Picker API if not already loaded
    await loadPickerAPI();

    if (!window.google?.picker) {
      callback(null, 'Google Picker API failed to load. Please try using "Enter Folder ID" instead.');
      return;
    }

    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(token)
      .setAppId(appId)
      .addView(new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS).setSelectFolderEnabled(true))
      .setCallback((data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const folder = data[window.google.picker.Response.DOCUMENTS][0];
          callback(folder, null);
        } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
          callback(null, 'Folder selection cancelled');
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error('Picker API error:', error);
    callback(null, 'Failed to load Google Picker API. Please use "Enter Folder ID" instead.');
  }
};

/**
 * Format date for folder naming (YYYY-MM-DD)
 */
export const formatDateForFolder = (dateString) => {
  return dateString; // Already in YYYY-MM-DD format from date input
};

/**
 * Sanitize cycle name for folder
 */
export const sanitizeCycleName = (cycleName) => {
  return cycleName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'Default';
};

