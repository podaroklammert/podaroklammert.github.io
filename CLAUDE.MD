# Project Overview

**Коробочка с Подарками** (Gift Box) - A web application for managing monthly gifts. The app allows selection of random gifts from a pool, tracking which gifts have been given, with admin controls for resetting.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Netlify Functions (serverless)
- **Database**: Firebase Firestore
- **Hosting**: Netlify
- **Repository**: https://github.com/podaroklammert/podaroklammert.github.io
- Netlify URL: https://app.netlify.com/projects/podaroklammert/deploys
- Netlfiy Settings: Auto publishing is on. Deploys from main are published automatically.


## Project Structure

```
podaroklammert.github.io/
├── index.html              # Main HTML page with gift UI
├── script.js               # Frontend logic for gift selection/display
├── package.json            # Dependencies (firebase-admin)
├── netlify/functions/      # Serverless backend functions
│   ├── fetchAllGifts.js    # Get all gifts from Firebase (filtered by year)
│   ├── getLastGivenGift.js # Get most recently given gift (filtered by year)
│   ├── updateGift.js       # Mark gift as given
│   └── resetGifts.js       # Reset all gifts (admin)
├── dev-scripts/            # Database management scripts
├── data/                   # Gift data JSON files
└── Product 12 Gifts/       # Product documentation
```

## Key Features

1. **Gift Selection**: Random selection from available (not yet given) gifts
2. **Gift Display**: Shows current month's gift with name and description
3. **Previous Gifts**: Lists all previously given gifts
4. **Admin Reset**: Hidden reset button (accessible via `?admin=1` query parameter)
5. **Persistence**: Last given gift persists on page reload using Firebase

## Core Functionality

### Frontend (script.js)
- `displayLastGivenGift()`: Shows last given gift on page load
- `fetchAllGifts()`: Retrieves all gifts from Firebase via Netlify function
- `updatePreviousGiftsList()`: Displays history of given gifts
- `updateGiftStatus()`: Marks selected gift as given in database
- `controlResetButtonVisibility()`: Shows reset button for admin users

### Backend (Netlify Functions)
- **fetchAllGifts**: Returns gifts filtered by current year (supports `?year=YYYY` override)
- **getLastGivenGift**: Returns most recently given gift
- **updateGift**: Sets `Given: true` for selected gift
- **resetGifts**: Sets `Given: false` for all gifts (admin only)

## Database Schema (Firebase)

Collection: `gifts`

Document structure:
```json
{
  "id": "string",
  "Name": "string",
  "Description": "string",
  "Given": boolean,
  "Year": number,
  "Skipped": boolean
}
```

## Development Notes

- **Main developer skill**: Python (limited JavaScript knowledge)
- **AI assistance**: Claude Code and Antigravity for development
- **Deployment**: Auto-deploy via Netlify on git push
- **Database scripts**: `/dev-scripts/` for gift management

## Admin Access

Add `?admin=1` to URL to show reset button and bypass month restrictions:
```
https://podaroklammert.netlify.app/?admin=1
```

### URL Parameters for Testing

| Parameter | Values | Description |
|-----------|--------|-------------|
| `admin` | `1` | Show reset button, bypass month blocking |
| `year` | `2024`, `2025`, etc. | Filter gifts by year |
| `month` | `0`-`11` | Simulate month (0=Jan, 11=Dec) |

**Examples:**
```
?admin=1&year=2025&month=0   # Test January with 2025 gifts
?month=0                      # Simulate January (1 gift allowed)
?admin=1&year=2026            # Admin mode with 2026 gifts
```

**Notes:**
- Reset button resets ALL gifts across all years
- Month blocking: In month N, user can have max N+1 gifts (Jan=1, Feb=2, etc.)

## Recent Changes

- Added dynamic year filtering to fetchAllGifts function (commit: b4b11ed)
- Added Year field to database schema for gift cycle management
- Fixed blinking reset button behavior (commit: f63872c)
- Set reset button visibility to admin-only (commit: a0e8288)
- Updated Firebase permissions via service principal (commit: 1f92567)

## Common Tasks

### Adding New Gifts
1. Add documents to Firebase `gifts` collection with fields: `Name`, `Description`, `Given: false`
2. Can use Python notebook in `/notebook` directory

### Resetting Gifts
1. Access site with `?admin=1` parameter
2. Click red "Сбросить Подарки" button

### Deploying Changes
1. Commit changes to git
2. Push to GitHub main branch
3. Netlify auto-deploys

## Product Context

See `/Product 12 Gifts/` for:
- Core value proposition
- User feedback from 2024
- Roadmap and backlog
- AI contribution plan

## Documentation Guidelines

**Keep documents concise:**
- Simple topics: Brief and to-the-point
- Complex topics: Balanced length with necessary detail
- Use tables, lists, and summaries where possible
- Avoid repetition - reference other docs instead of duplicating
- Planning docs in `/Product 12 Gifts/` - focused on decisions
- Technical docs in `/dev-scripts/documentation/` - implementation details
