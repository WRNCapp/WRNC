# Build 24: shareable Build Passport

## Implemented in this candidate

- Each vehicle Passport can publish an opt-in public snapshot, display a QR code, share its HTTPS link, update the selected installed parts, or revoke the link.
- The snapshot contains only year, make, model, and the titles of installed-part activities selected by the owner. It excludes VIN, mileage, nickname, photos, documents, attachments, descriptions, and activity metadata.
- A 192-bit random link token is issued for each publication. Updating a snapshot revokes the old link; deleting the owner account cascades deletion of its shares.
- The recipient route `/build/[token]` reads the public snapshot without sign-in and offers an app-open action and the iPhone App Store listing. The QR resolves to `https://www.wrnc.app/build/[token]` and the iOS build declares the matching associated domain.

## Release checks

- Apply the migration to production before opening the sharing feature in a production TestFlight build.
- Deploy the web route and `/.well-known/apple-app-site-association` to `www.wrnc.app` and verify its response body and `application/json` content type without a redirect.
- Scan a real QR on an iPhone with Build 24 installed, verify universal-link opening and the browser fallback on a phone without WRNC. Confirm the App Store button resolves after public release; prior to public release the store listing may be unavailable to non-testers.
- Verify publishing, updating, and revoking on a physical device; confirm an old token stops returning data. Check that selected titles containing private information are not chosen.

## Complementary-part suggestions

The current Passport “Next Steps” are documentation recommendations. Installed parts are activity records with free-text titles and optional metadata. There is no normalized part identifier, verified vehicle fitment, compatibility relationship, inventory link, or recommendation ranking yet. Generating “fits your vehicle” suggestions from titles would be unreliable.

Next slice: capture structured brand, part number, category, and vehicle variant at install time; establish a licensed fitment source and a curated relationship table (for example, a brake installation might suggest compatible lines or fluid, subject to fitment verification). Show why an item was suggested and link to evidence. Use explicit unknown/needs-verification states; do not present safety-critical compatibility as confirmed without a source. Start with a small reviewed catalog before automating broad recommendations.
