# Product Management System

A responsive product management dashboard built with Next.js App Router and TypeScript.

## Overview

This application lets users manage products locally in the browser with a clean dashboard UI.

Core flow:
- Create products
- View all products
- Edit products
- Delete products
- Search/filter products

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- CSS Modules
- Zod (validation)
- Sonner (toast messages)
- Local Storage (data persistence)

## Features

- Product CRUD operations
- Form validation with inline error messages
- Image support via file input preview and image URL
- Category selection in the form
- Search by product name and description
- Responsive product grid
- Dark mode support
- Toast notifications for create, update, and delete actions

## Project Structure

- app/page.tsx: Dashboard page and state management
- app/page.module.css: Main page styles
- app/components/ProductForm.tsx: Product create/edit modal form
- app/components/ProductForm.module.css: Form styles
- app/components/ProductCard.tsx: Product card UI
- app/components/ProductCard.module.css: Card styles
- app/lib/product.ts: Types, validation schema, and local storage helpers

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Open the app

http://localhost:3000

## Production

Build:

```bash
npm run build
```

Start:

```bash
npm run start
```

## Data Persistence

- Product data is stored in browser local storage.
- Theme preference is also stored in local storage.
- No backend API or database is required.

## Notes

- Currency values are currently displayed in LKR format.
- Delete uses a browser confirmation prompt.

## Future Enhancements

- Pagination for large product lists
- Better image optimization using Next.js Image component
- Confirmation modal instead of browser confirm
- Unit and integration tests
