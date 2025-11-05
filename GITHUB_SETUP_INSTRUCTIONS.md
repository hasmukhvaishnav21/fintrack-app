# 🚀 GitHub Setup & APK Build - Complete Guide

## Step 1: GitHub Repository Banayein

1. **GitHub pe jayein**: https://github.com
2. Login karein (ya new account banayein)
3. **New Repository** button click karein (green button, top-right)
4. Repository details:
   - **Name**: `fintrack-app`
   - **Description**: "Fintrack - Mobile Financial Dashboard"
   - **Public** ya **Private** - koi bhi choose kar sakte hain
   - **DON'T** initialize with README/gitignore (already hai)
5. **Create Repository** button click karein

## Step 2: Replit Shell Mein Git Setup

Replit ke **Shell** tab mein yeh commands run karein:

```bash
# Step 1: Git repository initialize karein (agar already nahi hai)
git init

# Step 2: GitHub username aur email set karein
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Step 3: Sabhi files add karein
git add .

# Step 4: First commit banayein
git commit -m "Initial commit - Fintrack Android app with GitHub Actions"

# Step 5: Main branch rename karein (agar master hai)
git branch -M main

# Step 6: GitHub repository link karein
# IMPORTANT: Apna GitHub username yahaan replace karein
git remote add origin https://github.com/YOUR_USERNAME/fintrack-app.git

# Step 7: Code push karein
git push -u origin main
```

### ⚠️ Important:
- **YOUR_USERNAME** ko apne actual GitHub username se replace karein
- **Your Name** aur **your-email@example.com** bhi change karein

## Step 3: GitHub Actions Build Dekh

1. **GitHub repository** pe jayein: `https://github.com/YOUR_USERNAME/fintrack-app`
2. **Actions** tab click karein (top menu mein)
3. **Build Android APK** workflow automatically start ho jayega
4. Build ka status dekhein:
   - ⏳ Yellow = Building (5-10 minutes)
   - ✅ Green = Success
   - ❌ Red = Failed (mujhe batana, main fix karunga)

## Step 4: APK Download Karein

Jab build **green ✓** ho jaye:

1. GitHub repository → **Actions** tab
2. Latest workflow run pe click karein
3. Niche scroll karein → **Artifacts** section
4. **fintrack-debug-apk** download karein (ZIP file)
5. ZIP extract karein
6. **app-debug.apk** file milegi

## Step 5: Mobile Pe Install Karein

1. APK file phone mein transfer karein (USB, WhatsApp, etc.)
2. File Manager se APK file pe tap karein
3. **"Install from unknown sources"** allow karein (Settings se):
   - Settings → Security → Unknown Sources → Enable
4. **Install** button press karein
5. ✅ **App installed!**

---

## 🔄 Future Updates

Jab bhi aap code change karenge aur GitHub pe push karenge:
- Automatically naya APK build hoga
- Actions tab se download kar sakte hain

---

## ❓ Problems?

Agar koi issue aaye toh mujhe batayein:
- Git commands fail ho rahe hain?
- GitHub Actions red ho gaya?
- APK install nahi ho raha?

Main help karunga! 💪

---

## 📝 Quick Reference

**GitHub Repo URL Format**:
```
https://github.com/YOUR_USERNAME/fintrack-app.git
```

**Check Git Status**:
```bash
git status
```

**Check Remote**:
```bash
git remote -v
```

**Force Push (agar already pushed hai)**:
```bash
git push -f origin main
```
