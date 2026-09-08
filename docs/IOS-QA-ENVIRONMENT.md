# Isolated iOS QA environment

Prepared 2026-08-30 for internal TestFlight device QA. Not an App Store release.

## Identity and isolation

- Supabase QA: `WRNC-QA`, project `iwsqsudrayqeuexnuwtk`, region `us-east-1`.
- Existing backend: `tfxufjdbiszpnlgeflop`. Read-only inspection only.
- EAS project: `c7cfc85b-904f-4d2a-8fbb-1aec8f51aecb`.
- iOS bundle: `com.wrnc.app`; App Store Connect ID: `6791770564`.
- Build profile: `qa`, store distribution, EAS `preview` environment.
- Preview contains QA URL and publishable client key only. No service-role key.
- Production build profile and production environment variables unchanged.
- Supabase provisioning quote: 0 per month. No paid upgrades authorized.

## Database preparation and proof

Applied the 13 reviewed repository migrations from source revision `5ef35ba`
as one atomic QA baseline, `wrnc_qa_baseline_from_release_5ef35ba`.
This intentionally has a separate migration-history entry from production.
Do not blindly replay the original migration chain against this QA database.

Verified through database catalog queries:

- All four public application tables have RLS enabled.
- The 19 public/storage policies match the existing backend exactly.
- Both attachment buckets are private and match existing MIME and size limits.
- Security advisor returned no findings.
- Initial users, vehicles, and storage object counts are zero.

No customer records, authentication identities, or uploaded objects were copied.
Authentication provider settings and end-to-end device behavior are not yet
verified. Schema and policy checks do not substitute for authenticated QA.

## Build boundary

Use the `qa` profile, never automatic submission. Initial build attempt must
freeze credentials. Missing Apple signing credentials require interactive owner
authentication. Do not modify production auth, publish an OTA update, or submit
to App Store review as part of this work.

The source candidate previously passed 218 tests, type checking, lint, Expo
Doctor (18 checks), and iOS JavaScript export. Existing test warnings remain.
These results do not establish a signed binary or physical-device PASS.

## References

## First build attempt

The frozen-credentials, non-interactive QA build loaded both preview variables
and resolved the QA backend correctly. It stopped before build creation:
`Credentials are not set up. Run this command again in interactive mode.`
No signed binary, queued build, upload to Apple, or submission was produced.

EAS also reported missing `ITSAppUsesNonExemptEncryption`; an accurate export
compliance determination remains required, not an assumed boolean. The future
`cli.appVersionSource` requirement was a warning, not the current blocker.

QA HTTP checks: auth settings returned 200, email login enabled, confirmation
required; unauthenticated vehicle reads returned 401 with permission denied.
An authenticated complete core-loop test remains pending.

## Reference links

- https://supabase.com/docs/guides/deployment/managing-environments
- https://docs.expo.dev/eas/environment-variables/
