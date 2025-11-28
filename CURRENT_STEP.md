# 🎯 What to Do RIGHT NOW in Google Cloud Console

## ✅ You've Done:
- [x] Enabled APIs (Drive API, Picker API)

## 📍 WHERE YOU ARE NOW:
You're in Google Cloud Console. Follow these steps **in order**:

---

## Step 1: OAuth Consent Screen (Do This First)

### 1.1 Navigate to OAuth Consent Screen
1. Look at the **left sidebar** (☰ menu if not visible)
2. Click: **APIs & Services**
3. Click: **OAuth consent screen**

### 1.2 Create OAuth Consent Screen
1. You'll see "Choose your user type"
2. Select: **External** (for personal/testing use)
3. Click: **CREATE** button

### 1.3 Fill in App Information
Fill in these fields:

- **App name:** `Mail Server Report Generator`
- **User support email:** Select your email from dropdown
- **Developer contact information:** Enter your email
- Leave other fields empty (they're optional)

Then click: **SAVE AND CONTINUE**

### 1.4 Scopes (Next Page)
1. On the "Scopes" page, you should see:
   - `https://www.googleapis.com/auth/drive.file`
2. If you don't see it:
   - Click **ADD OR REMOVE SCOPES**
   - Search for "drive.file"
   - Check the box
   - Click **UPDATE**
3. Click: **SAVE AND CONTINUE**

### 1.5 Test Users (Next Page)
1. Click: **ADD USERS**
2. Enter your Gmail email address
3. Click: **ADD**
4. Click: **SAVE AND CONTINUE**

### 1.6 Summary (Last Page)
1. Review the information
2. Click: **BACK TO DASHBOARD**

✅ **OAuth Consent Screen is done!**

---

## Step 2: Create OAuth Client ID

### 2.1 Go to Credentials
1. In the left sidebar, click: **APIs & Services**
2. Click: **Credentials** (at the top)

### 2.2 Create OAuth Client ID
1. At the top, click: **+ CREATE CREDENTIALS**
2. From the dropdown, select: **OAuth 2.0 Client ID**

### 2.3 Configure the Client
You'll see a form. Fill it in:

**Application type:**
- Select: **Web application**

**Name:**
- Enter: `Mail Server Reports Web`

**Authorized JavaScript origins:**
- Click: **+ ADD URI**
- Type: `http://localhost:5173`
- Click: **+ ADD URI** again
- Type: `https://YOUR-GITHUB-USERNAME.github.io`
  (Replace YOUR-GITHUB-USERNAME with your actual GitHub username)

**Authorized redirect URIs:**
- Click: **+ ADD URI**
- Type: `http://localhost:5173`
- Click: **+ ADD URI** again
- Type: `https://YOUR-GITHUB-USERNAME.github.io`
  (Same as above)

### 2.4 Create and Copy Client ID
1. Click: **CREATE** button
2. A popup will appear with:
   - **Your Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)
   - **Your Client Secret** (we don't need this)
3. **📋 COPY THE CLIENT ID** - You'll need this next!
4. Click **OK** to close the popup

✅ **OAuth Client ID created!**

---

## Step 3: Get Your Project Number (for App ID)

### Option A: From Settings
1. Click: **☰ Menu** (top left, 3 horizontal lines)
2. Click: **IAM & Admin**
3. Click: **Settings**
4. Find: **Project number** (long number like `123456789012`)
5. **📋 COPY THIS NUMBER** - This is your App ID

### Option B: Use Project ID
- On the same Settings page, find **Project ID**
- You can use this as App ID instead

---

## ✅ What You Should Have Now:

After completing these steps, you should have:

1. ✅ **Client ID** - Looks like: `xxxxx.apps.googleusercontent.com`
2. ✅ **App ID** - Your project number or project ID

---

## 🚀 Next Step (After Google Cloud):

Once you have your Client ID and App ID:

1. We'll create a `.env` file in your project
2. Add your credentials to it
3. Test the app locally
4. Deploy to GitHub Pages

---

## 📝 Quick Reference:

**Your Client ID format:**
```
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Your App ID format:**
```
123456789012  (Project number)
OR
your-project-id  (Project ID)
```

---

## ⏭️ When You're Done Here:

Come back and tell me:
- ✅ "I have my Client ID" 
- ✅ "I have my App ID"

Then we'll create the `.env` file and test everything! 🚀

