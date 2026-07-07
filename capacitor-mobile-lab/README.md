# Capacitor Mobile Lab

A small production-like React 18 + TypeScript + Vite + Capacitor project for interview practice. The app has one screen that shows platform/device information, camera or gallery photo selection, local metadata persistence, and app lifecycle state.

## Tech Stack

- React 18
- TypeScript with `strict` enabled
- Vite
- Capacitor with iOS and Android platforms
- Official Capacitor plugins: Camera, Preferences, App, Device, Status Bar

## Install Commands

Use Node `>=22.12.0` for the current Vite and Capacitor versions in this project.

```bash
npm create vite@latest capacitor-mobile-lab -- --template react-ts
cd capacitor-mobile-lab
npm install
npm install react@18 react-dom@18
npm install -D @types/react@18 @types/react-dom@18
npm install @capacitor/core @capacitor/ios @capacitor/android @capacitor/camera @capacitor/preferences @capacitor/app @capacitor/device @capacitor/status-bar
npm install -D @capacitor/cli
```

## Capacitor Setup Commands

```bash
npm run build
npx cap init "Capacitor Mobile Lab" "com.example.capacitormobilelab" --web-dir dist
npx cap add ios
npx cap add android
npx cap sync
```

`npx cap init` creates `capacitor.config.ts`. `npx cap add ios` and `npx cap add android` create the native projects. `npx cap sync` copies the latest web build and native plugin configuration into those projects.

## Run the App

Browser:

```bash
npm run dev
```

iOS:

```bash
npm run sync
npm run open:ios
```

Then run the app from Xcode on a simulator or device.

Android:

```bash
npm run sync
npm run open:android
```

Then run the app from Android Studio on an emulator or device. Android builds require a modern JDK; Java 11+ is required by the Android Gradle plugin.

## What Capacitor Is Doing Here

Capacitor packages the Vite web app into native iOS and Android projects. React still renders the UI, while Capacitor provides a bridge to native APIs such as Camera, Preferences, Device, App lifecycle, and Status Bar.

The React layer talks to native functionality through typed services in `src/native`. Components do not import Capacitor plugins directly. The `usePhotoLab` hook coordinates state, persistence, and service calls, while `PhotoLabPage` only renders the UI and wires button actions.

Wrapping plugins in services keeps native concerns isolated. It makes error handling consistent, keeps components easier to test, and gives you a clean place to adapt platform-specific behavior without spreading Capacitor calls across the React tree.

When you run `npm run build`, TypeScript checks the app and Vite writes static assets into `dist`. When you run `npx cap sync`, Capacitor copies `dist` into `ios/App/App/public` and `android/app/src/main/assets/public`, updates native plugin metadata, and makes the native projects ready to build in Xcode or Android Studio.

## Interview Walkthrough

- `src/native/camera.service.ts` owns Camera plugin calls and user-friendly error messages.
- `src/native/preferences.service.ts` serializes and validates saved photo metadata.
- `src/native/device.service.ts` exposes a small typed device-info shape for the UI.
- `src/native/appLifecycle.service.ts` subscribes to app state changes and returns a cleanup handle.
- `src/features/photo-lab/usePhotoLab.ts` is the business/state layer.
- `src/features/photo-lab/PhotoLabPage.tsx` is the presentation layer.
