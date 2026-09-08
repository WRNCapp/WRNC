# WRNC iOS QA Build 6

## Scope

- Hold the approved WRNC native splash for a minimum of two seconds on cold launch.
- Keep form fields and actions reachable while the iOS keyboard is open.
- Preserve the Build 5 activity, maintenance selection, and attachment-source behavior.
- Internal TestFlight QA only. No public App Store submission.

## Included commits

- `4727399` Hold native WRNC splash for two seconds.
- `5311fe8` Keep form fields visible above iOS keyboard.

## Validation

- TypeScript: PASS.
- ESLint: PASS.
- Jest: 38 suites and 234 tests PASS.
- Existing Jest warnings and forced-exit behavior remain. This is not a warning-free test run.

## Distribution evidence

- App version: `0.1.0`.
- Build number: `6`.
- Bundle identifier: `com.wrnc.app`.
- EAS Build ID: `09cb0b1f-7ace-46d4-b07f-7cb800a72104`.
- EAS Submission ID: `791e0f3a-a87e-4afd-b64d-eb1890fa7ab0`.
- Apple upload: accepted on 2026-08-31 Pacific time.
- Current gate: Apple processing, then physical iPhone QA.

## Physical iPhone QA gate

1. Cold-launch the app and confirm the WRNC splash remains visible for about two seconds.
2. Verify sign-in and sign-up fields and buttons remain reachable above the keyboard.
3. Create an activity and verify Title, Description, Date, Odometer, Cost, and Save remain reachable without using Return as a workaround.
4. Verify maintenance multi-selection remains usable.
5. Verify Camera, Photo Library, and Files attachment choices from activity and document flows.
6. Edit a vehicle and confirm the final field and Save action remain reachable with the keyboard open.
7. Verify Vehicle to Activity to Evidence to Timeline to Build Passport retrieval.

Build 6 is not a physical-device PASS until this checklist is completed on the target iPhone.
