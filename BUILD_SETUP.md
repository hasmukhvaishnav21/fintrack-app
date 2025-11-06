# Fintrack Android APK Build Setup

## 🚀 GitHub pe Code Push Kaise Karein

### Step 1: GitHub Repository Banayein
1. [GitHub.com](https://github.com) pe jayein
2. "New Repository" button click karein
3. Repository details bharein:
   - **Name**: `fintrack-mobile` (ya koi bhi naam)
   - **Visibility**: Public ya Private (aapki marzi)
   - ⚠️ **Important**: README, .gitignore ya LICENSE add **MAT** karein (blank repository chahiye)
4. "Create repository" click karein

### Step 2: Terminal Commands (In Order)

GitHub repository page pe ye commands dikhenge. Apne repository ke URL ke saath:

```bash
# GitHub remote add karein (apna URL dalein)
git remote add origin https://github.com/YOUR_USERNAME/fintrack-mobile.git

# Code ko commit karein
git add .
git commit -m "Initial commit: Fintrack mobile app with withdrawal feature"

# Main branch set karein aur push karein
git branch -M main
git push -u origin main
```

**Replace karein:**
- `YOUR_USERNAME` → Apna GitHub username
- `fintrack-mobile` → Apna repository name

### Step 3: GitHub Authentication

Push karte waqt GitHub credentials maangega:
- **Username**: Apna GitHub username
- **Password**: Personal Access Token (PAT) use karein

#### Personal Access Token Kaise Banayein:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Scopes select karein: `repo` (full control)
4. Token copy karein (password ke jagah use karein)

---

## 📱 Automatic APK Build Setup

Jab aap code GitHub pe push karenge, automatically APK build ho jayega!

### Kaise Kaam Karta Hai:

1. **GitHub Actions**: `.github/workflows/android-build.yml` file automatically APK build karti hai
2. **Trigger**: Jab bhi aap `main` branch pe code push karte ho
3. **Output**: Build complete hone pe APK download kar sakte ho

### APK Kahan Milega:

#### Method 1: GitHub Actions Tab (Har Push Pe)
1. GitHub repository → "Actions" tab
2. Latest workflow run click karein
3. Scroll down → "Artifacts" section
4. **"fintrack-debug-apk"** download karein
5. ZIP extract karein → `app-debug.apk` milega

#### Method 2: Releases (Tags Pe)
Version release karne ke liye:

```bash
# Version tag create karein
git tag v1.0.0
git push origin v1.0.0
```

GitHub pe "Releases" section mein APK automatically add ho jayega.

---

## 🔧 Local Build (Apne Computer Pe)

Agar local pe build karna hai:

### Prerequisites:
- Node.js 20+
- Java JDK 17
- Android Studio (Android SDK ke liye)

### Commands:

```bash
# Dependencies install karein
npm install

# Web build banayein
npm run build

# Android sync karein
npx cap sync android

# Android Studio mein open karein
npx cap open android
```

Android Studio mein: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## 📦 Build Configuration

### App Details:
- **App Name**: Fintrack
- **Package ID**: com.fintrack.app
- **Version**: 1.0 (versionCode: 1)

### Update Kaise Karein:

**Version Number:**
Edit `android/app/build.gradle`:
```gradle
versionCode 2        // Har release pe +1 karein
versionName "1.1"    // User-facing version
```

**App Name:**
Edit `capacitor.config.ts`:
```typescript
appName: 'Fintrack'  // Apna naam
```

---

## 🎯 Quick Reference

### First Time Setup:
```bash
git remote add origin https://github.com/USERNAME/REPO.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### Daily Development:
```bash
git add .
git commit -m "Your message here"
git push
# APK automatically build ho jayega GitHub Actions mein
```

### New Version Release:
```bash
# build.gradle mein versionCode aur versionName update karein
git add .
git commit -m "Release v1.1.0"
git tag v1.1.0
git push origin main --tags
# Release mein APK automatically add ho jayega
```

---

## ⚙️ Features in APK

✅ Phone OTP Authentication  
✅ Transaction Tracking  
✅ Gold/Silver Investment with P/L  
✅ Savings Goals Management  
✅ Community Investment (Group Gold Buying)  
✅ **Individual Withdrawal Rights** (New!)  
✅ Dark Theme Design  
✅ Offline Demo Mode  

---

## 🆘 Troubleshooting

### "Permission denied" Error:
```bash
cd android
chmod +x gradlew
```

### Build Fail Ho Rahi Hai:
1. GitHub → Actions → Failed workflow
2. Logs check karein
3. Error message copy karein aur Google/ChatGPT se help lein

### APK Install Nahi Ho Raha:
- "Unknown Sources" enable karein Settings mein
- Old version uninstall karke try karein

---

## 📞 Support

Issues ya questions ke liye:
1. GitHub repository mein "Issues" tab use karein
2. Error logs share karein (GitHub Actions se)
3. Screenshots attach karein

Happy Building! 🎉
