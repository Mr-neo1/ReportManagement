# 📝 Add Your Credentials to .env File

## ✅ I've Created:
- `.env` file in your project root with a template

## 📋 What You Need to Do:

### Step 1: Open .env File

Open the `.env` file in your project folder:
- Location: `C:\Users\rkrai\OneDrive\Desktop\ReportAutomation\.env`
- You can open it in Notepad, VS Code, or any text editor

### Step 2: Get Your Project Number (for App ID)

1. **Go back to Google Cloud Console**
2. **Click ☰ Menu** (top left, 3 horizontal lines)
3. **Click: IAM & Admin**
4. **Click: Settings**
5. **Find: Project number** (it's a long number like `123456789012`)
   - **OR** use **Project ID** (shorter, like `reportmanagement`)
6. **Copy this number**

### Step 3: Edit .env File

Replace the template values with your actual credentials:

```env
VITE_GOOGLE_CLIENT_ID=paste-your-actual-client-id-here
VITE_GOOGLE_APP_ID=paste-your-project-number-here
```

**Example:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=123456789012
```

### Step 4: Save the File

- **Save** the `.env` file
- Make sure there are **no spaces** around the `=` sign
- Make sure there are **no quotes** around the values

---

## ✅ Verification:

Your `.env` file should look like:
```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=your-project-number
```

**Important:**
- ✅ No spaces around `=`
- ✅ No quotes
- ✅ Real values (not "your-client-id-here")
- ✅ File is saved

---

## 🚀 After Adding Credentials:

Once you've saved your `.env` file with real values:

1. **Test locally:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:5173

3. **Test Drive integration:**
   - Click ⚙️ Settings button
   - Sign in to Google Drive
   - Select a folder
   - Generate a test report
   - Upload to Drive

---

## 💡 Quick Checklist:

- [ ] Opened `.env` file
- [ ] Got Project Number from Google Cloud Console
- [ ] Replaced `your-client-id-here` with your actual Client ID
- [ ] Replaced `your-project-number-here` with your Project Number
- [ ] Saved the file
- [ ] No spaces or quotes in the file

---

**Let me know when you've added your credentials and saved the file!** 🎉

Then we'll test it with `npm run dev`!

