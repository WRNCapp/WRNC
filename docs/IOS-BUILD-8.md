# WRNC iOS QA Build 8

## Preferred candidate

Build 8 supersedes Build 7 for physical-device QA. It contains the complete navigation, keyboard, and safe-area stabilization set.

## Included changes

- Keep Build Passport as a persistent destination.
- Use explicit `Vehicle` and `Timeline` return controls instead of generic history labels.
- Use one keyboard-safe scrolling container for Activity creation, Activity documents, vehicle documents, Garage vehicle forms, Sign In, and Sign Up.
- Use `react-native-safe-area-context` across native launch routes to keep content below the iPhone status area and Dynamic Island.
- Preserve the two-second WRNC native splash and Build 5 maintenance and attachment behavior.

## Included commits

- `58f86a3` Standardize vehicle navigation and keyboard forms.
- `3545687` Unify native safe areas and keyboard forms.

## Validation

- TypeScript: PASS.
- ESLint: PASS.
- Jest: 39 suites and 235 tests PASS.
- Existing mocked Supabase console output, VirtualizedList test output, and forced-exit open-handle warning remain. This is not a warning-free test run.

## Distribution evidence

- App version: `0.1.0`.
- Build number: `8`.
- Bundle identifier: `com.wrnc.app`.
- EAS Build ID: `004dc277-08af-4677-b5fc-040f6d701913`.
- EAS Submission ID: `abec90f3-3798-47b7-975e-95a976d5b723`.
- EAS build: FINISHED.
- Apple submission: scheduled and awaiting a final intake result.
- Distribution scope: internal TestFlight QA only. No public App Store submission.

## Physical iPhone acceptance gate

1. Cold launch and confirm the approved WRNC splash remains visible for about two seconds.
2. Confirm `Vehicles` and every route heading remain below the status bar and Dynamic Island.
3. On Sign In and Sign Up, focus each field and reach every action while the keyboard is open.
4. Create Journal Entry, Maintenance, and Record Upload activities. Focus every field and reach Save without using Return as a workaround.
5. Add a document from an Activity and from Documents. Confirm Title, Camera, Photo Library, Files, and Upload remain reachable with the keyboard open.
6. Edit the longest vehicle form and reach the final field and Save while the keyboard is open.
7. Verify `Vehicle`, `Timeline`, and `Build Passport` controls always lead to the destination named on the control.
8. Complete Vehicle to Activity to Evidence to Timeline to Build Passport retrieval.

Build 8 remains device-unverified until this checklist passes on the target iPhone.
