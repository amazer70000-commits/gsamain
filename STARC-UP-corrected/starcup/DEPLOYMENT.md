# STARC-UP backend reliability setup

The frontend appearance is unchanged. The project now includes same-origin Vercel API endpoints for live registration lookup, participant login verification, live Round 1/2 evaluation, admin authentication, and diagnostics.

## Required Vercel Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables**:

- `REGISTRATION_SHEET_URL` = the published/export CSV URL of the Google Form response sheet used for registrations.
- `ROUND1_SHEET_URL` = the published/export CSV URL of the Round 1 response sheet.
- `ROUND2_SHEET_URL` = the published/export CSV URL of the Round 2 response sheet.
- `ADMIN_USERNAME` = your admin username (recommended: change from the old exposed value).
- `ADMIN_PASSWORD_SHA256` = SHA-256 hex of `ADMIN_USERNAME:ADMIN_PASSWORD`.

The default sheet URLs from the supplied project are retained as fallbacks, but environment variables are recommended.

## Google Sheets

The three sheets must be readable by the server. For a simple college-event deployment, use Google Sheets **Share → General access → Anyone with the link → Viewer**. The response sheet must contain a column whose header includes `name` (and not `college`, `school`, or `team`).

New registration rows are read on every participant login with `Cache-Control: no-store`, so new registrations do not require a Vercel redeploy.

## Password rule

The current event rule is retained:

`first real word, first 4 letters, uppercase + @1234`

Example: `Dharani S` → `DHAR@1234`.

## Important paid-event requirement

The original project stores event controls and participant state primarily in browser `localStorage`. That is not suitable for reliable multi-device event administration. The existing `CLOUD` setting in `portal.js` should be connected to a shared Firebase Realtime Database before the live event if admins and participants will use different devices.

Do not reuse the old admin password from the original source; it was present in a client-side comment and is therefore compromised.

## Diagnostics

After deployment, the admin's **Check Links** page calls `/api/health` and reports whether Registration, Round 1, and Round 2 sheets are readable.

For the credential algorithm, `/api/test` confirms the supplied sample:

`Dharani S` + `DHAR@1234`

A successful `/api/test` does **not** prove that Dharani is registered; the live `/api/login` check does that against the current registration sheet.

## ML/evaluation note

The existing evaluator is a deterministic rubric-based scoring model, not a trained machine-learning model. It is retained so the existing event workflow and UI do not change. Round 1 and Round 2 now read their live response sheets server-side, normalize entries, de-duplicate by participant name, and return criterion scores.
