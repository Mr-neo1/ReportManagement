# 🎯 Google Auth Platform Setup - NEW Interface

## ✅ You're On:
- Google Auth Platform / Overview page
- Shows "Google Auth Platform not configured yet"

## 📍 What to Do Next:

### Step 1: Start Configuration

1. **Click the blue "Get started" button** on the main page
   - This will begin the OAuth setup process

### Step 2: Configure Your Application (After clicking "Get started")

You'll go through a setup wizard. Here's what to fill in:

#### App Information:
- **Application name:** `Mail Server Report Generator`
- **Application homepage:** (Leave empty or add your GitHub Pages URL later)
- **Support email:** Select your email from dropdown
- **Application logo:** (Skip - optional)

#### Scopes:
- The wizard will ask about scopes/permissions
- Make sure **Google Drive API** scope is included
- Look for: `https://www.googleapis.com/auth/drive.file`

#### Authorized Domains:
- For local testing: `localhost`
- For GitHub Pages: `github.io`
- Click **Add** for each

Click **Save and Continue** through each step.

---

### Step 3: Create OAuth Client (In "Clients" Section)

After the initial setup:

1. **In the left sidebar, click: "Clients"**
   - (It has a grid icon)

2. **Click "+ CREATE CLIENT" or "Add client"**

3. **Configure Web Application Client:**
   - **Application type:** Select **Web application**
   - **Name:** `Mail Server Reports Web`

4. **Authorized JavaScript origins:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173`
   - Click **+ ADD URI** again  
   - Add: `https://YOUR-GITHUB-USERNAME.github.io`
     (Replace with your actual GitHub username)

5. **Authorized redirect URIs:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173`
   - Click **+ ADD URI** again
   - Add: `https://YOUR-GITHUB-USERNAME.github.io`
     (Same as above)

6. **Click "CREATE" or "SAVE"**

7. **📋 COPY YOUR CLIENT ID**
   - After creating, you'll see your Client ID
   - It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **COPY THIS** - You'll need it!

---

### Step 4: Add Test Users (In "Audience" Section)

1. **In the left sidebar, click: "Audience"**
   - (Person icon)

2. **Click "ADD USERS" or "+ Add"**

3. **Add your Gmail email address**

4. **Click "ADD"**

---

### Alternative: If You See the Old Interface

If clicking "Get started" takes you to the old interface, use these steps:

1. In left sidebar: **APIs & Services** → **OAuth consent screen**
2. Follow the steps from `CURRENT_STEP.md`

---

## ✅ After Setup, You'll Have:

- ✅ OAuth application configured
- ✅ Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
- ✅ Test users added

---

## 🚀 Next Steps After This:

Once you have your **Client ID**, we'll:
1. Create `.env` file in your project
2. Add your Client ID
3. Test locally with `npm run dev`
4. Deploy to GitHub Pages

---

## 💡 Tips:

- If you get stuck, look for "Clients" in the left sidebar
- The Client ID is what you need most!
- You can always go back to edit settings later

---

**Ready? Click "Get started" and let me know what you see!** 🚀

