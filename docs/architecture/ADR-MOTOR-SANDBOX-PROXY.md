# ADR: Server-side MOTOR sandbox adapter

Status: Accepted for isolated preview validation

Date: 2026-09-02

Decider: Founder

## Context

MOTOR DaaS requests require a private HMAC key. A browser or Expo application bundle cannot keep that key secret. The approved scope is a read-only authenticated website workbench against MOTOR's 15-vehicle sandbox, with no persistence, production deployment, or database change. Its normalized contract remains reusable by a later native test surface.

## Decision

The authenticated website sends a VIN and its WRNC access token to a WRNC server route. The route validates the session, signs the MOTOR request using server-only credentials, maps the vendor response to WRNC-owned fields, disables caching, and returns the normalized result. The feature is disabled unless both client and server sandbox flags are enabled.

## Options considered

1. Sign inside the app. Rejected because the private key would be recoverable from the app bundle.
2. Call MOTOR through a server adapter. Selected because it protects credentials and isolates vendor schema changes.
3. Add a Supabase Edge Function. Deferred because Supabase deployment and configuration changes are outside the approved local-only scope.

## Consequences

- Browser and native code never receive MOTOR credentials.
- Same-origin preview hosting is preferred. Cross-origin previews require an exact origin allowlist.
- MOTOR licensing, attribution, caching, retention, and production access remain separate approval gates.
- Results remain transient until persistence is explicitly designed and approved.
