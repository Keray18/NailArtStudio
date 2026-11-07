# The Nail Lounge — Phase 3 Media Strategy & Delivery

## 1. Objective

Provide high-resolution visual imagery for editorial beauty e-commerce while maintaining sub-second page loads across both high-speed broadband and mobile 4G networks in India.

---

## 2. Media Architecture

```
                  ┌───────────────────────────────┐
                  │ Product Image URL in Database │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │        MediaService         │
                   │ (modules/media/media.service│
                   └──────────────┬──────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────────┐
│ Cloudinary CDN Pipeline      │          │ Unsplash / Static CDN Fallback   │
│ (When credentials configured)│          │ (Development & Testing)          │
│ • f_auto, q_auto             │          │ • auto=format, fit=crop          │
│ • w_{width}, h_{height}      │          │ • w={width}, h={height}          │
└──────────────────────────────┘          └──────────────────────────────────┘
```

---

## 3. Fallback & Placeholder Handling

- If a product or variant has no primary image assigned, `MediaService` returns a curated, high-resolution beauty placeholder image URL:
  `https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800&auto=format&fit=crop`
- Prevents broken UI elements, image render errors, and layout shifts in the storefront.

---

## 4. URL Transformations

```typescript
mediaService.getOptimizedImageUrl(rawUrl, {
  width: 600,
  height: 600,
  quality: "auto",
  format: "webp"
});
```

1. **Cloudinary URLs**:
   Transforms `https://res.cloudinary.com/<cloud>/image/upload/<publicId>` into:
   `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_600,h_600/<publicId>`
2. **Unsplash Development Fixture URLs**:
   Extracts and sets URL query parameters:
   `?w=600&h=600&auto=format&fit=crop`

---

## 5. Security & Isolation Constraints

- **No Public Upload Endpoints**: Phase 3 contains **zero** unauthenticated image upload endpoints to eliminate arbitrary file upload vulnerabilities.
- **Credential Protection**: Cloudinary API Secret is strictly loaded on the backend via `backend/.env` and is never exposed in API responses or frontend client bundles.
- **Admin Signature Generation**: Direct-to-Cloudinary authenticated signed upload signatures will be introduced in Phase 5 alongside merchant authentication.

