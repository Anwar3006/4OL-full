# 🎨 Theme Migration Guide: Reference Project → Current Project

## 📋 Overview
This document outlines all theme elements, design patterns, and chart configurations to migrate from the reference project to the current 4OL project.

---

## 🎨 Theme Configuration

### 1. Typography
```javascript
// Add to tailwind.config.ts
fontFamily: {
  inter: ["Inter", "sans-serif"],
}
```

**Implementation**:
- Install Inter font: Add to `layout.tsx` or `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```
- Update body font: `font-family: 'Inter', sans-serif;`

---

### 2. Color System

#### Primary Colors
```javascript
primary: {
  50: "#F6F8FF",
  100: "#EDF0FF",
  200: "#D1DAFE",
  300: "#B4C2FD",
  400: "#8092FF",
  500: "#4669fa",  // Main primary
  600: "#3F5EDF",
  700: "#2A3F96",
  800: "#203071",
  900: "#151F49",
}
```

#### Secondary/Gray Colors
```javascript
secondary: {
  50: "#F9FAFB",
  100: "#F4F5F7",
  200: "#E5E7EB",
  300: "#D2D6DC",
  400: "#9FA6B2",
  500: "#A0AEC0",
  600: "#475569",
  700: "#334155",
  800: "#56ce84",  // Special accent
  900: "#0F172A",
}
```

#### Success Colors
```javascript
success: {
  50: "#F3FEF8",   // Light green background
  100: "#E7FDF1",
  200: "#C5FBE3",
  300: "#A3F9D5",
  400: "#5FF5B1",
  500: "#50C793",  // Main success
  600: "#3F9A7A",
  700: "#2E6D61",
  800: "#1F4B47",
  900: "#0F2A2E",
}
```

#### Warning Colors
```javascript
warning: {
  50: "#FFFAF8",   // Light orange background
  100: "#FFF4F1",
  200: "#FEE4DA",
  300: "#FDD2C3",
  400: "#FCB298",
  500: "#FA916B",  // Main warning
  600: "#DF8260",
  700: "#965741",
  800: "#714231",
  900: "#492B20",
}
```

#### Info Colors
```javascript
info: {
  50: "#F3FEFF",   // Light cyan background
  100: "#E7FEFF",
  200: "#C5FDFF",
  300: "#A3FCFF",
  400: "#5FF9FF",
  500: "#0CE7FA",  // Main info
  600: "#00B8D4",
  700: "#007A8D",
  800: "#005E67",
  900: "#003F42",
}
```

#### Danger Colors
```javascript
danger: {
  50: "#FFF7F7",   // Light red background
  100: "#FEEFEF",
  200: "#FCD6D7",
  300: "#FABBBD",
  400: "#F68B8D",
  500: "#F1595C",  // Main danger
  600: "#D75052",
  700: "#913638",
  800: "#6D292A",
  900: "#461A1B",
}
```

---

### 3. Custom Shadows
```javascript
boxShadow: {
  base: "0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)",
  base2: "0px 2px 4px rgba(40, 41, 61, 0.04), 0px 8px 16px rgba(96, 97, 112, 0.16)",
  base3: "16px 10px 40px rgba(15, 23, 42, 0.22)",
  deep: "-2px 0px 8px rgba(0, 0, 0, 0.16)",
  dropdown: "0px 4px 8px rgba(0, 0, 0, 0.08)",
}
```

**Usage**: Use `shadow-base` for cards instead of default `shadow-md`

---

### 4. Custom Animations
```javascript
keyframes: {
  zoom: {
    "0%, 100%": { transform: "scale(0.5)" },
    "50%": { transform: "scale(1)" },
  },
  tada: {
    "0%": { transform: "scale3d(1, 1, 1)" },
    "10%, 20%": { transform: "scale3d(1, 1, 0.95) rotate3d(0, 0, 1, -10deg)" },
    "30%, 50%, 70%, 90%": { transform: "scale3d(1, 1, 1) rotate3d(0, 0, 1, 10deg)" },
    "40%, 60%, 80%": { transform: "rotate3d(0, 0, 1, -10deg)" },
    "100%": { transform: "scale3d(1, 1, 1)" },
  },
},
animation: {
  "spin-slow": "spin 3s linear infinite",
  zoom: "zoom 1s ease-in-out infinite",
  tada: "tada 1.5s ease-in-out infinite",
}
```

