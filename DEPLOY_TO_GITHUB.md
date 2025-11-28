# 🚀 Deploy to GitHub Pages - Step by Step

## ✅ Prerequisites:
- [x] App is working locally
- [x] Google Drive integration working
- [x] Folder is set up

## 📋 Deployment Steps:

### Step 1: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `mail-server-reports` (or your choice)
3. **Description:** `Daily Mail Server Operations Report Generator with Google Drive Integration`
4. **Visibility:** Choose **Public** (for free GitHub Pages) or **Private**
5. **❌ DON'T check** "Initialize with README" (we have files already)
6. **Click:** "Create repository"

### Step 2: Initialize Git (if not done)

**In your project folder, run:**

```bash
git init
git add .
git commit -m "Initial commit: Mail Server Report Generator with Google Drive integration"
```

### Step 3: Push to GitHub

**Copy the commands GitHub shows you, or use:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` → Your GitHub username
- `YOUR-REPO-NAME` → Your repository name

### Step 4: Deploy to GitHub Pages

**Windows PowerShell:**
```powershell
# Replace 'your-repo-name' with your actual repository name
$env:VITE_BASE_PATH = '/your-repo-name'
npm run deploy
Remove-Item Env:VITE_BASE_PATH
```

**Windows CMD:**
```cmd
set "VITE_BASE_PATH=/your-repo-name" && npm run deploy
```

**Git Bash:**
```bash
VITE_BASE_PATH=/your-repo-name npm run deploy
```

### Step 5: Enable GitHub Pages

1. **Go to your repository on GitHub**
2. **Click:** Settings (top menu)
3. **Scroll to:** Pages (left sidebar)
4. **Source:** Select **gh-pages** branch
5. **Folder:** `/ (root)`
6. **Click:** Save

### Step 6: Update Google Cloud OAuth Settings

1. **Go to:** Google Cloud Console → Credentials
2. **Edit your OAuth 2.0 Client ID**
3. **Add to Authorized JavaScript origins:**
   ```
   https://YOUR-USERNAME.github.io
   ```
4. **Add to Authorized redirect URIs:**
   ```
   https://YOUR-USERNAME.github.io/your-repo-name
   ```
5. **Save**

### Step 7: Access Your Live Site

**Your site will be available at:**
```
https://YOUR-USERNAME.github.io/your-repo-name
```

**Note:** It may take 1-2 minutes to go live after deployment.

---

## ✅ After Deployment:

1. ✅ Test on live site
2. ✅ Sign in with Google Drive
3. ✅ Set your folder
4. ✅ Generate and upload a test report
5. ✅ Share the URL with your team!

---

## 🎉 You're Live!

Your app is now accessible to anyone with the URL!

