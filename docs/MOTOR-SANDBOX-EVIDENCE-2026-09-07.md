# MOTOR Sandbox Evidence

Date: September 7, 2026

Scope: Direct, read-only validation against the MOTOR DaaS sandbox VIN endpoint using the credentials and 15 vehicles supplied in `MOTOR Sandbox_2024.pdf`. Credentials were read at runtime, were not printed, and were not written to the repository.

## Result

15 of 15 sanctioned VINs returned HTTP 200 and matched the expected year, make, model, live MOTOR `VehicleID`, and live MOTOR `BaseVehicleID`.

| VIN | Vehicle | Result |
| --- | --- | --- |
| 1B3ES47Y6VD205309 | 1997 Dodge Neon | PASS |
| 1FMZU74W22UC09718 | 2002 Ford Explorer | PASS |
| 1GCEK29079E143364 | 2009 Chevrolet Silverado 1500 | PASS |
| 1D3HV13T39S713967 | 2009 Dodge Ram 1500 | PASS |
| 4T4BF3EK8AR074927 | 2010 Toyota Camry | PASS |
| 2G1FT1EW3A9111145 | 2010 Chevrolet Camaro | PASS |
| 2B3CJ7DW1AH173347 | 2010 Dodge Challenger | PASS |
| 19XFA1F51AE028415 | 2010 Honda Civic | PASS |
| 1FTSW2BR0AEB13613 | 2010 Ford F-250 Super Duty | PASS |
| 1N4AL2AP6AN555869 | 2010 Nissan Altima | PASS |
| WDDGF5GBXAR126533 | 2010 Mercedes-Benz C350 | PASS |
| 1FTFW1ET1CFA84056 | 2012 Ford F-150 | PASS |
| 3AKJGLD56GSGJ2574 | 2016 Freightliner Cascadia | PASS |
| 5PVNV8JRXF4S50916 | 2015 Hino 338 | PASS |
| 2HNYD2H47AH532332 | 2010 Acura MDX | PASS |

## Contract finding

The source PDF's `MOTOR Vehicle ID` column maps to the live MOTOR-standard response's `BaseVehicleID`. The PDF's `VCdb Base Vehicle ID` is a separate identifier standard. It is not the `BaseVehicleID` returned when `AttributeStandard=MOTOR`. The catalog was corrected using the live response as runtime evidence.

## Gates not satisfied by this test

- Production or commercial licensing
- Authorized display, printing, sharing, caching, or retention
- Required attribution and OEM notices
- Rate limits and production service levels
- Hosted WRNC proxy authentication and credential-isolation verification
- Production deployment approval

This evidence supports sandbox compatibility only. It does not authorize production use.