---

## 🃏 Card Component Design

### Base Card Styling
```typescript
// Card wrapper classes
className="card rounded-md w-full bg-white dark:bg-slate-800 shadow-base"

// Header classes
headerClass="flex max-sm:flex-col sm:justify-between sm:items-center items-start"

// Body classes
bodyClass="p-6"

// Title classes
titleClass="card-title text-base font-medium"
```

### Card Variants
```typescript
// Standard card
<Card className="bg-white dark:bg-slate-800 shadow-base">

// Bordered card (alternative)
<Card className="border border-slate-200 dark:border-slate-700">

// Colored background cards (for stats)
<Card className="bg-success-50">      // Light green
<Card className="bg-warning-50">      // Light orange
<Card className="bg-info-50">         // Light cyan
<Card className="bg-yellow-50">       // Light yellow
```

### Card with Header Slot
```jsx
<Card 
  title="Analytics Dashboard"
  headerslot={
    <TimePeriodFilter 
      selectedPeriod={selectedPeriod}
      onPeriodChange={handlePeriodChange}
      className="ml-auto max-sm:mt-2"
    />
  }
  bodyClass="p-4"
  headerClass="flex max-sm:flex-col sm:justify-between items-center"
>
  {/* Card content */}
</Card>
```

---

## 📊 Analytics Page Layout

### Page Structure
```jsx
<div className="grid grid-cols-12 gap-5 mb-5">
  <div className="2xl:col-span-12 lg:col-span-12 col-span-12">
    <Card 
      title="Analytics Dashboard"
      headerslot={<TimePeriodFilter />}
      bodyClass="p-4"
    >
      {/* Stats Grid */}
      {/* Charts Grid */}
    </Card>
  </div>
</div>
```

---

### 1. Top Stats Grid (4 Cards)

**Layout**:
```jsx
<div className="grid md:grid-cols-4 col-span-1 gap-4">
  <GroupChart1
    totalDownloads={totalDownloads || 0}
    totalUsers={totalUsers?.totalUsers || 0}
    totalFacilities={totalFacilities?.totalFacilities || 0}
    totalSpecialists={totalSpecialists?.totalSpecialists || 0}
  />
</div>
```

**Individual Stat Card**:
```jsx
<div className="py-[18px] px-4 rounded-[6px] bg-[#c7f2d7]">  // Or other pastel bg
  <div className="flex items-center space-x-6 rtl:space-x-reverse flex-wrap justify-center">
    {/* Mini chart */}
    <div className="flex-none">
      {/* Small area chart (48x48px) */}
    </div>
    
    {/* Stats text */}
    <div className="flex-1 my-1 text-center">
      <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
        Total Users
      </div>
      <div className="text-slate-900 text-2xl dark:text-white font-medium">
        1,234
      </div>
    </div>
  </div>
</div>
```

**Stat Card Backgrounds**:
- Card 1: `bg-[#c7f2d7]` (Light green)
- Card 2: `bg-[#E5F9FF]` (Light cyan)
- Card 3: `bg-[#FFEDE5]` (Light orange)
- Card 4: `bg-[#c7f2d7]` (Light green)

**Chart Colors** (for mini charts):
- Downloads: `#56ce84` (Green)
- Users: `#00EBFF` (Cyan)
- Facilities: `#FB8F65` (Orange)
- Specialists: `#5743BE` (Purple)

**Recharts Equivalent**:
```jsx
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width={48} height={48}>
  <AreaChart data={data}>
    <Area 
      type="monotone" 
      dataKey="value" 
      stroke="#56ce84" 
      fill="#56ce84" 
      fillOpacity={0.1}
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
```

---

### 2. User Metrics Grid (3 Cards)

**Layout**:
```jsx
<div className="grid md:grid-cols-3 grid-cols-1 col-span-1 gap-4 pt-4">
  <Card className="w-full text-center bg-success-50" bodyClass="p-0">
    {/* Online Users Chart */}
  </Card>
  <Card className="bg-warning-50" bodyClass="p-0">
    {/* Medication Reminder Users Chart */}
  </Card>
  <Card className="bg-yellow-50" bodyClass="p-0">
    {/* Period Tracker Users Chart */}
  </Card>
</div>
```

