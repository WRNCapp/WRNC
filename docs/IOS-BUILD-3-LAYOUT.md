# Build 3 Passport layout correction

## Scope and evidence

Founder device screenshots IMG_4869 through IMG_4874 show overlapping summary text, cramped metric columns, and touching sections. Classified P0 for unreadable metrics and overlap; remaining cosmetic spacing is P1 until device review.

The installed NativeWind 2 gap implementation introduces negative parent margins. The Tailwind configuration does not define the min-w-24 or min-w-28 utilities used by the metric cards. Those cards also used flex: 1, squeezing all metrics into one row.

Passport now uses explicit native margins and gaps, wrapping two-column metrics with no fixed height, wrapping vehicle values, and vertically separated recommendation severity labels. Actions retain a 44-point minimum height. No record, backend, auth, navigation, or approved brand changes.

## Validation

- PASS: type-check and lint.
- PASS: 37 Jest suites, 225 tests, including layout contracts at 320, 390, 402, and 768 logical widths.
- Existing SafeAreaView/test warnings and forced Jest exit remain. This is not warning-free CI.
- Component contracts are not native pixel or screenshot verification. Physical iPhone, Dynamic Type, and VoiceOver acceptance remain pending.

## Build provenance

Target: iOS 0.1.0 (3), com.wrnc.app, existing QA profile and existing signing credentials. Internal TestFlight only; no public App Store review.

app.json remains an uncommitted archive input because it includes pre-existing encryption and Android permission edits. Those edits were preserved, not newly introduced for this fix. This task changes its iOS build number from 2 to 3. The cloud archive includes that local configuration.

## Delivery result

- Source commit: 19a4d8b, plus the local app.json input described above.
- EAS build: 17fbe94c-d3fa-42b9-9386-dd8fcd67b46d. FINISHED, version 0.1.0, build 3.
- EAS submission: 4640ac35-cae7-403e-8344-6ca43ec110b8. Successfully uploaded to Apple App Store Connect.
- Apple processing was pending at handoff. TestFlight availability and device installation are not yet verified.
- No automatic TestFlight group setup or public review submission was requested.
- TestFlight: https://appstoreconnect.apple.com/apps/6791770564/testflight/ios
