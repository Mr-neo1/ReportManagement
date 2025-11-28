# 🔧 Setting Up .env File

## ✅ You Have:
- Client ID from Google Cloud Console

## 📝 Next Steps:

### Step 1: Add Your Client ID to .env

I'll help you create the `.env` file. You need to add your Client ID.

**Format:**
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=your-project-number-or-id
```

### Step 2: Get Your App ID (Project Number)

You need your **Project Number** or **Project ID** for the App ID:

1. In Google Cloud Console, click **☰ Menu** (top left)
2. Click **IAM & Admin** → **Settings**
3. Find **Project number** (long number like `123456789012`)
4. **OR** use **Project ID** (shorter, like `reportmanagement`)

### Step 3: Edit .env File

Open the `.env` file in your project root and add:

```env
VITE_GOOGLE_CLIENT_ID=paste-your-client-id-here
VITE_GOOGLE_APP_ID=paste-your-project-number-here
```

**Replace:**
- `paste-your-client-id-here` → Your actual Client ID
- `paste-your-project-number-here` → Your Project Number or Project ID

---

## 🚀 After .env is Set Up:

1. Test locally: `npm run dev`
2. Sign in to Google Drive in the app
3. Upload a test report
4. Deploy to GitHub Pages

---

**Let me know when you've added your Client ID to the .env file!**

