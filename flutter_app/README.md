# Fintrack - Flutter Mobile App 📱

Fintrack ka complete Flutter version with same design, UI/UX aur functionality!

## ✨ Features

### 💰 Financial Management
- **Dashboard** - Balance, income, expense tracking
- **Transactions** - Income/expense management with emoji categories
  - Income: Salary 💼, Freelance 💻, Business 🏢, Investment 📈, Gift 🎁, Other 💰
  - Expense: Food 🍔, Shopping 🛍️, Transport 🚗, Bills 📱, Entertainment 🎬, Health 💊, Education 📚, Travel ✈️, Other 💸

### 📊 Investments
- Gold and Silver tracking
- Real-time value calculation
- Profit/Loss display with percentage

### 🎯 Savings Goals
- Multiple goals with progress tracking
- Emoji icons for each goal type
- Target amount and date tracking

### 📈 Insights
- Spending by category
- Savings rate calculation
- Visual progress bars

### 🎨 Design
- **Dark Theme** - Premium black design (#0A0A0A background, #141414 cards)
- **Same UI/UX** - Identical to React version
- **Smooth Animations** - Framer Motion-like transitions
- **Gradient Headers** - Beautiful blue gradients

## 🚀 Setup Instructions

### Prerequisites
1. **Flutter SDK** installed ([Download](https://flutter.dev/docs/get-started/install))
2. **Android Studio** or **VS Code** with Flutter extensions
3. **Android Emulator** or **Physical Device**

### Installation Steps

#### 1. Create New Flutter Project in Replit
```bash
# Create a new Replit with Flutter template
# OR use this on your local machine
```

#### 2. Copy Flutter Code
```bash
# Copy all files from flutter_app folder to your Flutter project
# Replace the lib/ folder with the new lib/ folder
# Replace pubspec.yaml with the new pubspec.yaml
```

#### 3. Install Dependencies
```bash
flutter pub get
```

#### 4. Run the App
```bash
# On emulator
flutter run

# On physical device (with USB debugging)
flutter run

# For web (experimental)
flutter run -d chrome
```

## 📁 Project Structure

```
lib/
├── main.dart                  # App entry point
├── theme/
│   └── app_theme.dart         # Dark theme configuration
├── models/
│   ├── transaction.dart       # Transaction data model
│   ├── investment.dart        # Investment data model
│   └── goal.dart              # Goal data model
├── providers/
│   └── app_state.dart         # State management (Provider)
├── screens/
│   ├── home_screen.dart       # Dashboard
│   ├── transactions_screen.dart # Transaction list
│   ├── investments_screen.dart  # Investment tracking
│   ├── goals_screen.dart        # Goals list
│   └── insights_screen.dart     # Analytics
└── widgets/
    ├── add_transaction_modal.dart  # Add income/expense modal
    ├── add_investment_modal.dart   # Add investment modal
    └── add_goal_modal.dart         # Add goal modal
```

## 🔧 Key Technologies

- **Flutter** - UI Framework
- **Provider** - State Management
- **SharedPreferences** - Local Data Storage
- **Google Fonts** - Inter font family
- **Intl** - Date and currency formatting
- **UUID** - Unique ID generation

## 📱 Build APK (Android)

```bash
# Build release APK
flutter build apk --release

# APK will be at: build/app/outputs/flutter-apk/app-release.apk
```

## 🍎 Build iOS App

```bash
# Build iOS app (requires Mac)
flutter build ios --release
```

## 💾 Data Storage

- **Local Storage** using SharedPreferences
- Data persists between app launches
- No backend required (fully offline)

## 🎨 Customization

### Change Colors
Edit `lib/theme/app_theme.dart`:
```dart
static const Color background = Color(0xFF0A0A0A);
static const Color primary = Color(0xFF3B82F6);
```

### Add New Categories
Edit category lists in:
- `lib/widgets/add_transaction_modal.dart`
- Category emoji mappings in screens

### Change Gold/Silver Prices
Edit in `lib/providers/app_state.dart`:
```dart
final double goldPrice = 6750.0;
final double silverPrice = 92.0;
```

## 🐛 Troubleshooting

### "Package not found" errors
```bash
flutter pub get
flutter clean
flutter pub get
```

### App not running
```bash
flutter doctor
# Fix any issues shown
```

### Build errors
```bash
flutter clean
flutter pub get
flutter run
```

## 📝 Next Steps

### Features to Add
1. **Backend Integration** - Connect to API
2. **Cloud Sync** - Firebase/Supabase integration
3. **Notifications** - Remind users about goals
4. **Charts** - Add beautiful charts with fl_chart
5. **Export** - PDF/CSV export functionality
6. **Biometric Auth** - Fingerprint/Face ID
7. **Multi-currency** - Support different currencies

### UI Enhancements
1. **Animations** - Add more smooth transitions
2. **Haptic Feedback** - Vibration on interactions
3. **Dark/Light Toggle** - Add theme switching
4. **Onboarding** - Welcome screens for new users

## 🤝 Contributing

This is your personal Fintrack app! Customize it however you like.

## 📄 License

Free to use and modify for personal projects.

---

**Built with ❤️ using Flutter**

Same features, same design, native mobile experience! 🚀
