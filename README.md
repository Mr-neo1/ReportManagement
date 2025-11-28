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

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=your-app-id-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Deploy to GitHub Pages

```bash
$env:VITE_BASE_PATH = '/ReportManagement'
npm run deploy
Remove-Item Env:VITE_BASE_PATH
```

Access at: `https://mr-neo1.github.io/ReportManagement`

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
