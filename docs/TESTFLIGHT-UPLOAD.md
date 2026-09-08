# Internal TestFlight upload

Founder authorized upload of build `23a926ea-ba06-4047-9b78-880c639afa1b`.
Public App Store review and external testing are not authorized.

## Verified artifact

- EAS status: FINISHED, QA profile, STORE distribution, physical iOS.
- Bundle: com.wrnc.app; version 0.1.0; build 1; SDK 54.
- IPA Info.plist: Xcode 26, iOS SDK 26, non-exempt encryption false.
- JS bundle includes QA project URL and no production project URL match.
- Local IPA SHA-256: 1734daa4690a81701a14f578cf7c5d9d15799926b7e01c849150d3bba01647bf.
- EAS build source revision: 5b8792de2430084d1f34b8f42f294362593e3c5b.

## Submission target

Added a dedicated submit.qa profile for App Store Connect app 6791770564,
team GKNJ58S5YG, preserving other submission profiles. Existing user changes
to app.json were inspected and left untouched.

## Attempt result

Non-interactive submission stopped because no App Store Connect API key is
configured. Interactive submission asked to generate a new API key. Canceled
before generation because its access scope has not been confirmed. No upload
job or TestFlight installation was confirmed.

Next: authorize and configure narrowly scoped Apple upload credentials, then
submit this exact build ID. Do not use latest, rebuild, enable automatic tester
assignment, or submit for public review.

## Approved upload completed

After Founder approval, reused the authenticated local Apple session and
generated key `29BX3BMT8L` with APP_MANAGER, the lower-privilege option offered
by the installed EAS generator. This is an app-management key, not upload-only;
the generator uses team-wide app visibility. EAS stores the credential for
submission of com.wrnc.app. No key material was written to this repository.

Submission `18e8e89f-5b90-451d-91f3-a324e473b134` uploaded the exact build above.
EAS exited successfully and confirmed the binary was uploaded to App Store
Connect. Apple processing remains a separate, unverified gate. Automatic
TestFlight setup was explicitly disabled. No external groups, invitations, or
public App Review submission were initiated.

- Upload: https://expo.dev/accounts/wrnc/projects/garageosofficial/submissions/18e8e89f-5b90-451d-91f3-a324e473b134
- TestFlight: https://appstoreconnect.apple.com/apps/6791770564/testflight/ios

Next: confirm Apple processing, assign the intended internal tester, and
perform physical-device core-loop QA. A successful upload is not device PASS.

Reference: https://docs.expo.dev/submit/ios/
