import { useEffect, useState } from 'react';
import { X, FolderOpen, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {
  initializeGoogleAuth,
  requestToken,
  isAuthenticated,
  clearStoredToken,
  getBaseFolderId,
  getBaseFolderName,
  setBaseFolder,
  clearBaseFolder,
  openFolderPicker,
} from '../utils/drive';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const APP_ID = import.meta.env.VITE_GOOGLE_APP_ID || '';

export default function SettingsModal({ isOpen, onClose, darkMode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [baseFolderName, setBaseFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
      if (CLIENT_ID && window.google?.accounts?.oauth2) {
        const client = initializeGoogleAuth(CLIENT_ID, (token, error) => {
          if (token) {
            setIsSignedIn(true);
            setMessage({ type: 'success', text: 'Successfully signed in!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          } else if (error) {
            setMessage({ type: 'error', text: error });
          }
        });
        setTokenClient(client);
      } else if (!CLIENT_ID) {
        setMessage({ type: 'error', text: 'Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env file.' });
      }
    }
  }, [isOpen]);

  const checkAuthStatus = () => {
    setIsSignedIn(isAuthenticated());
    const folderName = getBaseFolderName();
    setBaseFolderName(folderName);
  };

  const handleSignIn = async () => {
    if (!tokenClient) {
      setMessage({ type: 'error', text: 'Google auth not initialized. Check your Client ID.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await requestToken(tokenClient);
      checkAuthStatus();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Sign in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearStoredToken();
    clearBaseFolder();
    setIsSignedIn(false);
    setBaseFolderName('');
    setMessage({ type: 'success', text: 'Signed out successfully' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSelectFolder = async () => {
    if (!isSignedIn) {
      setMessage({ type: 'error', text: 'Please sign in first' });
      return;
    }

    if (!APP_ID) {
      setMessage({ type: 'error', text: 'Google App ID not configured. Please set VITE_GOOGLE_APP_ID in .env file.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await openFolderPicker(CLIENT_ID, APP_ID, (folder, error) => {
        setLoading(false);
        if (error) {
          setMessage({ type: 'error', text: error });
          return;
        }

        if (folder) {
          setBaseFolder(folder.id, folder.name);
          setBaseFolderName(folder.name);
          setMessage({ type: 'success', text: `Base folder set: ${folder.name}` });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
      });
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message || 'Failed to open folder picker. Try using "Enter Folder ID" instead.' });
    }
  };

  const handleSetFolderId = () => {
    const folderId = prompt('Enter Google Drive Folder ID:');
    if (folderId && folderId.trim()) {
      const folderName = prompt('Enter folder name (optional):') || 'Mail Reports';
      setBaseFolder(folderId.trim(), folderName);
      setBaseFolderName(folderName);
      setMessage({ type: 'success', text: `Base folder set: ${folderName}` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-6 py-4 rounded-t-2xl flex items-center justify-between`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Google Drive Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition`}
          >
            <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {message.text && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          )}

          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-5`}>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Authentication
            </h3>
            {isSignedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Signed in to Google Drive
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sign in to Google Drive to enable automatic report uploads.
                </p>
                <button
                  onClick={handleSignIn}
                  disabled={loading || !CLIENT_ID}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  Sign In to Google Drive
                </button>
                {!CLIENT_ID && (
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Google Client ID not configured. Check your .env file.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-5`}>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Base Folder
            </h3>
            {baseFolderName ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {baseFolderName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Folder ID: {getBaseFolderId()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectFolder}
                    disabled={!isSignedIn || loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    Change Folder
                  </button>
                  <button
                    onClick={handleSetFolderId}
                    disabled={!isSignedIn}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Set Folder ID
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select the base folder where reports will be organized by date and cycle.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectFolder}
                    disabled={!isSignedIn || loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    Select Folder
                  </button>
                  <button
                    onClick={handleSetFolderId}
                    disabled={!isSignedIn}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enter Folder ID
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl p-5 border-2 ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              📁 Folder Structure
            </h3>
            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              Reports will be organized automatically:
            </p>
            <pre className={`text-xs mt-2 p-3 rounded bg-black/20 ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
{`Base Folder/
  └── YYYY/
      └── YYYY-MM-DD/
          └── Cycle Name/
              └── Mail_Report_YYYY-MM-DD_Cycle.doc`}
            </pre>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-6 py-4 rounded-b-2xl flex justify-end`}>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

