# Closure Workflow

Status vocabulary for Core Stable Set delivery (Batch 01–04).

## States

```text
BACKLOG → ACTIVE → VERIFYING → CLOSED
```

Only **CLOSED** when Definition of Done gates all PASS for the batch component set.

## Files

| File | Role |
|------|------|
| `component-hardening/active-batch.json` | Current ACTIVE batch scope |
| `component-hardening/closed-components.json` | CLOSED component registry + hashes |
| `component-hardening/closures/BATCH-XX.md` | Per-batch closure report |
| `scripts/check-closed-components.mjs` | CI: CLOSED edits require reopen reason |

## Reopen policy (CLOSED components)

Allowed reasons only:

- `bug`
- `regression`
- `security`
- `dependency-breaking`

Forbidden as reopen reasons:

- refactor
- cleanup
- style improvement
- api polish
- architecture improvement

Provide reason via:

```bash
CLOSED_REOPEN_REASON=bug
# or commit trailer: Closed-Reopen: bug
```

## Batch order (locked)

1. BATCH-01-FORM-INPUT
2. BATCH-02-DATA
3. BATCH-03-OVERLAY
4. BATCH-04-NAVIGATION-LAYOUT

Showcases: only `01-admin` is ACTIVE until CLOSED; `02–10` stay BACKLOG.
