# iOS QA Build 4

- Source: 9d964fd, Vehicles safe area and native Camera, Photo Library, Files choices in Documents/activity attachment form.
- Validation before packaging: type-check, lint, 37 suites and 230 tests passed. Existing test warnings and forced Jest exit remain.
- Local archive configuration: app.json buildNumber advanced from 3 to 4. Pre-existing encryption declaration and Android permission edits retained; app.json remains uncommitted to preserve mixed provenance.
- Version 0.1.0 (4), bundle com.wrnc.app. Existing QA backend, frozen signing credentials, and TestFlight upload profile.
- EAS build ID: a0fca10e-a5a2-406f-8e43-88f816a5c67b.
- No public App Store review or automatic tester/group setup.

Device acceptance pending: Vehicles below status bar; Camera permission/capture; Photo Library selection; Files selection; cancellation; upload and reopening evidence. Prior Passport fixes retained. If a core flow fails, do not promote this QA candidate; capture the reproduction before preparing a corrective build.

Delivery status: build FINISHED, version 0.1.0 (4). Submission scheduled as e2607536-e792-4728-b011-b48d34f88aba. Direct EAS query at handoff reports IN_QUEUE, error null. Apple upload acceptance and TestFlight processing are not yet confirmed. The existing server-side submission is left queued; no duplicate submitted.

Submission: https://expo.dev/accounts/wrnc/projects/garageosofficial/submissions/e2607536-e792-4728-b011-b48d34f88aba

The release checklist separates successful compilation/local validation from pending Apple upload and physical-device acceptance. No production release is authorized by this QA delivery.
