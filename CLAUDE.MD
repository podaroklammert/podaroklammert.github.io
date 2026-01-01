# Gift Box (Коробочка с Подарками)

Monthly gift selection app for a personalized New Year gift experience.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Netlify Functions |
| Database | Firebase Firestore |
| Hosting | Netlify (auto-deploy on push) |

**Links:** [GitHub](https://github.com/podaroklammert/podaroklammert.github.io) | [Netlify](https://app.netlify.com/projects/podaroklammert/deploys) | [Live Site](https://podaroklammert.netlify.app)

## Project Structure

```
├── index.html / script.js    # Frontend
├── netlify/functions/        # API endpoints
│   ├── fetchAllGifts.js      # Get gifts (filtered by year)
│   ├── getLastGivenGift.js   # Get current gift
│   ├── updateGift.js         # Mark gift as given
│   ├── skipGift.js           # Mark gift as skipped
│   └── resetGifts.js         # Reset all gifts (admin)
├── dev-scripts/              # Database management
├── data/                     # Gift JSON files
└── Product 12 Gifts/         # Product documentation
```

## Database Schema

Collection: `gifts`

| Field | Type | Description |
|-------|------|-------------|
| Name | string | Gift title (Russian) |
| Description | string | Gift description |
| Given | boolean | Has been revealed |
| Skipped | boolean | User rejected it |
| Year | number | Gift cycle year (2025, 2026) |

## Current Features (V1)

- Random gift selection from available pool
- Year-based filtering (auto-detects current year)
- Month-based pacing (max N+1 gifts in month N)
- Gift rejection/skip with replacement
- Loading spinner during fetch
- Admin reset functionality

## Documentation

- **Admin guide:** See `ADMIN.md`
- **Product docs:** See `Product 12 Gifts/`
- **Dev scripts:** See `dev-scripts/README.md`

## Development Notes

- Main developer skill: Python (JS via AI assistance)
- Deployment: Push to main → Netlify auto-deploys
- Keep documents brief and actionable
