# 🚀 Quick Deployment Guide

## Step 1: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `mail-server-reports` (or your choice)
3. **Description:** `Daily Mail Server Operations Report Generator`
4. **Visibility:** Public (for free GitHub Pages)
5. **❌ DON'T check** "Initialize with README"
6. **Click:** "Create repository"

## Step 2: Push Your Code

**After creating the repo, GitHub will show you commands. Use these:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` → Your GitHub username
- `YOUR-REPO-NAME` → Your repository name

## Step 3: Deploy to GitHub Pages

**Windows PowerShell:**
```powershell
# Replace 'your-repo-name' with your actual repository name
$env:VITE_BASE_PATH = '/your-repo-name'
npm run deploy
Remove-Item Env:VITE_BASE_PATH
```

## Step 4: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. **Source:** `gh-pages` branch
3. **Folder:** `/ (root)`
4. **Save**

## Step 5: Update Google Cloud OAuth

1. Google Cloud Console → **Credentials**
2. Edit your OAuth Client ID
3. Add to **Authorized JavaScript origins:**
   - `https://YOUR-USERNAME.github.io`
4. Add to **Authorized redirect URIs:**
   - `https://YOUR-USERNAME.github.io/your-repo-name`
5. **Save**

## Step 6: Your Live URL

```
https://YOUR-USERNAME.github.io/your-repo-name
```

---

## 👥 User Access:

**Can others use it?** ✅ YES!

**How:**
1. Share your GitHub Pages URL
2. They open it in browser
3. They sign in with their Google account
4. They select their folder
5. They generate reports!

**For testing mode:** Add their emails as test users in Google Cloud Console

**For production:** Publish the app (unlimited users)

---

**Ready? Let's deploy!** 🚀

