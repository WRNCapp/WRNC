# Native startup P0: replacement build 2

Founder reported TestFlight build 0.1.0 (1) closes immediately on launch.
No physical-device crash report has been received, so attribution to the
reproduced JavaScript defect remains provisional.

## Reproduction and correction

Native app/index.tsx mounted VehicleWorkspaceShell directly under the root
Slot, outside the QueryClientProvider in app/(app)/_layout.tsx. Its workspace
query therefore threw `No QueryClient set, use QueryClientProvider to set one`.

Added NativeStartup.test.tsx with an actual query-context requirement in a
workspace probe. Before the fix, the test failed with that precise exception.
After the fix, the root redirects to /workspace and never mounts the probe.
ProtectedAppLayout.test.tsx now requires an actual query client when mounting
its Stack probe, protecting the destination provider coverage as well.

No authentication implementation, backend, public homepage, or brand changes.
Fix source commit: 17af043.

## Validation

- Type checking and lint passed.
- All 36 suites and 219 tests passed after the fix.
- Existing SafeAreaView, React act, and forced-exit warnings remain.
- These are component regression tests, not an on-device cold-start test.

## Replacement candidate

- EAS build: 85e4c6b7-9fa4-4c05-a71b-d1f894cdde5f.
- Version: 0.1.0, iOS build number 2, QA profile.
- Existing certificate and provisioning profile reused with frozen credentials.
- app.json keeps the Founder's preexisting encryption and Android permission
  edits; only the iOS build number was changed in this task. These settings
  remain local and are included in the build archive, not in the fix commit.
- No production backend mutation, public App Review, or external tester invite.

## Acceptance gate

EAS confirmed replacement build FINISHED and version 0.1.0 (2). Submission
85651f75-98e5-4c5d-9ca8-e850385d5a2b then completed successfully, confirming
upload to App Store Connect. Existing API key reused; automatic TestFlight
setup disabled. Apple processing and physical-device launch remain unverified.

P0 remains open until build 2 cold-launches successfully on the physical iPhone.
Verify signed-out launch reaches sign-in; sign-in opens Garage; force-close and
reopen retains a usable session. Then test Vehicle, Activity, Evidence,
Timeline, and Build Passport. If launch still fails, obtain the WRNC .ips crash
report before attributing it to another cause.
