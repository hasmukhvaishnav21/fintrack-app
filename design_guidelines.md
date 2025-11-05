# Fintrack Mobile Dashboard - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium fintech applications (Revolut, N26, Monzo) combined with Indian fintech leaders (CRED, Jupiter) to create a globally appealing yet locally relevant experience.

**Core Design Principles**:
- Trust through clarity: Every data point should be immediately understandable
- Premium simplicity: Minimal elements with maximum impact
- Culturally inclusive: Design patterns that resonate with both Indian and global users
- Glanceable information: Key metrics visible without scrolling

## Color System

**Dark Theme Palette**:
- Primary Blue: #0066FF (trust, stability, primary actions)
- Deep Black: #0A0A0A (main background - very dark)
- Card Black: #141414 (card backgrounds - slightly lighter than main)
- Premium Gold: #D4AF37 (accents, highlights, achievements)
- Dark Gray: #1A1A1A (secondary backgrounds)
- Text Primary: #F5F5F5 (light text for readability)
- Text Secondary: #A0A0A0 (muted text)
- Border Color: #2A2A2A (subtle borders)

## Typography

**Font Family**: Inter (via Google Fonts CDN) for exceptional readability at small mobile sizes

**Hierarchy**:
- Greeting/Headers: 24px, Semi-bold (600)
- Card Titles: 16px, Medium (500)
- Primary Values: 32px, Bold (700) for balance amounts
- Body Text: 14px, Regular (400)
- Labels/Captions: 12px, Medium (500)
- Bottom Nav Labels: 10px, Medium (500)

## Layout System

**Spacing Units**: Tailwind primitives of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Card padding: p-4 (16px)
- Section spacing: space-y-6 (24px between major sections)
- Element gaps: gap-3 (12px for related items)
- Screen margins: px-4 (16px horizontal padding)

**Container Structure**:
- Max width: 428px (iPhone 14 Pro Max reference)
- Safe areas: Account for status bar and bottom navigation
- Scrollable content area between top greeting and bottom nav

## Component Library

### Welcome Section
- Personalized greeting with user name
- Subtext showing savings growth metric
- Top-aligned with py-6 spacing
- Dark background (#0A0A0A)

### Summary Card
- Rounded corners: rounded-2xl (16px radius)
- Dark elevated background (#141414)
- Blue accent for primary information
- Light text for contrast
- Merged balance display with income/expense breakdown
- Large value display for total balance

### Goal Progress Section
- Horizontal scroll for multiple goals (3-4 visible)
- Progress bars with percentage display
- Goal cards: rounded-xl, dark card background (#141414), subtle borders
- Icon above, progress bar center, goal name and amount below
- Light text on dark backgrounds

### Recent Transactions List
- Section header with "Recent Transactions" and "View All" link
- Three transaction rows maximum
- Each row: category icon (left) | transaction name & date (center) | amount (right)
- Icons: 40px circular containers with colored backgrounds
- Divider lines between items
- Icons: Heroicons via CDN for consistency

### Live Prices Widget
- Compact horizontal ticker format
- Three columns: Gold | Silver | Crypto
- Each showing: asset name, current price, percentage change
- Green/red indicators for price movement
- Subtle animation for price updates

### Bottom Navigation
- Fixed position at bottom
- Five evenly spaced icons: Home, Expenses, Add Goal, Insights, Profile
- Active state: blue icon with gold underline accent
- Inactive state: gray icons
- Icon size: 24px
- Labels: 10px below icons
- Safe area padding for notched devices

## Illustrations & Icons

**Icons**: Heroicons (outline style) via CDN
- Navigation: home, chart-bar, plus-circle, light-bulb, user-circle
- Transaction categories: shopping-bag, utensils, car, phone, etc.
- Consistent 24px size throughout

**Illustrations**: Flat, geometric style
- Minimal color palette matching brand colors
- Used sparingly for empty states or achievements
- SVG format for crisp rendering

## Card Design System

**Standard Card Pattern**:
- Background: dark card (#141414)
- Border radius: rounded-2xl (16px)
- Subtle border: #2A2A2A
- Padding: p-4 for content
- Spacing between cards: mb-4
- Light text for readability

**Premium Card (Summary)**:
- Background: dark elevated (#141414)
- Border radius: rounded-2xl
- Blue accent border or highlights
- Padding: p-6 for emphasis
- Light text on dark background

## Animations & Micro-interactions

**Implementation**: Framer Motion library for smooth, performant animations

**Goal Progress Animation**:
- Circular progress fills from 0 to target percentage on load
- Duration: 1.2s with easeOut timing
- Stagger effect: 0.15s delay between multiple goals

**Card Entrance**:
- Subtle fade-in with slight upward motion
- Duration: 0.4s
- Stagger: 0.1s per card from top to bottom

**Live Price Updates**:
- Gentle pulse on price change
- Color transition for positive/negative movements
- Duration: 0.3s

**Bottom Nav Interaction**:
- Active icon scales to 1.1x with spring animation
- Gold accent slides in from left (0.2s)
- Haptic feedback (when available)

**Touch Interactions**:
- Buttons: Scale to 0.97 on press with 0.1s duration
- Cards: Slight elevation increase on press
- No hover states (mobile-first)

## Accessibility

- Minimum touch target: 44x44px for all interactive elements
- Color contrast: WCAG AA compliant (especially on blue backgrounds)
- Text remains readable at system font size adjustments
- Clear focus indicators for keyboard navigation
- Semantic HTML structure for screen readers

## Responsive Considerations

**Portrait Orientation (Primary)**:
- Vertical scrolling content
- Bottom navigation fixed
- Single column layout throughout

**Landscape (Secondary)**:
- Maintain portrait layout, allow horizontal scroll
- Bottom nav remains accessible

## Typography Sizing

- Mobile-optimized: Base 14px ensures readability without zoom
- Large numbers (balance): 32-36px for at-a-glance comprehension
- Hierarchy through weight and size, not just color

This design system prioritizes clarity, trust, and ease of use while maintaining a premium aesthetic suitable for both Indian and global markets.