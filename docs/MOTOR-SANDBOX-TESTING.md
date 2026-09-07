# MOTOR Sandbox Testing

Status: isolated website preview testing only. The adapter and workbench remain disabled by default.

## Boundary

The authenticated website sends a VIN and the current WRNC access token to the WRNC proxy. The proxy validates the WRNC session before any lookup. MOTOR credentials remain server-side. Results are read-only and are not written to Supabase or copied into an existing vehicle.

Both flags must be explicitly enabled:

* Website test surface: `EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX=true`
* Server proxy: `MOTOR_SANDBOX_ENABLED=true`

Same-origin website previews should use `/api/motor/vin`. Cross-origin testing requires an exact `MOTOR_ALLOWED_ORIGIN`. Mock mode uses `MOTOR_SANDBOX_MODE=mock` and supports only VIN `1HGCM82633A004352`.

## Website workbench

The protected `/motor-sandbox` route lists all documented sandbox vehicles, requires an explicit lookup action, displays transient normalized results and comparison states, and marks unverified products as `UNKNOWN`. It is not linked when the feature flag is disabled. Do not deploy it to production.

The shared adapter and normalized types may later be reused by the app team. Native distribution configuration is not part of this branch.

## Repeatable 15-VIN evidence run

Run the controlled preview through the server proxy. Use a disposable WRNC test account and a short-lived access token. The runner never prints or writes the token.

```sh
MOTOR_EVIDENCE_ENDPOINT="https://preview.example/api/motor/vin" \
MOTOR_EVIDENCE_BEARER_TOKEN="short-lived-access-token" \
npm run qa:motor:live
```

The command checks all 15 sanctioned VINs against the expected vehicle identity and MOTOR IDs. It writes a timestamped JSON record and a reviewable Markdown matrix under `artifacts/motor-evidence/`. That directory is ignored by Git. A 15/15 result satisfies the response-identity portion of the gate only. Complete the manual gates in the generated report before recommending merge.

## Verified sandbox contract

The vendor's 2024 sandbox document and live Swagger specification identify:

1. Base URL `https://api.motor.com`.
2. VIN route `/v1/Information/Vehicles/Search/ByVIN`.
3. HMAC-SHA256 signing over public key, HTTP verb, epoch seconds, and route path.
4. Query authentication using `Scheme`, `XDate`, `ApiKey`, and `Sig`.
5. MOTOR attribute names in the response.
6. Fifteen sanctioned sandbox VINs.

`MOTOR_SANDBOX_PUBLIC_KEY` and `MOTOR_SANDBOX_PRIVATE_KEY` are server-only. Never place them in source control, screenshots, logs, client code, or an `EXPO_PUBLIC_*` variable. Clients receive only normalized fields. Requests time out after 10 seconds, are not cached, and results are not persisted.

## Still required before deployment

1. Written confirmation of current sandbox and production licensing.
2. Rate limits and documented error status behavior.
3. Caching, retention, logging, attribution, geography, and OEM notice requirements.
4. Founder approval for an isolated preview deployment.

Do not deploy to production or create a TestFlight build from this branch.
