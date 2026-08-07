# Component Inventory Gap Report

- Target: 300
- Actual: 287
- Delta: -13
- Policy: Do NOT invent low-value components to hit 300. Prefer merge/deprecate over create.
- Verdict: Inventory 287 < target 300. Gap of 13 is acceptable; fill only with real product needs.

## Family counts
- form: 13
- foundation: 54
- feedback: 9
- navigation: 26
- media: 10
- selection: 9
- charts: 9
- special: 14
- table: 28
- upload: 5
- datetime: 10
- lowcode: 15
- layout: 17
- input: 19
- editor: 3
- overlay: 15
- tree: 7
- gb28181: 8
- onvif: 8
- vcr: 8

## Merge candidates
- overlay-modals: Keep Dialog + MessageBox as public; treat *Modal as thin wrappers or deprecate duplicates after API freeze (ConfirmDialog, ErrorModal, GbsAlarmModal, InfoModal, MessageBox, SuccessModal, WarnModal)

## Deprecate review list (stubs)
