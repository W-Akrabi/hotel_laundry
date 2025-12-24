# Hotel Laundry

Mobile app for discovering nearby laundry services, comparing offerings, and viewing service details on a map. Built with Expo, Expo Router, and React Native.

## Features

- Nearby services list with search and multi-select filters
- Service detail modal with pricing per service
- Google Maps view with themed map styling and custom pins
- Light and dark theme support with a settings toggle

## Requirements

- Node.js 18+
- Xcode for iOS or Android Studio for Android

## Setup

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

## Supabase setup (Option B - Edge Function)

This app can fetch laundry services from Supabase Edge Functions by setting:

- `EXPO_PUBLIC_SUPABASE_URL` (e.g. `https://<project-ref>.supabase.co`)
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (forwarded as `x-publishable-key`)

The API client will call:

- `GET /functions/v1/services`
- `GET /functions/v1/services/<id>`

The Edge Function should read from the `services` view and return data shaped to match `data/mockServices.ts`.

## Google Maps setup

This app uses `react-native-maps` with Google Maps provider. Add your API key in `app.json`:

- `expo.ios.config.googleMapsApiKey`
- `expo.android.config.googleMaps.apiKey`

Note: Google Maps on iOS requires a dev client or a native build (Expo Go does not support `PROVIDER_GOOGLE`).

## Scripts

- `npm run ios` - run iOS native build
- `npm run android` - run Android native build
- `npm run web` - run web
- `npm run lint` - lint codebase

## Project structure

- `app/` - routes and screens (Expo Router)
- `components/` - shared UI components
- `contexts/` - app-level context (theme)
- `data/` - mocked service data

## Notes

- Theme toggle lives in the Profile tab.
- Update mock data in `data/mockServices.ts` for services and prices.
