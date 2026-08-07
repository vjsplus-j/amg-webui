# Hardening Architecture — FROZEN

Status: **CLOSED**

Frozen at: post H01–H06 remediation (evidence path-stable hashing, dual-hash freshness,
strict Lowcode golden path, docs maturity drift gate, browser-verify CI job, honest program-status).

## Canonical chain

```text
Source
→ Contract
→ Test
→ Evidence
→ Freshness
→ Gate
→ Stable
→ CI
```

## Freeze rules

Hardening architecture is **CLOSED**.

Do **not** modify Hardening architecture except when:

1. Hardening itself has a real Bug
2. CI Regression
3. Security issue
4. Explicit inability to verify real component behavior (evidence of false PASS / false FAIL)

## Explicitly forbidden (without reopen)

- Redesigning Evidence Schema
- Redesigning Stable promotion flow
- Redesigning Dashboard SSOT
- Redesigning Gate architecture
- Bulk rewriting Contracts / Evidence / Dashboard to chase metrics
- Warehouse-wide “hardening remediations” outside CLOSED Core Set batches

## Allowed after freeze

- Per-component evidence regeneration with stamps (sourceHash + contractHash)
- Batch closure workflows (`closed-components.json`, `active-batch.json`)
- Bug / regression / security fixes on CLOSED components with reopen reason

## Verification commands (regression)

```bash
npm run check:evidence-freshness
npm run verify:component -- --all --strict
npm run hardening:dashboard
npm run hardening:program-status
npm run check:docs-drift
```
