# Administrator Guide

## Quick Access

**Admin URL:** `https://podaroklammert.netlify.app/?admin=1`

---

## URL Parameters

| Parameter | Values | Effect |
|-----------|--------|--------|
| `admin` | `1` | Show reset button, bypass month limit |
| `year` | `2025`, `2026` | Override gift year filter |
| `month` | `0`-`11` | Simulate month (0=Jan, 11=Dec) |

**Examples:**
```
?admin=1                    # Admin mode
?admin=1&year=2025          # View 2025 gifts
?admin=1&month=5            # Simulate June
?admin=1&year=2026&month=0  # Test January 2026
```

---

## Managing Gifts

### View Current Gifts
```bash
node dev-scripts/get-all-gifts-detailed.js
```

### Add New Year's Gifts

1. Create gift data file in `/data/gifts-YYYY.json`:
```json
[
  {
    "Name": "Gift Name (Russian)",
    "Description": "Description text",
    "Given": false,
    "Skipped": false,
    "Year": 2027
  }
]
```

2. Create import script or use existing pattern from `import-2026-gifts.js`

3. Run import:
```bash
node dev-scripts/import-YYYY-gifts.js
```

### Reset All Gifts

**Via UI:** Click "Сбросить Подарки" in admin mode

**Note:** Reset affects ALL gifts across all years - sets Given=false, Skipped=false

---

## Firebase Console

Direct database access: [Firebase Console](https://console.firebase.google.com)

Collection: `gifts`

---

## Month Pacing Rules

| Month | Max Gifts |
|-------|-----------|
| January (0) | 1 |
| February (1) | 2 |
| March (2) | 3 |
| ... | ... |
| December (11) | 12 |

Admin mode bypasses this limit.
