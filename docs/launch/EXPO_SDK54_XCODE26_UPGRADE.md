# Expo SDK 54 and Xcode 26 Upgrade Record

Date: 2026-08-29

Branch: `feat/expo-sdk54-xcode26`

Base: `origin/main` at `396e99f`

## Scope

This branch upgrades WRNC from Expo SDK 50 to Expo SDK 54 and aligns the React Native, Expo Router, native modules, Jest tooling, and web runtime with that SDK. It does not upload a build, access signing credentials, alter authentication or backend settings, publish legal text, deploy, merge, or accept Apple agreements.

## Native configuration evidence

- iOS bundle identifier: `com.wrnc.mobile`
- iOS build number: `1`
- Generated native purpose strings: Camera and Photo Library only
- Microphone permission: disabled in the image picker plugin configuration
- Generated entitlements: empty
- Apple development team: not configured in source and remains `UNKNOWN`
- App Store Connect app record and agreements: not available in source and remain `UNKNOWN`
- Generated privacy manifests were found in Expo FileSystem, Expo Constants, React Native, and Async Storage dependencies
- EAS project ID configured in source: `c7cfc85b-904f-4d2a-8fbb-1aec8f51aecb`
- Ownership of and access to that EAS project remain `UNKNOWN`

The native project was generated in a disposable directory with `expo prebuild`. No generated `ios` directory is committed.

## Validation gates

- Expo Doctor: 18 of 18 checks passed
- TypeScript: passed
- ESLint: passed
- Jest: 34 suites and 212 tests passed
- Web export: passed
- iOS JavaScript export: passed
- Disposable iOS prebuild: passed

## Remaining device and service gates

- Run an EAS iOS preview build only after Apple team and EAS project ownership are verified
- Install the preview through TestFlight on a physical iPhone
- Exercise login, signup, callback, vehicle workspace, photo selection, document selection, upload, download, and deletion flows
- Confirm the Apple-rendered icon and screenshots on required device sizes
- Complete the separate legal-link and in-app account-deletion workstreams before App Review
- Investigate existing React Native SafeAreaView deprecation warnings and the full-suite Jest open-handle warning; neither produced a test failure in this branch

## Rollback

The change is isolated to this branch. Deleting the branch and its worktree returns the repository to the untouched `origin/main` state. No external system state was changed.
