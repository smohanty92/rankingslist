# RankingsList

A tiny static prototype for beautiful, shareable ranked lists.

## Files

- `index.html` — landing page
- `list.html` — reusable carousel viewer
- `styles.css` — site styles
- `script.js` — loads a list by slug and renders it
- `lists/top-3-fruits.json` — example list data

## Run locally

Open `index.html` directly in your browser, or use a local static server.

If `fetch()` gives you trouble from a local file path, run:

```bash
python3 -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

## Add a new list

Create a new JSON file in `lists/`, for example:

```text
lists/top-10-movies.json
```

Then open it at:

```text
list.html?slug=top-10-movies
```

## Deploy

Push this project to GitHub, then import the repo into Vercel.
