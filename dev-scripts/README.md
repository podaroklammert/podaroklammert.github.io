# Development Scripts

This folder contains one-off testing and development scripts that are not part of the main application.

## Available Scripts

### test-firebase-connection.js
Tests Firebase database connection with read/write permissions.

**Usage:**
```bash
# Install dependencies temporarily (if needed)
npm install --no-save dotenv firebase-admin

# Run the test
node dev-scripts/test-firebase-connection.js
```

**Requirements:**
- `.env` file in project root with Firebase credentials
- `firebase-admin` package

## Notes

- Scripts in this folder are gitignored (except this README)
- These are for local development/testing only
- Production code should use Netlify functions in `/netlify/functions/`
