# Invoice Generator

A slick, single-page invoice builder where you can drop in a logo, enter your service and price, and instantly see a polished invoice preview ready for sharing or print. The project is still under active development.

## Getting Started

Install dependencies (if you haven't yet):

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How it works

- Drag & drop or upload your logo (PNG/JPG/SVG) and preview instantly.
- Enter sender, client, invoice number, dates, currency, service, and price—live totals update as you type.
- Notes section for payment terms; clean layout designed to look good on screen and print.

## Project status

- Active development: UI/UX is still evolving, and export/sharing options may change.
- Core preview and form experience are functional; please file issues for bugs or ideas.

## Editing the UI

- Main page: `app/page.tsx`
- Styling: Tailwind utility classes are used inline.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS (via Next/TW defaults)

## Deploying

You can deploy wherever you like; Vercel is the quickest path:

```bash
npm run build
npm start
```

Or push the repo to Vercel and import it—no extra config needed.
