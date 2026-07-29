# Rentify Frontend Environment Variable Strategy & Security Guidelines

This document outlines the environment variable configuration strategy for the **Rentify Property Rental & Booking Platform** frontend application (`Rent-Client`).

---

## 🔑 Required Public Environment Variables

All client-side environment variables in Next.js MUST be prefixed with `NEXT_PUBLIC_` so they are accessible during client-side hydration and SSR.

| Variable Name | Environment | Description | Sample / Default Value |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Local / Staging / Production | Centralized backend REST API URL. Used by Axios and API service calls. | `http://localhost:5000/api` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Local / Staging / Production | Base origin of the auth server for Better Auth React client. | `http://localhost:5000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Local / Staging / Production | Stripe publishable key for client-side Checkout & Payment Elements. | `pk_test_sample_key_here` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Local / Staging / Production | Google OAuth Client ID for client-side OAuth sign-in flow. | `sample_id.apps.googleusercontent.com` |

---

## 🛡️ Critical Security Rules & Secret Isolation

> [!CAUTION]
> Environment variables prefixed with `NEXT_PUBLIC_` are embedded into client-side JavaScript bundles and can be inspected by anyone in the browser.

### Strictly Forbidden in Frontend Environment Files (`.env.local`, `.env`)
- ❌ **MongoDB Connection Strings / Credentials**: e.g., `mongodb+srv://user:pass@cluster.mongodb.net/`
- ❌ **JWT Secrets & Signing Keys**: e.g., `JWT_SECRET=super_secret_jwt_key`
- ❌ **Stripe Secret Keys**: e.g., `sk_test_...` or `sk_live_...`
- ❌ **Google OAuth Client Secret**: e.g., `GOOGLE_CLIENT_SECRET=GOCSPX-...`
- ❌ **Database passwords, SMTP credentials, or server session keys**

All sensitive backend keys MUST remain inside `Rent-Server/.env` and must never be exposed or imported into `Rent-Client`.

---

## 🛠️ Accessing Environment Variables in Code

Always access environment variables using the centralized helper utility in [env.js](file:///c:/Users/88018/Desktop/Project/assignment-10/Rent-Client/src/utils/env.js):

```javascript
import { getEnvVar } from '@/utils/env';

// Safe retrieval with fallback
const apiUrl = getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5000/api');
const stripeKey = getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
```

---

## 🌐 Deployment Guidelines (Vercel / Netlify / Render)

When deploying `Rent-Client` to Vercel or Netlify:
1. Navigate to Project Settings > Environment Variables.
2. Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend API URL (e.g., `https://rentify-backend.onrender.com/api`).
3. Add `NEXT_PUBLIC_BETTER_AUTH_URL` pointing to your deployed auth server origin.
4. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
5. Trigger a new deployment so Next.js embeds the runtime environment variables into the production build.
