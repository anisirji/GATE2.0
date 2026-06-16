# GATE 2.0 — MySociety Smart Community

Mobile-first society / gated-community management app. Cross-platform (iOS + Android) via Expo.
Designed against the **Civic Shield** system from a Stitch project (secure-blue + teal, Plus Jakarta Sans + Inter).

## What's in the MVP

Single Expo app, three personas planned (resident, guard, admin). Roles share core entry/visitor features — admins are residents too.

This first slice covers the **resident flow**:

- Splash → Onboarding (3 slides) → Login (phone) → OTP verification
- Bottom-tabs main app: **Home** dashboard · **Visitors** list · **Payments** · **Notices** · **Profile**
- Modal flows: **Generate QR Pass**, **Pre-approve Guest**, **Invite Received**

All data is mocked in `src/data/mockData.ts`. Auth is a stub — any 6-digit code logs you in.

## Stack

- [Expo](https://expo.dev) ~56 with `expo-router` (file-based routes)
- TypeScript, strict mode
- `@expo-google-fonts/plus-jakarta-sans` + `@expo-google-fonts/inter`
- `react-native-qrcode-svg` for visitor QR passes
- `@expo/vector-icons` (Feather set)

## Getting started

```bash
npm install
npx expo start
```

Scan the QR with **Expo Go** on iOS or Android, or press `i` / `a` for simulators.

## Project layout

```
src/
  app/
    index.tsx              # redirects to /(auth)/splash
    (auth)/                # splash, onboarding, login, otp
    (app)/
      (tabs)/              # home, visitors, payments, notices, profile
      qr-pass.tsx          # modal: generate visitor QR
      guest-pass.tsx       # modal: pre-approve guest
      invite-received.tsx  # modal: guest-side invite view
  components/              # Button, Card, Input, StatusBadge, AppHeader, Avatar
  constants/theme.ts       # Civic Shield design tokens
  data/mockData.ts         # demo visitors, payments, notices, residents
  lib/auth.tsx             # AuthContext (mocked)
```

## Design source

Stitch project: `10401026301242270114` — *MySociety Smart Community Platform*.
Design system: **Civic Shield** (light theme, 8px grid, Plus Jakarta Sans + Inter).

## Roadmap

- [ ] Guard persona: dashboard, QR scan, check-in confirmation, entry log
- [ ] Admin persona: notices broadcasting, staff tracking, payments reporting
- [ ] Real backend (Supabase or Firebase) — replace mock data, real phone OTP
- [ ] Push notifications for visitor arrivals and notices
- [ ] Web/desktop admin dashboard (Next.js, separate app)
