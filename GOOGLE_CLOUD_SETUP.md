# 🎯 Google Cloud Console Setup - Step by Step

## ✅ You've Already Done:
- [x] Enabled Google Drive API
- [x] Enabled Google Picker API (optional but recommended)

## 📋 Next Steps:

### Step 1: Configure OAuth Consent Screen (5 minutes)

1. **In Google Cloud Console, go to:**
   - Left sidebar → **APIs & Services** → **OAuth consent screen**

2. **Choose User Type:**
   - Select **External** (unless you have Google Workspace for organization)
   - Click **CREATE**

3. **Fill in App Information:**
   - **App name:** `Mail Server Report Generator`
   - **User support email:** (Select your email from dropdown)
   - **App logo:** (Skip for now - optional)
   - **App domain:** (Leave empty)
   - **Application home page:** (Leave empty or add your GitHub Pages URL)
   - **Authorized domains:** (Leave empty)
   - **Developer contact information:** (Your email)

   Click **SAVE AND CONTINUE**

4. **Scopes:**
   - You should see: `https://www.googleapis.com/auth/drive.file`
   - If not there, click **ADD OR REMOVE SCOPES**
   - Search for "drive.file" and add it
   - Click **SAVE AND CONTINUE**

5. **Test users:**
   - Click **ADD USERS**
   - Add your Gmail email address
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

6. **Summary:**
   - Review everything
   - Click **BACK TO DASHBOARD**

✅ **OAuth Consent Screen is configured!**

---

### Step 2: Create OAuth 2.0 Client ID (3 minutes)

1. **Go to Credentials:**
   - Left sidebar → **APIs & Services** → **Credentials**

2. **Create OAuth Client ID:**
   - Click **+ CREATE CREDENTIALS** at the top
   - Select **OAuth 2.0 Client ID**

3. **Configure OAuth Client:**
   - **Application type:** Select **Web application**
   - **Name:** `Mail Server Reports - Web Client`

4. **Authorized JavaScript origins:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173`
   - Click **+ ADD URI** again
   - Add: `https://your-username.github.io` (replace with your GitHub username)

5. **Authorized redirect URIs:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173`
   - Click **+ ADD URI** again
   - Add: `https://your-username.github.io` (same as above)

6. **Create:**
   - Click **CREATE**

7. **📋 COPY YOUR CLIENT ID:**
   - A popup will appear with your credentials
   - **Client ID** looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **📋 COPY THIS CLIENT ID** - You'll need it in the next step!
   - (You can close the popup - we don't need the Client Secret for this setup)

✅ **OAuth Client ID created!**

---

### Step 3: Get Your Project Number (for App ID)

1. **In Google Cloud Console:**
   - Click the **☰ Menu** (hamburger icon, top left)
   - Select **IAM & Admin** → **Settings**
   - Look for **Project number** (it's a long number like: `123456789012`)
   - **📋 COPY THIS NUMBER** - This is your App ID

OR

2. **Alternative - Use Project ID:**
   - In the same Settings page, find **Project ID**
   - You can use this as App ID too

---

## ✅ What You Should Have Now:

- ✅ **OAuth Consent Screen configured**
- ✅ **OAuth Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
- ✅ **Project Number** or **Project ID** (for App ID)

---

## 🔄 Next Step After Google Cloud:

Once you have your Client ID, we'll:
1. Create `.env` file in your project
2. Add the Client ID
3. Test locally
4. Deploy to GitHub Pages

**Ready for the next step? Let me know when you have your Client ID!** 🚀

