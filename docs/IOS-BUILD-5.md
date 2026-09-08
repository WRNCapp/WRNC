# iOS QA Build 5

- Version: 0.1.0 (5), bundle com.wrnc.app.
- Source commits: ff6c7a1 Activity spacing; 7935a37 Maintenance multi-select.
- Scope: explicit Activity type spacing; expandable Maintenance selector; 21 large multi-select service rows; automatic title; serviceType and serviceItems stored in existing activity metadata. Previous Build 4 safe-area and attachment-source work retained.
- No database migration, auth, Supabase policy, production deployment, automatic tester setup, or public App Store submission.
- Validation: type-check and lint passed; 37 suites and 233 tests passed. Existing test warnings and forced Jest exit remain.
- EAS build: 3bf67d2f-c4c6-4701-89c5-6bf473e7d39c, FINISHED.
- EAS submission: 35d43c6f-8958-4d33-b512-e05b7e4a49d6, successfully uploaded to Apple App Store Connect.
- Apple processing and physical-iPhone acceptance remain pending.

Device gate: install Build 5; open Create Activity; select Maintenance; select multiple services; leave title blank; add odometer and cost if desired; save; verify generated title and retrieval in Timeline; attach Camera, Photo Library, and Files evidence; verify Passport aggregation. Check spacing and reduced-dexterity operation throughout.
