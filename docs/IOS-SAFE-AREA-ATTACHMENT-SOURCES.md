# Native Vehicles header and attachment sources

## Findings

- P0: Founder reports Vehicles title overlapping iPhone clock. Loaded VehicleWorkspaceShell returned a bare ScrollView while loading states had a SafeAreaView.
- P1: Documents and activity evidence offered only DocumentPicker, opening Files rather than offering camera or library selection.

## Changes

Loaded Vehicles content now sits inside an iOS SafeAreaView with padding on the inner scrolling content. Documents and activity evidence use their existing shared DocumentUploadForm, now offering Camera, Photo Library, and Files on native. Web retains its browser file input and actual File object. Cover photo selection is unchanged.

Camera captures still photos using the existing configured camera permission. Library allows images and videos. Cancellation preserves selection; permission and picker failures show an error. Missing media size is read from the selected local file. Existing upload MIME/size validation and private storage remain unchanged. Unsupported formats remain rejected by that validation.

Source: https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/ and installed expo-image-picker source. Existing app.json already contains camera and photo permission descriptions; no permission/config or backend changes were needed.

## Verification

PASS: Type-check, lint, 37 test suites and 230 tests. Added safe-area hierarchy, camera/library payload, denied camera, and cancelled replacement tests. Existing deprecation/test warnings and forced Jest exit remain.

Native pixel alignment, permission prompts, camera capture, library selection, Files selection, upload and reopen must be verified on iPhone. This patch has not been packaged or uploaded to TestFlight. Build 3 remains unchanged.
