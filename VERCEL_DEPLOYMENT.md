# Vercel Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Rentify Property Rental & Booking Platform** frontend to **Vercel**.

## 1. Vercel Project Setup

1. Push your repository to GitHub or GitLab.
2. Sign in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import the `Rent-Client` repository.

## 2. Build & Output Configuration

Vercel will automatically detect Vite. Confirm the following build settings:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 3. Environment Variables Setup

In the Vercel project settings (**Environment Variables**), add the following:

| Variable Key | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Express Backend Base URL | `https://your-rentify-backend.vercel.app/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | `pk_test_51...` |

> [!CAUTION]
> **Security Audit**: Never add MongoDB credentials, JWT secret keys, Stripe secret keys (`sk_test_...`), or Google OAuth client secrets to the frontend Vercel environment.

## 4. Single Page Application (SPA) Route Rewrites

The repository includes a `vercel.json` file in the root directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite ensures that refreshing any route (e.g. `/properties/prop-1`, `/dashboard/tenant`, `/dashboard/owner`, `/dashboard/admin`) will serve `index.html` without returning a 404 Not Found error.

## 5. Browser Reload Verification Checklist

After deployment, test the following routes on your Vercel deployment URL:

- [x] Home Page reload (`/`)
- [x] All Properties catalog reload (`/properties`)
- [x] Property Details reload (`/properties/prop-1`)
- [x] Login page reload (`/login`)
- [x] Tenant Dashboard reload (`/dashboard/tenant`)
- [x] Owner Dashboard reload (`/dashboard/owner`)
- [x] Admin Dashboard reload (`/dashboard/admin`)

Authentication state persists via `localStorage` in `AuthProvider`, ensuring logged-in users remain on private routes during page reloads.