**Card Styling**:
- Online Users: `bg-success-50` (Light green)
- Med Reminder: `bg-warning-50` (Light orange)
- Period Tracker: `bg-yellow-50` (Light yellow)
- Title: `text-base` font size
- Body: `p-0` (no padding for charts)

**Recharts Equivalent** (Bar Chart):
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={250}>
  <BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="males" fill="#4669fa" radius={[8, 8, 0, 0]} />
    <Bar dataKey="females" fill="#FA916B" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

### 3. Content Stats Grid (3 Cards)

**Layout**:
```jsx
<div className="grid md:grid-cols-3 col-span-1 gap-4 pt-4">
  <GroupChart3 
    totalDiseasesAndConditions={totalDiseases?.totalDiseasesAndConditions || 0}
    totalSymptoms={totalSymptoms?.totalSymptoms || 0}
    totalHealthyLiving={totalHealthyLiving?.totalHealthyLiving || 0}
  />
</div>
```

**Individual Cards**:
```jsx
<div className="py-[18px] px-4 rounded-[6px] bg-[#E5F9FF]">
  <div className="text-center">
    <div className="text-slate-600 dark:text-slate-300 text-sm mb-2 font-medium">
      Diseases & Conditions
    </div>
    <div className="text-slate-900 text-3xl dark:text-white font-medium mb-2">
      245
    </div>
    <div className="text-xs text-slate-500">
      Total entries
    </div>
  </div>
</div>
```

**Card Backgrounds**:
- Diseases: `bg-[#E5F9FF]` (Light cyan)
- Symptoms: `bg-[#FFEDE5]` (Light orange)
- Healthy Living: `bg-[#c7f2d7]` (Light green)

---

### 4. Marketing Stats (Full Width)

**Layout**:
```jsx
<div className="flex justify-center items-center pt-4">
  <Card className="w-full" bodyClass="p-0" title="Total Marketing">
    {/* Marketing chart with 5 categories */}
  </Card>
</div>
```

**Data Categories**:
- Health
- Ads
- Event
- News
- Marketing

