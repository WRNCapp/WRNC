# WRNC App Store submission package

Release candidate: **Version 1.0, Build 24**, built from `release/build-24-candidate` after PR #87 merges.

The founder reports that Build 23 (`7bf4c5a`) runs acceptably on a physical iPhone, but it was held for spacing and polish defects. Build 24 is that source plus the garage error-state recovery fix and the PR #87 presentation pass. It contains no new features. Shareable Build Passport (#84) is **not** in Build 24.

Do not submit Builds 20, 21, 22 or 23 for review.

## App Store metadata

| Field | Value | Limit |
|---|---|---|
| Name | WRNC | 30 |
| Subtitle | Your vehicle's living record | 30 (28 used) |
| Promotional text | Keep every vehicle build detail in one place. Log the work, attach the receipts and photos, and see how complete your build record is. | 170 |
| Keywords | project car,car build,vehicle history,maintenance,receipts,modifications,garage,restoration | 100 (91 used) |
| Support URL | https://www.wrnc.app/support | |
| Marketing URL | https://www.wrnc.app | |
| Privacy Policy URL | https://www.wrnc.app/privacy | |
| Account deletion URL | https://www.wrnc.app/support#delete-account | |
| Copyright | 2026 Swear Like A Sailor, LLC | |
| Primary category | Lifestyle | |
| Price | Free, no in-app purchases | |
| Release option | Manually release this version | |

### Description

WRNC keeps every vehicle build detail in one place.

Build history has a way of ending up everywhere: camera rolls, receipts in the glovebox, notes on your phone, and memory. WRNC keeps it all with the vehicle, as one record you can keep adding to.

YOUR GARAGE

Every vehicle in one place, photo first, with VIN, mileage, engine and transmission details.

ACTIVITY TIMELINE

Log installed parts, purchased parts, maintenance, progress updates and journal entries. Add the date, odometer and cost while the work is fresh, then follow the build month by month.

PHOTOS AND DOCUMENTS

Attach receipts, registrations, warranties, manuals, diagrams and photos to the vehicle they belong to. Upload PDFs and images straight from your phone.

BUILD PASSPORT AND BUILD SCORE

The Build Passport summarizes your vehicle's documented history. The WRNC Build Score shows how completely the build is documented across timeline, photos, parts, maintenance and receipts, and suggests what to record next. It measures the record, not the car.

PRIVATE BY DEFAULT

Your records and files are visible only to your account. You can permanently delete your account and everything in it from the Account menu at any time.

Whether it's a restoration, a weekend project or the daily you take care of, WRNC gives the story a place to live.

## App Review information

### Review notes (paste into App Store Connect)

> WRNC is a private vehicle documentation app. Sign in with the review account provided below. The account has one vehicle with activities, photos and documents already recorded.
>
> Main flow: Garage → tap the vehicle → Add Activity, Timeline, or Build Passport. Documents are reached from Build Passport.
>
> Account deletion: Garage → Account (top right) → Delete Account → Permanently Delete Account. This permanently deletes the account, its vehicles, activities, documents and uploaded files. Please do not delete the review account itself. Create a new account from the sign-in screen to test deletion.
>
> Sign-in is email and password only. The app uses no third-party or social login, so Sign in with Apple is not required (guideline 4.8). The app has no ads, no tracking, no purchases and no user-to-user content.

### Reviewer access

- Create a dedicated production review account. Do not use the founder's account.
- Seed it with one vehicle (with a cover photo), at least five activities across different types, one PDF and one photo document.
- Enter the username and password **only in App Store Connect**, never in this repository or in chat.
- Sign in to it on a device the day you submit, to confirm production is awake and the data loads.

## Age rating questionnaire

Answer **None** or **No** to every content question. WRNC has no violence, mature themes, gambling, contests, unrestricted web access, or user-to-user communication. Users store private records for their own vehicles, which Apple does not treat as user-generated content shared with others. Expected rating: **4+**.

## Export compliance

`ITSAppUsesNonExemptEncryption` is `false` in `app.json` (verified in Build 23 source). The app uses only standard HTTPS through the operating system. Answer **No** to proprietary or non-exempt encryption. No documentation upload is needed.

## App Privacy answers

Data the **app** collects (the website's analytics are not part of the app's label):

| Data type | Collected | Linked to user | Used for tracking | Purpose |
|---|---|---|---|---|
| Contact info: Email address | Yes | Yes | No | App functionality (account sign-in) |
| Identifiers: User ID | Yes | Yes | No | App functionality |
| User content: Photos | Yes | Yes | No | App functionality |
| User content: Other user content | Yes | Yes | No | App functionality (vehicle records, activities, documents, costs) |

Everything else: **Not collected.** Tracking: **No.** Build 23 source contains no advertising, analytics or crash-reporting SDK (checked against `package.json` and app code). Revisit this table if one is added.

## Screenshots

The existing `app-store-screenshots/` set comes from Build 19 and **must be replaced**. Capture six fresh screenshots from the exact Build 24 binary, on a physical iPhone or the matching simulator, signed in to the review account:

1. Garage with the vehicle photo
2. Vehicle overview: Build Score, key facts, actions
3. Timeline
4. Create Activity
5. Build Passport
6. Documents

Required size: 6.9-inch iPhone (1320 × 2868) or 6.5-inch (1284 × 2778 or 1242 × 2688), PNG or JPG, no transparency. Confirm the accepted sizes in App Store Connect when you upload; Apple updates them periodically.

## Final submission gate

1. Production Supabase is on a plan that does not auto-pause, and is active.
2. https://www.wrnc.app/privacy and /support show the in-app deletion steps (PR #86, merged October 29). Check in a private browser window.
3. PR #87 is merged, Build 24 is built with the EAS `production` profile, and it is uploaded to TestFlight.
4. Founder physical QA on Build 24: clean install, sign in, garage loads, sign out and back in, relaunch keeps the session, add an activity, upload a photo and a PDF, and delete a throwaway account then confirm it can no longer sign in.
5. Review account seeded and tested on the Build 24 binary.
6. Six screenshots captured from Build 24.
7. Metadata, age rating, export compliance and App Privacy entered as above.
8. Founder explicitly authorizes **Submit for Review**.
