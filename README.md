# Mail Server Operations Report Generator

A modern, automated daily report generator for mail server operations with Google Drive integration.

## Features

✅ **Automated Report Generation**
- Script & Log Check tracking with timestamps
- Email Delivery Metrics with achievement tracking
- Test Mail Check with spam detection status
- Screenshot management (drag & drop, paste, reorder)
- Word document export

✅ **Google Drive Integration**
- Automatic folder organization by date and cycle
- Structure: `Base Folder/YYYY/YYYY-MM-DD/Cycle Name/Report.doc`
- One-click upload to Drive
- Settings modal for easy configuration

✅ **User-Friendly Interface**
- Dark mode toggle
- Collapsible sections
- Quick navigation menu
- Keyboard shortcuts (Ctrl+S save, Ctrl+D dark mode)
- Progress indicator
- Mobile responsive

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Google Drive API**
   - **Google Picker API** (optional, for folder picker)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: Mail Server Report Generator
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-username.github.io` (for GitHub Pages)
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `https://your-username.github.io/your-repo-name`
5. Copy the **Client ID** (ends with `.apps.googleusercontent.com`)
6. (Optional) Copy the **App ID** if using Google Picker

### 2. Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   VITE_GOOGLE_APP_ID=your-app-id-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser

### 3. GitHub Pages Deployment

1. Push your code to GitHub
2. Set up GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Source: **GitHub Actions** or **Deploy from a branch**
   - If using branch: select `gh-pages` branch

3. Update `.env` with your GitHub Pages URL in the OAuth settings

4. Deploy:
   ```bash
   # Set base path for GitHub Pages (replace with your repo name)
   $env:VITE_BASE_PATH = '/your-repo-name'
   npm run deploy
   Remove-Item Env:VITE_BASE_PATH
   ```

5. Access your app at: `https://your-username.github.io/your-repo-name`

## Usage

### First Time Setup

1. Click the **Settings** button (⚙️) in the top-right corner
2. Sign in to Google Drive
3. Select or enter your base folder ID where reports will be stored
4. Click **Done**

### Generating Reports

1. Fill in the report date and cycle information
2. Enter all required details:
   - Script & Log Check times
   - Email Delivery Metrics
   - Test Mail results
   - Upload screenshots as needed
3. Click **Upload to Drive** to automatically:
   - Create folder structure: `YYYY/YYYY-MM-DD/Cycle Name/`
   - Upload the report document
   - Show success message with file location

### Folder Structure

Reports are automatically organized:
```
Base Folder/
  └── 2025/
      └── 2025-11-26/
          └── Cycle 02/
              └── Mail_Report_2025-11-26_Cycle_02.doc
```

## Keyboard Shortcuts

- **Ctrl+S**: Save draft locally
- **Ctrl+D**: Toggle dark mode

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React Icons
- Google Drive API
- Google Identity Services

## License

MIT

