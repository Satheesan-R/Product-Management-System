# Product Management Dashboard

Product Management page built for a full stack intern assessment.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- Zod (form validation)
- Sonner (toast notifications)
- Local Storage (client-side persistence)

## Features

- Add Product: name, price, description, optional image URL
- View Products: clean responsive card layout
- Edit Product: update all product details from modal dialog
- Delete Product: remove product with confirmation prompt
- Search/Filter: real-time filtering by name and description
- Validation: Zod-powered inline form error messages
- Toasts: add/update/delete feedback messages

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

4. Build for production (optional):

```bash
npm run build
npm run start
```

## Data Handling

- Product data is persisted in `localStorage` under a single key.
- No backend or database is required.

## Assumptions

- Currency display is in USD.
- Image input is URL-based (upload is not implemented).
- Delete action uses browser confirmation for safety.

## Potential Improvements

- Add category/status fields and advanced filters.
- Add dark mode toggle.
- Replace browser confirm with custom confirmation dialog.
- Add unit/integration tests for CRUD and validation flows.
