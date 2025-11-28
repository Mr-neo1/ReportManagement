# 🚀 Quick Setup Guide - Google Drive Integration

## Step-by-Step Visual Guide

### Part 1: Google Cloud Console (10 minutes)

#### 1.1 Create Project
```
1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name: "Mail Server Reports"
4. Click "Create"
```

#### 1.2 Enable APIs
```
1. Click ☰ Menu → APIs & Services → Library
2. Search "Google Drive API" → Enable
3. Search "Google Picker API" → Enable
```

#### 1.3 Configure OAuth Consent Screen
```
1. APIs & Services → OAuth consent screen
2. Choose "External" → Create
3. Fill in:
   - App name: Mail Server Report Generator
   - User support email: (your email)
   - Developer contact: (your email)
4. Click "Save and Continue"
5. Scopes: Keep default, click "Save and Continue"
6. Test users: Add your email, click "Save and Continue"
7. Summary: Click "Back to Dashboard"
```

#### 1.4 Create OAuth Credentials
```
1. APIs & Services → Credentials
2. Click "+ CREATE CREDENTIALS" → "OAuth 2.0 Client ID"
3. Application type: Web application
4. Name: Mail Server Reports Web
5. Authorized JavaScript origins:
   ✅ Add: http://localhost:5173
   ✅ Add: https://your-username.github.io
6. Authorized redirect URIs:
   ✅ Add: http://localhost:5173
   ✅ Add: https://your-username.github.io/your-repo-name
7. Click "Create"
8. 📋 COPY THE CLIENT ID (you'll need this!)
```

---

### Part 2: Local Configuration (2 minutes)

#### 2.1 Create .env File

**In your project folder, create `.env` file:**

**Windows (PowerShell):**
```powershell
cd C:\Users\rkrai\OneDrive\Desktop\ReportAutomation
New-Item -Path .env -ItemType File
notepad .env
```

**Or use any text editor to create `.env` in project root:**

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=your-project-number
```

**Replace:**
- `your-client-id-here` → Paste the Client ID you copied
- `your-project-number` → Your Google Cloud Project Number (found in Project Settings)

#### 2.2 Verify .env is Ignored
```
✅ Check .gitignore includes .env (should already be there)
```

---

### Part 3: Test Locally (5 minutes)

#### 3.1 Start Dev Server
```bash
npm run dev
```

#### 3.2 Open Browser
```
http://localhost:5173
```

#### 3.3 Test Drive Setup
```
1. Click ⚙️ Settings button (top-right)
2. Click "Sign In to Google Drive"
3. Authorize the application
4. Click "Select Folder" or "Enter Folder ID"
5. Choose/create a folder like "Mail Server Reports"
6. Click "Done"
```

#### 3.4 Test Upload
```
1. Fill in Report Date: Today's date
2. Fill in Report Cycle: "Cycle 01"
3. Fill in other report details
4. Click "Upload to Drive"
5. Check Google Drive for:
   Base Folder/
     └── 2025/
         └── 2025-11-26/
             └── Cycle 01/
                 └── Mail_Report_2025-11-26_Cycle_01.doc
```

---

### Part 4: Deploy to GitHub Pages (10 minutes)

#### 4.1 Create GitHub Repository
```
1. Go to: https://github.com/new
2. Repository name: mail-server-reports (or your choice)
3. Description: Daily Mail Server Operations Report Generator
4. Choose: Public or Private
5. ❌ DON'T check "Initialize with README"
6. Click "Create repository"
```

#### 4.2 Push Code to GitHub

**If git is not initialized:**
```bash
git init
git add .
git commit -m "Initial commit: Mail Server Report Generator with Google Drive integration"
```

**Push to GitHub:**
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

#### 4.3 Deploy to GitHub Pages

**Windows PowerShell:**
```powershell
# Replace 'your-repo-name' with your actual repository name
$env:VITE_BASE_PATH = '/your-repo-name'
npm run deploy
Remove-Item Env:VITE_BASE_PATH
```

**After deployment:**
```
1. Go to repository Settings → Pages
2. Source: gh-pages branch
3. Your site: https://your-username.github.io/your-repo-name
```

#### 4.4 Update OAuth Settings for Production

```
1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to Authorized JavaScript origins:
   https://your-username.github.io
4. Add to Authorized redirect URIs:
   https://your-username.github.io/your-repo-name
5. Save
```

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled (Drive API, Picker API)
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] `.env` file created with Client ID
- [ ] Local dev server runs (`npm run dev`)
- [ ] Can sign in to Google Drive locally
- [ ] Can select base folder locally
- [ ] Can upload report to Drive locally
- [ ] Folder structure is correct in Drive
- [ ] Code pushed to GitHub
- [ ] Deployed to GitHub Pages
- [ ] OAuth settings updated for production URL
- [ ] Can sign in on live site
- [ ] Can upload report on live site

---

## 🆘 Common Issues

### Issue: "Google Client ID not configured"
**Solution:**
- ✅ Check `.env` file exists in project root
- ✅ Verify variable name is exactly `VITE_GOOGLE_CLIENT_ID`
- ✅ Restart dev server after creating `.env`

### Issue: "Access blocked: This app's request is invalid"
**Solution:**
- ✅ Check OAuth consent screen is published (or add test users)
- ✅ Verify redirect URIs match exactly
- ✅ Check Client ID is correct

### Issue: "Folder not found"
**Solution:**
- ✅ Make sure you've selected a folder in Settings
- ✅ Check folder ID is correct
- ✅ Verify you have access to the folder

### Issue: "Build fails"
**Solution:**
- ✅ Run `npm install` to ensure dependencies are installed
- ✅ Check Node.js version (18+ recommended)
- ✅ Clear cache: `npm cache clean --force`

---

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Verify all steps in this guide are completed
3. Check Google Cloud Console for API errors
4. Review README.md for detailed documentation

---

**You're all set! 🎉**

