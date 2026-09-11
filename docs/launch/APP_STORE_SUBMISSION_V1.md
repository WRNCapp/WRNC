# WRNC App Store submission package

Release candidate: **Version 1.0, Build 20**

Do not submit Build 19 for public review. It was a QA binary. Build 20 must use the EAS `production` profile and production Supabase environment.

## App Store metadata

| Field | Value |
|---|---|
| Name | WRNC |
| Subtitle | Your vehicle's living record |
| Promotional text | Every build deserves a living record. Keep vehicle details, activities, photos, documents, and milestones together in WRNC. |
| Keywords | project car,car build,vehicle history,maintenance,receipts,modifications,garage,restoration |
| Support URL | https://wrnc.app/support |
| Marketing URL | https://wrnc.app |
| Privacy Policy URL | https://wrnc.app/privacy |
| Copyright | 2026 Swear Like A Sailor, LLC |
| Release option | Manually release this version |

### Description

WRNC gives automotive builders one organized record for every vehicle and every stage of the build.

Create a vehicle, record the work, attach the proof, and preserve the story. Instead of leaving important details scattered across camera rolls, notes, receipts, and memory, WRNC keeps them connected to the vehicle where they belong.

VEHICLE RECORDS

Keep essential vehicle details, mileage, engine and transmission information, and a cover photo in one clear overview.

ACTIVITY TIMELINE

Document maintenance, installed parts, progress updates, and journal entries in chronological order so the build history remains easy to understand.

PHOTOS AND DOCUMENTS

Attach photos, receipts, registrations, manuals, warranties, and other supporting files to create a more complete record.

BUILD PASSPORT

See documentation quality at a glance with the WRNC Build Score, activity and document summaries, and practical next steps for improving the record.

BUILT FOR BUILDERS

Whether the vehicle is a restoration, track project, daily driver, or long-term build, WRNC helps preserve what was done, when it happened, and why it matters.

## App Review information

### Review notes

WRNC is a vehicle documentation app. Sign in with the supplied review account, open Vehicles, and select the preloaded vehicle. The vehicle overview links to Add Activity, Build Passport, and Timeline. The Account menu includes permanent account deletion.

The review account should contain one vehicle with representative activities, photos, and documents so Apple can test the primary experience without creating data from scratch.

### Reviewer access

Create a dedicated review account in the production environment. Do not use a founder's personal account. Record the username and password directly in App Store Connect, not in this repository.

## App privacy answers

Confirm these against the final production configuration before submission:

| Data type | Collected | Linked to identity | Tracking | Purpose |
|---|---:|---:|---:|---|
| Email address | Yes | Yes | No | Account authentication, support |
| User content: photos/videos | Yes | Yes | No | App functionality |
| User content: other content | Yes | Yes | No | Vehicle records, activities, documents |
| Product interaction on public website | Yes | No | No | Analytics |

The mobile app does not contain an advertising SDK. Do not declare tracking unless the final production build adds cross-app or cross-site tracking.

## Required screenshots

Upload these in order to the iPhone 6.5-inch screenshot slot:

1. `docs/launch/app-store-screenshots/01-vehicles.png`
2. `docs/launch/app-store-screenshots/02-build-passport.png`
3. `docs/launch/app-store-screenshots/03-timeline.png`

Each file is 1242 × 2688 px, opaque PNG, and derived from the accepted Build 19 interface.

## Final submission gate

1. Account Holder accepts the updated Apple Developer Program License Agreement.
2. Production Supabase is active and production data paths are verified.
3. Version 1.0 Build 20 is uploaded and selected.
4. Support, privacy, and terms URLs return HTTP 200 publicly.
5. A dedicated production review account is tested.
6. Required metadata, screenshots, age rating, content rights, export compliance, and privacy labels are complete.
7. Founder reviews the product page and explicitly authorizes **Submit for Review**.
