# 🧪 Testing Your App Locally

## ✅ You've Completed:
- [x] Google Cloud Console setup
- [x] OAuth Client ID created
- [x] Credentials added to `.env` file

## 🚀 Now Let's Test!

### Step 1: Start Development Server

Run this command in your terminal (PowerShell or CMD):

```bash
npm run dev
```

**What to expect:**
- Vite will start the development server
- You'll see a URL like: `http://localhost:5173`
- The terminal will show "Local: http://localhost:5173"

### Step 2: Open in Browser

1. **Open your browser** (Chrome, Edge, Firefox)
2. **Go to:** `http://localhost:5173`
3. **You should see:** Your Mail Server Report Generator app!

### Step 3: Test Google Drive Integration

#### 3.1 Sign In to Google Drive

1. **Click the ⚙️ Settings button** (top-right corner)
2. **Click "Sign In to Google Drive"**
3. **A popup will appear:**
   - Select your Google account
   - Click "Allow" to grant permissions
4. **You should see:** "Successfully signed in!" message

#### 3.2 Select Base Folder

1. **Still in Settings, scroll down**
2. **Click "Select Folder"** (or "Enter Folder ID")
3. **If using folder picker:**
   - Choose/create a folder in Google Drive (e.g., "Mail Reports")
   - Click "Select"
4. **You should see:** Folder name displayed
5. **Click "Done"** to close Settings

#### 3.3 Generate and Upload Test Report

1. **Fill in report details:**
   - Report Date: Today's date
   - Report Cycle: "Test Cycle 01"
   - Start Time: Click "Now" button or enter time
   - Daily Target: 100 (or any number)
   - Total Sent Today: 50 (or any number)
   - Fill in other fields as needed

2. **Click "Upload to Drive"** button

3. **Watch for status messages:**
   - "Creating folder structure..."
   - "Uploading report to Drive..."
   - "✓ Report uploaded successfully!"

4. **Check Google Drive:**
   - Go to your Google Drive
   - Navigate to: `Base Folder/YYYY/YYYY-MM-DD/Test Cycle 01/`
   - You should see: `Mail_Report_YYYY-MM-DD_Test_Cycle_01.doc`

### Step 4: Test Download

1. **Click "Download Word"** button
2. **File should download** to your Downloads folder
3. **Open it** to verify it's formatted correctly

---

## ✅ Success Checklist:

- [ ] App loads at `http://localhost:5173`
- [ ] Settings modal opens
- [ ] Can sign in to Google Drive
- [ ] Can select/create base folder
- [ ] Can generate a report
- [ ] Can upload report to Drive
- [ ] File appears in correct folder structure in Drive
- [ ] Can download Word document locally

---

## 🐛 Troubleshooting

### "Google Client ID not configured"
- ✅ Check `.env` file exists
- ✅ Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- ✅ Restart dev server: Stop it (Ctrl+C) and run `npm run dev` again

### "Access blocked" error
- ✅ Check OAuth consent screen has test users added
- ✅ Verify redirect URIs match exactly: `http://localhost:5173`
- ✅ Make sure Client ID is correct

### "Folder not found"
- ✅ Make sure you selected a folder in Settings
- ✅ Verify folder ID is correct if entered manually

### App won't load
- ✅ Check terminal for errors
- ✅ Verify all dependencies installed: `npm install`
- ✅ Try clearing cache: Delete `node_modules` and run `npm install` again

---

## 🎉 Next Steps After Testing:

Once everything works locally:

1. ✅ **Deploy to GitHub Pages**
2. ✅ **Update OAuth settings** for production URL
3. ✅ **Test on live site**
4. ✅ **Share with your team!**

---

**Ready to test? Run `npm run dev` and open `http://localhost:5173`!** 🚀

