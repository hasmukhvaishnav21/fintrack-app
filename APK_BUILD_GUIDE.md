# 📱 Fintrack Android APK Build Guide

## ✅ Setup Complete!

GitHub Actions workflow ban chuka hai jo automatically APK build karega.

## 🚀 APK Kaise Download Karein

### Step 1: GitHub pe Code Push karein

```bash
# Pehle GitHub repository banayein (github.com pe jaake)
# Phir Replit se code push karein:

git init
git add .
git commit -m "Initial commit with Android build"
git remote add origin https://github.com/YOUR_USERNAME/fintrack-app.git
git branch -M main
git push -u origin main
```

### Step 2: Build Automatically Hoga

- Jaise hi aap code push karenge, GitHub Actions automatically start ho jayega
- Build process 5-10 minutes mein complete hoga
- Aap GitHub repository pe "Actions" tab mein progress dekh sakte hain

### Step 3: APK Download Karein

1. **GitHub pe jayein**: `https://github.com/YOUR_USERNAME/fintrack-app`
2. **Actions tab** pe click karein
3. **Latest workflow run** pe click karein (green checkmark wala)
4. **Artifacts** section mein scroll karein
5. **fintrack-debug-apk** download karein (ZIP file)
6. ZIP extract karke **app-debug.apk** milega

### Step 4: Mobile pe Install karein

1. APK file apne phone mein transfer karein
2. APK pe tap karein
3. "Install from unknown sources" allow karein (settings se)
4. Install button press karein
5. ✅ App ready!

## 🔄 Future Builds

Har baar jab aap code change karke GitHub pe push karenge:
- Automatically naya APK banega
- Actions tab se download kar sakte hain

## 📝 Notes

- **Package Name**: `com.fintrack.app`
- **App Name**: Fintrack
- **Build Type**: Debug APK (testing ke liye)
- **File Size**: ~10-15 MB (approx)

## 🛠️ Advanced: Release APK (Play Store ke liye)

Agar aap Play Store pe publish karna chahte hain:

1. Signing key generate karein
2. GitHub Secrets mein add karein
3. Workflow update karke release APK banayein

---

**Happy Building! 🎉**
