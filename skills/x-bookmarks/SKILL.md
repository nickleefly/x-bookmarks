---
name: x-bookmarks
description: Export X/Twitter bookmarks to markdown. Use when asked to fetch, export, or save bookmarks from X/Twitter.
---

# X Bookmarks Export Skill

Export X/Twitter bookmarks to markdown via `bird` CLI and `convert-bookmarks-to-md.js`.

## Prerequisites

- Install `bird`: `npm install -g @steipete/bird`
- Log into X in browser (Safari/Chrome/Firefox) for cookie auth

## Environment Setup

Add these environment variables to `~/.bashrc`:

```bash
export AUTH_TOKEN="your_auth_token"
export CT0="your_ct0"
```

After adding, reload with `source ~/.bashrc`.

To get these values, open X.com in your browser, press F12, go to Application > Cookies, and find:
- `auth_token` → use as AUTH_TOKEN
- `ct0` → use as CT0

## Usage

### 1. Verify Setup

```bash
bird whoami --auth-token $AUTH_TOKEN --ct0 $CT0
```

### 2. Fetch Bookmarks

```bash
# Fetch all bookmarks
bird bookmarks --all --json --auth-token $AUTH_TOKEN --ct0 $CT0 > bookmarks.json

# Fetch specific count (e.g., last 50)
bird bookmarks -n 50 --json --auth-token $AUTH_TOKEN --ct0 $CT0 > bookmarks.json

# Fetch from a specific folder/collection
bird bookmarks --folder-id <id> --json --auth-token $AUTH_TOKEN --ct0 $CT0 > bookmarks.json
```

### 3. Filter by Date (Optional)

Bird CLI doesn't support date filtering, so use the filter script:

```bash
# Filter to bookmarks from a specific date onward
node filter-bookmarks.js bookmarks.json --from 2026-01-15 -o filtered.json

# Filter to a date range
node filter-bookmarks.js bookmarks.json --from 2026-01-15 --to 2026-01-22 -o filtered.json

# Filter up to a specific date
node filter-bookmarks.js bookmarks.json --to 2026-01-20 -o filtered.json
```

### 4. Convert to Markdown

```bash
# Basic conversion
node convert-bookmarks-to-md.js bookmarks.json

# With date filtering (built-in)
node convert-bookmarks-to-md.js bookmarks.json --from 2026-01-15 -o weekly.md

# Full example with date range
node convert-bookmarks-to-md.js bookmarks.json --from 2026-01-15 --to 2026-01-22 -o jan-week3.md
```

- Input defaults to `bookmarks.json`
- Output defaults to `bookmarks-[YYYY-MM-DD].md`
- Dates use `YYYY-MM-DD` format

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Query ID error | Run `bird query-ids --fresh` |
| Rate limit | Wait and retry with `-n <smaller_count>` |
| Auth failed | Verify tokens in `~/.bashrc`, run `source ~/.bashrc` |
| Cookies expired | Get fresh tokens from browser cookies |
