# 🚀 Quick Deployment Guide

## ✅ Pre-Deployment Checklist:

- [x] App works locally
- [x] Google Drive integration working
- [x] Git initialized and committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Google Cloud OAuth updated

---

## 📋 Step-by-Step Deployment:

### Step 1: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `mail-server-reports` (or your choice)
3. **Description:** `Daily Mail Server Operations Report Generator`
4. **Visibility:** ✅ **Public** (for free GitHub Pages)
5. **❌ DON'T check** "Initialize with README"
6. **Click:** "Create repository"

### Step 2: Push Your Code

**After creating the repo, GitHub will show you commands. Copy and run:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` → Your GitHub username
- `YOUR-REPO-NAME` → Your repository name (e.g., `mail-server-reports`)

### Step 3: Deploy to GitHub Pages

**Option A: Use the PowerShell script (Easiest):**
```powershell
.\deploy.ps1 -RepoName "your-repo-name"
```

**Option B: Manual deployment:**
```powershell
$env:VITE_BASE_PATH = '/your-repo-name'
npm run deploy
Remove-Item Env:VITE_BASE_PATH
```

**Replace `your-repo-name` with your actual repository name!**

### Step 4: Enable GitHub Pages

1. **Go to your repository on GitHub**
2. **Click:** Settings (top menu)
3. **Scroll to:** Pages (left sidebar)
4. **Source:** Select **gh-pages** branch
5. **Folder:** `/ (root)`
6. **Click:** Save

### Step 5: Update Google Cloud OAuth

**IMPORTANT:** Your app won't work until you do this!

1. **Go to:** https://console.cloud.google.com/
2. **Navigate to:** APIs & Services → Credentials
3. **Click:** Your OAuth 2.0 Client ID
4. **Add to Authorized JavaScript origins:**
   ```
   https://YOUR-USERNAME.github.io
   ```
5. **Add to Authorized redirect URIs:**
   ```
   https://YOUR-USERNAME.github.io/your-repo-name
   ```
6. **Click:** SAVE

**Replace:**
- `YOUR-USERNAME` → Your GitHub username
- `your-repo-name` → Your repository name

### Step 6: Your Live Site URL

**Your app will be live at:**
```
https://YOUR-USERNAME.github.io/your-repo-name
```

**Note:** It may take 1-2 minutes to go live after deployment.

---

## ✅ Test Your Live Site:

1. ✅ Open your GitHub Pages URL
2. ✅ Click Settings → Sign In to Google Drive
3. ✅ Set your folder
4. ✅ Generate a test report
5. ✅ Upload to Drive

---

## 👥 User Access Explained:

### Can Other Users Use It?

**✅ YES!** Here's how:

#### For Testing Mode (Current):
- **Add users as test users** in Google Cloud Console
- **Maximum 100 users**
- **Each user signs in with their own Google account**
- **Each user uses their own Google Drive**

#### For Production Mode:
- **Publish your app** in Google Cloud Console
- **Unlimited users**
- **No need to add them manually**
- **Anyone can use it!**

### How Users Access:

1. **You share the GitHub Pages URL**
2. **They open it in their browser**
3. **They click "Sign In to Google Drive"**
4. **They sign in with their Google account**
5. **They select their folder (or shared folder)**
6. **They generate reports!**

### Shared Folder Option:

- **Create a shared Google Drive folder**
- **Share it with your team**
- **Everyone uses the same Folder ID**
- **All reports go to the same place!**

---

## 🎉 You're Live!

Your app is now accessible to anyone with the URL!

---

## 📝 Troubleshooting:

### Site shows 404:
- ✅ Wait 1-2 minutes (GitHub Pages takes time)
- ✅ Check GitHub Pages settings (gh-pages branch selected)
- ✅ Verify repository name matches in URL

### Google Sign-In doesn't work:
- ✅ Check Google Cloud OAuth settings
- ✅ Verify production URL is added
- ✅ Make sure you're using the correct URL

### Build fails:
- ✅ Check for errors in terminal
- ✅ Make sure all dependencies are installed (`npm install`)
- ✅ Verify `package.json` is correct

---

## 🚀 Ready to Deploy?

1. Create GitHub repository
2. Push your code
3. Run deployment script
4. Enable GitHub Pages
5. Update Google Cloud OAuth
6. Share your URL!

**Good luck!** 🎉

