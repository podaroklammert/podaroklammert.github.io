# Development Scripts

Database management and testing scripts for local development.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `test-firebase-connection.js` | Test Firebase connection |
| `get-all-gifts-detailed.js` | List all gifts with details |
| `check-gift-timestamps.js` | Check gift update timestamps |
| `add-year-field.js` | Add Year field to existing gifts |
| `verify-year-field.js` | Verify Year field migration |
| `import-2026-gifts.js` | Import gifts from JSON |
| `test-fetch-with-year.js` | Test year filtering |

## Usage

```bash
# Ensure .env file exists with Firebase credentials
node dev-scripts/<script-name>.js
```

## Requirements

- `.env` file in project root with:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- `firebase-admin` package (installed via npm)

## Notes

- Scripts modify production database - use with caution
- Production code uses Netlify functions in `/netlify/functions/`
