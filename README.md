# RankingsList

A tiny static prototype for beautiful, shareable ranked lists.

## v5 changes

- Larger left-aligned rank: `10.`
- No pound sign
- Fixed poster frame for consistent image sizing
- Images use `object-fit: cover`
- No "Swipe left or right" text

## Image fields

Each item can use an absolute image URL:

```json
"image": "https://example.com/poster.jpg",
"imageAlt": "Movie poster"
```

If `image` is blank, the app shows a poster placeholder.