**Recharts Equivalent** (Horizontal Bar):
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Health', value: 120 },
  { name: 'Ads', value: 80 },
  { name: 'Event', value: 95 },
  { name: 'News', value: 150 },
  { name: 'Marketing', value: 110 },
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} layout="horizontal">
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" width={100} />
    <Tooltip />
    <Bar dataKey="value" fill="#4669fa" radius={[0, 8, 8, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

## 📈 Overview Page (Dashboard) Layout

### Page Structure
```jsx
<div className="grid grid-cols-12 gap-5 mb-5">
  {/* Profile/Image block */}
  <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
    <ImageBlock />
  </div>
  
  {/* Stats grid */}
  <div className="2xl:col-span-9 lg:col-span-8 col-span-12">
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <GroupChart2 />
    </div>
  </div>
</div>
```

---

### 1. Stats Cards (3 cards)

**Layout**:
```jsx
<div className="grid md:grid-cols-3 grid-cols-1 gap-4">
  {/* Revenue Card */}
  {/* Orders Card */}
  {/* Customers Card */}
</div>
```

**Individual Stat Card**:
```jsx
<div className="bg-white dark:bg-slate-800 rounded-md shadow-base p-4">
  <div className="flex items-center space-x-4">
    {/* Icon */}
    <div className="flex-none">
      <div className="h-12 w-12 rounded-full bg-primary-500 bg-opacity-10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
    </div>
    
    {/* Stats */}
    <div className="flex-1">
      <div className="text-slate-600 dark:text-slate-300 text-xs mb-1">
        Total Revenue
      </div>
      <div className="text-slate-900 dark:text-white text-xl font-semibold">
        $24,500
      </div>
      <div className="text-xs text-success-500">
        +12.5% from last month
      </div>
    </div>
  </div>
</div>
```

---

### 2. Revenue Chart (Large)

**Layout**:
```jsx
<div className="2xl:col-span-8 lg:col-span-7 col-span-12">
  <Card title="Revenue">
    <ResponsiveContainer width="100%" height={420}>
      {/* Bar chart */}
    </ResponsiveContainer>
  </Card>
</div>
```

**Recharts Configuration**:
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={420}>
  <BarChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="revenue" fill="#4669fa" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

### 3. Mini Stats Grid (Right Side)

**Layout**:
```jsx
<div className="2xl:col-span-4 lg:col-span-5 col-span-12">
  <Card title="Statistic">
    <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
      {/* Order Chart */}
      {/* Profit Chart */}
      <div className="md:col-span-2">
        {/* Earning Chart */}
      </div>
    </div>
  </Card>
</div>
```

**Individual Mini Chart**:
```jsx
<div className="text-center">
  <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
    Total Orders
  </div>
  <div className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
    3,256
  </div>
  <ResponsiveContainer width="100%" height={100}>
    <AreaChart data={data}>
      <Area type="monotone" dataKey="value" stroke="#4669fa" fill="#4669fa" fillOpacity={0.2} />
    </AreaChart>
  </ResponsiveContainer>
</div>
```

---

## 🎯 Implementation Checklist

### Step 1: Update Tailwind Config
```bash
# File: tailwind.config.ts
```
- [ ] Add Inter font family
- [ ] Add all color palettes (primary, secondary, success, warning, info, danger)
- [ ] Add custom shadows (base, base2, base3, deep, dropdown)
- [ ] Add custom animations (zoom, tada, spin-slow)
- [ ] Update container settings if needed

---

### Step 2: Install Inter Font
```bash
# Option 1: Google Fonts (in layout.tsx)
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

# Option 2: CSS Import (in globals.css)
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```
- [ ] Import Inter font
- [ ] Apply to body: `className={inter.className}`

---

### Step 3: Create Card Component
```bash
# File: components/ui/Card.tsx
```
- [ ] Create base Card component with:
  - White background + dark mode
  - Rounded corners (rounded-md)
  - Shadow-base
  - Header with title and optional slot
  - Configurable body padding
  - Support for bordered variant

---

### Step 4: Analytics Page
```bash
# File: app/(dashboard)/analytics/page.tsx
```

**Top Stats (4 cards)**:
- [ ] Card 1: Total Downloads (bg-[#c7f2d7], chart color: #56ce84)
- [ ] Card 2: Total Users (bg-[#E5F9FF], chart color: #00EBFF)
- [ ] Card 3: Total Facilities (bg-[#FFEDE5], chart color: #FB8F65)
- [ ] Card 4: Total Specialists (bg-[#c7f2d7], chart color: #5743BE)
- [ ] Add mini area charts (48x48px) using Recharts
- [ ] Grid: `md:grid-cols-4 gap-4`

**User Metrics (3 cards)**:
- [ ] Card 1: Online Users (bg-success-50) - Bar chart with male/female
- [ ] Card 2: Med Reminder Users (bg-warning-50) - Bar chart with male/female
- [ ] Card 3: Period Tracker (bg-yellow-50) - Bar chart
- [ ] Grid: `md:grid-cols-3 gap-4 pt-4`
- [ ] Use Recharts BarChart

**Content Stats (3 cards)**:
- [ ] Card 1: Diseases & Conditions (bg-[#E5F9FF])
- [ ] Card 2: Symptoms (bg-[#FFEDE5])
- [ ] Card 3: Healthy Living (bg-[#c7f2d7])
- [ ] Grid: `md:grid-cols-3 gap-4 pt-4`
- [ ] Simple number display (no chart)

**Marketing (Full width)**:
- [ ] Create horizontal bar chart
- [ ] 5 categories: Health, Ads, Event, News, Marketing
- [ ] Use Recharts BarChart (layout="horizontal")

**Time Period Filter**:
- [ ] Add time period filter component (Weekly, Monthly, All)
- [ ] Place in card header slot
- [ ] Fetch data based on selected period

---

### Step 5: Overview Page
```bash
# File: app/(dashboard)/overview/page.tsx
```

**Layout Grid**:
- [ ] Left column (2xl:col-span-3): Profile/Image block
- [ ] Right column (2xl:col-span-9): Stats grid

**Stats Cards (3 cards)**:
- [ ] Revenue card with icon and percentage change
- [ ] Orders card with icon and percentage change
- [ ] Customers card with icon and percentage change
- [ ] Grid: `md:grid-cols-3 gap-4`
- [ ] Icon in colored circle (bg-primary-500 bg-opacity-10)

**Revenue Chart**:
- [ ] Large bar chart (height: 420px)
- [ ] Use Recharts BarChart
- [ ] Show monthly revenue data
- [ ] Grid: `2xl:col-span-8`

**Mini Stats (Right side)**:
- [ ] Order chart (area chart)
- [ ] Profit chart (area chart)
- [ ] Earning chart (area chart, full width)
- [ ] Grid: `md:grid-cols-2, last item md:col-span-2`

---

### Step 6: Shared Components

**Time Period Filter**:
```tsx
// components/TimePeriodFilter.tsx
- Buttons: Weekly, Monthly, All
- Active state: bg-primary text-white
- Inactive state: text-slate-600
```

**Loading States**:
```tsx
- Show "..." for loading numbers
- Skeleton for loading charts
```

---

## 📦 Dependencies Needed

```bash
# Already installed
recharts  # For charts

# May need to install
clsx      # For conditional classes
```

---

## 🎨 Color Usage Quick Reference

| Element | Color | Usage |
|---------|-------|-------|
| Downloads stat | `#c7f2d7` | Background |
| Downloads chart | `#56ce84` | Line/Fill |
| Users stat | `#E5F9FF` | Background |
| Users chart | `#00EBFF` | Line/Fill |
| Facilities stat | `#FFEDE5` | Background |
| Facilities chart | `#FB8F65` | Line/Fill |
| Specialists stat | `#c7f2d7` | Background |
| Specialists chart | `#5743BE` | Line/Fill |
| Online Users card | `bg-success-50` | Card background |
| Med Reminder card | `bg-warning-50` | Card background |
| Period Tracker card | `bg-yellow-50` | Card background |
| Primary bars | `#4669fa` | Chart bars |
| Secondary bars | `#FA916B` | Chart bars |

---

## 📝 Typography Scale

```css
/* Title sizes */
text-xs      /* 12px - Small labels */
text-sm      /* 14px - Card titles, descriptions */
text-base    /* 16px - Section titles */
text-xl      /* 20px - Large stat values */
text-2xl     /* 24px - Main stat values */
text-3xl     /* 30px - Hero stat values */

/* Font weights */
font-normal   /* 400 - Body text */
font-medium   /* 500 - Card titles */
font-semibold /* 600 - Stat values */
font-bold     /* 700 - Headers */
```

---

## 🔄 Migration Priority

### High Priority (Do First):
1. Update Tailwind config (colors, fonts, shadows)
2. Install Inter font
3. Create Card component
4. Implement Analytics page top stats (4 cards)

### Medium Priority:
5. Add user metrics charts (3 bar charts)
6. Add content stats (3 simple cards)
7. Add marketing chart

### Low Priority (Can Do Later):
8. Overview page layout
9. Revenue chart
10. Mini stats charts
11. Time period filter

---

## 📐 Spacing Guidelines

```css
/* Gap between cards */
gap-4      /* 16px - Standard grid gap */
gap-5      /* 20px - Larger grid gap */

/* Card padding */
p-4        /* 16px - Chart cards */
p-6        /* 24px - Content cards */
py-[18px] px-4  /* Stat cards */

/* Vertical spacing */
pt-4       /* 16px - Section spacing */
mb-5       /* 20px - Section margin */
space-x-6  /* 24px - Horizontal flex spacing */
```

---

## 🎯 Final Notes

1. **Consistency**: Use the same card styling across all pages
2. **Dark Mode**: All components support dark mode (dark:bg-slate-800, dark:text-white)
3. **Responsive**: All grids collapse to single column on mobile
4. **Loading States**: Show "..." or skeleton for loading data
5. **Icons**: Use lucide-react icons consistently
6. **Chart Colors**: Match chart colors to card background theme

---

**Total Implementation Time**: ~8-12 hours
**Difficulty**: Medium
**Impact**: High (Complete visual overhaul)
