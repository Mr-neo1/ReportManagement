# ✅ Testing Checklist

## 🎯 What to Test:

### 1. App Loads ✅
- [ ] Open: `http://localhost:5173`
- [ ] App loads without errors
- [ ] See the Mail Server Report Generator interface

### 2. Settings Modal ✅
- [ ] Click ⚙️ Settings button (top-right)
- [ ] Modal opens
- [ ] See Google Drive Settings section

### 3. Google Drive Sign In ✅
- [ ] Click "Sign In to Google Drive"
- [ ] Google sign-in popup appears
- [ ] Select your Google account
- [ ] Click "Allow" to grant permissions
- [ ] See "Successfully signed in!" message

### 4. Select Base Folder ✅
- [ ] Click "Select Folder" or "Enter Folder ID"
- [ ] Either:
   - Use folder picker to select a folder, OR
   - Enter a folder ID manually
- [ ] See folder name displayed
- [ ] Click "Done"

### 5. Generate Report ✅
- [ ] Fill in Report Date (use Today)
- [ ] Fill in Report Cycle (e.g., "Test Cycle 01")
- [ ] Fill in Start Time (click "Now" button)
- [ ] Fill in Daily Target (e.g., 100)
- [ ] Fill in Total Sent Today (e.g., 50)
- [ ] Add any test emails
- [ ] Upload screenshots (optional)

### 6. Upload to Drive ✅
- [ ] Click "Upload to Drive" button
- [ ] See "Creating folder structure..." message
- [ ] See "Uploading report to Drive..." message
- [ ] See "✓ Report uploaded successfully!" message
- [ ] Check Google Drive for file:
   - Navigate to: `Base Folder/YYYY/YYYY-MM-DD/Test Cycle 01/`
   - Find: `Mail_Report_YYYY-MM-DD_Test_Cycle_01.doc`

### 7. Download Word ✅
- [ ] Click "Download Word" button
- [ ] File downloads to Downloads folder
- [ ] Open file and verify formatting

---

## 🐛 Common Issues:

### Issue: "Google Client ID not configured"
**Fix:**
- Check `.env` file exists
- Restart dev server (Ctrl+C, then `npm run dev`)

### Issue: "Access blocked"
**Fix:**
- Add your email as test user in Google Cloud Console
- Check OAuth consent screen is configured

### Issue: Can't sign in
**Fix:**
- Verify Client ID is correct in `.env`
- Check browser console for errors (F12)

### Issue: Folder not found
**Fix:**
- Make sure you selected a folder in Settings
- Verify folder ID is correct

---

## ✅ Success Criteria:

All of these should work:
- ✅ App loads
- ✅ Can sign in
- ✅ Can select folder
- ✅ Can generate report
- ✅ Can upload to Drive
- ✅ File appears in correct folder structure
- ✅ Can download Word doc

---

## 🚀 After Testing:

Once everything works:
1. ✅ We'll deploy to GitHub Pages
2. ✅ Update OAuth for production
3. ✅ Test on live site

---

**Dev server is running! Open http://localhost:5173 and test!** 🎉

