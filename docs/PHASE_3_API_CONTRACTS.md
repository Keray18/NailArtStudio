# The Nail Lounge — Phase 3 API Contracts

## 1. Standard API Envelopes

All responses from `/api/v1/*` follow a predictable, unified envelope.

### 1.1 Success Response Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... } | [ ... ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 36,
    "totalPages": 3
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

### 1.2 Error Response Envelope
```json
{
  "success": false,
  "statusCode": 404,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product with ID 'invalid-slug' was not found",
    "details": [
      {
        "field": "slug",
        "message": "Resource not found in catalogue"
      }
    ]
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

---

## 2. Catalogue Endpoints

### 2.1 Categories

#### `GET /api/v1/categories`
Returns all active categories sorted by display order.

- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "c7a86f91-...",
      "name": "Press-on Nails",
      "slug": "press-on-nails",
      "description": "Handcrafted, reusable salon-grade press-on nails...",
      "imageUrl": "https://images.unsplash.com/...",
      "sortOrder": 1,
      "productCount": 18
    }
  ],
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

#### `GET /api/v1/categories/:slug`
Returns detailed category information including any subcategories.

- **URL Parameters**:
  - `slug`: string (e.g. `press-on-nails`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "c7a86f91-...",
    "name": "Press-on Nails",
    "slug": "press-on-nails",
    "description": "Handcrafted, reusable salon-grade press-on nails...",
    "imageUrl": "https://images.unsplash.com/...",
    "parentId": null,
    "sortOrder": 1,
    "productCount": 18,
    "children": []
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```
- **Error `404 NOT_FOUND`**: If category slug does not exist or is inactive.

---

### 2.2 Collections

#### `GET /api/v1/collections`
Returns all active collections sorted by display order.

- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "e4f8a123-...",
      "name": "The Bridal & Festive Edit",
      "slug": "bridal-festive",
      "tagline": "Opulent craftsmanship for milestone celebrations",
      "description": "Intricate pearls, Kundan stone embellishments...",
      "bannerImageUrl": "https://images.unsplash.com/...",
      "isFeatured": true,
      "sortOrder": 1,
      "productCount": 6
    }
  ],
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

#### `GET /api/v1/collections/:slug`
Returns collection details along with its member products.

- **URL Parameters**:
  - `slug`: string (e.g. `bridal-festive`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "e4f8a123-...",
    "name": "The Bridal & Festive Edit",
    "slug": "bridal-festive",
    "tagline": "Opulent craftsmanship for milestone celebrations",
    "description": "Intricate pearls...",
    "bannerImageUrl": "https://images.unsplash.com/...",
    "isFeatured": true,
    "sortOrder": 1,
    "productCount": 6,
    "products": [
      {
        "id": "prod-123-...",
        "name": "Glazed Rose Chrome Almond",
        "slug": "glazed-rose-chrome-almond",
        "shortDescription": "Iridescent pearlescent glaze...",
        "basePrice": 899,
        "compareAtPrice": 1199,
        "category": { "name": "Press-on Nails", "slug": "press-on-nails" },
        "primaryImage": { "url": "https://...", "altText": "..." },
        "inStock": true
      }
    ]
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

---

### 2.3 Products

#### `GET /api/v1/products`
Lists published products with filtering, sorting, and pagination.

- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (min: 1, max: 48, default: 12)
  - `category`: string slug (e.g. `press-on-nails`)
  - `collection`: string slug (e.g. `bridal-festive`)
  - `minPrice`: number (e.g. `500`)
  - `maxPrice`: number (e.g. `1500`)
  - `inStockOnly`: boolean or string (`true`, `1`)
  - `shape`: string (e.g. `Almond`, `Coffin`, `Square`, `Oval`, `Stiletto`)
  - `length`: string (e.g. `Short`, `Medium`, `Long`)
  - `finish`: string (e.g. `Glazed Chrome`, `Matte Velvet`, `High Gloss`)
  - `sort`: enum `featured` | `price-asc` | `price-desc` | `newest` (default: `featured`)
  - `q`: string keyword filter

- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "c1d2e3f4-...",
      "name": "Glazed Rose Chrome Almond",
      "slug": "glazed-rose-chrome-almond",
      "sku": "FIX-PRS-001",
      "shortDescription": "Iridescent pearlescent glaze over delicate blush tones...",
      "basePrice": 899,
      "compareAtPrice": 1199,
      "isFeatured": true,
      "category": {
        "id": "cat-uuid-...",
        "name": "Press-on Nails",
        "slug": "press-on-nails"
      },
      "primaryImage": {
        "id": "img-uuid-...",
        "url": "https://images.unsplash.com/...",
        "altText": "Glazed Rose Chrome Almond nails shown on hand"
      },
      "variantCount": 5,
      "inStock": true,
      "isLowStock": false,
      "attributes": {
        "shape": "Almond",
        "length": "Medium",
        "finish": "Glazed Chrome",
        "colorFamily": "Pink"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 36,
    "totalPages": 3
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

#### `GET /api/v1/products/:slug`
Retrieves a single published product by its URL slug.

- **URL Parameters**:
  - `slug`: string (e.g. `glazed-rose-chrome-almond`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "c1d2e3f4-...",
    "name": "Glazed Rose Chrome Almond",
    "slug": "glazed-rose-chrome-almond",
    "sku": "FIX-PRS-001",
    "brand": "The Nail Lounge",
    "countryOfOrigin": "India",
    "shortDescription": "Iridescent pearlescent glaze over delicate blush tones...",
    "description": "Our signature editorial style...",
    "packageContents": [
      "24 Press-on tips across 12 sizes (or 10 custom sized tips)",
      "1 Sheet extra-strength jelly adhesive tabs (24 tabs)",
      "1 Brush-on liquid nail adhesive (2g)",
      "1 Dual-grit mini buffer & shaper",
      "1 Wooden cuticle pusher stick",
      "2 Isopropyl alcohol preparation pads"
    ],
    "applicationGuide": [
      "Prep: Gently push back cuticles...",
      "Cleanse: Wipe natural nails thoroughly...",
      "Size: Match each press-on tip...",
      "Adhere: Apply adhesive tab or glue..."
    ],
    "removalGuide": [
      "Submerge hands in warm soapy water for 10-12 mins...",
      "Gently slide wooden stick under edges...",
      "Never peel forcefully..."
    ],
    "basePrice": 899,
    "compareAtPrice": 1199,
    "isFeatured": true,
    "category": {
      "id": "cat-uuid-...",
      "name": "Press-on Nails",
      "slug": "press-on-nails"
    },
    "images": [
      {
        "id": "img-1",
        "url": "https://images.unsplash.com/...",
        "altText": "...",
        "isPrimary": true,
        "sortOrder": 0
      }
    ],
    "options": [
      {
        "id": "opt-1",
        "name": "Set Type & Sizing",
        "values": [
          { "id": "val-1", "value": "Multi-Size 24-Piece Set", "sortOrder": 0 },
          { "id": "val-2", "value": "Custom 10-Piece (XS)", "sortOrder": 1 }
        ]
      }
    ],
    "variants": [
      {
        "id": "var-1",
        "sku": "FIX-PRS-001-UNI24",
        "title": "Multi-Size 24-Piece Set",
        "price": 899,
        "compareAtPrice": 1199,
        "isAvailable": true,
        "inStock": true,
        "isLowStock": false,
        "availableToSell": 12,
        "options": [
          { "optionName": "Set Type & Sizing", "value": "Multi-Size 24-Piece Set" },
          { "optionName": "Shape", "value": "Almond" },
          { "optionName": "Length", "value": "Medium" }
        ]
      }
    ],
    "attributes": {
      "shape": "Almond",
      "length": "Medium",
      "finish": "Glazed Chrome",
      "colorFamily": "Pink"
    },
    "collections": [
      {
        "id": "col-1",
        "name": "The Clean Girl Minimalist",
        "slug": "minimalist-edit"
      }
    ],
    "relatedProducts": [
      {
        "id": "prod-related-1",
        "name": "French Tip Minimalist Oval",
        "slug": "french-tip-minimalist-oval",
        "basePrice": 799,
        "primaryImage": { "url": "https://...", "altText": "..." },
        "inStock": true
      }
    ]
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```

---

### 2.4 Search

#### `GET /api/v1/search`
Performs keyword search across products and categories.

- **Query Parameters**:
  - `q`: string (required, min 1, max 100 characters)
  - `page`: integer (default: 1)
  - `limit`: integer (min: 1, max: 48, default: 12)

- **Response `200 OK`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "query": "velvet",
    "totalProducts": 4,
    "products": [
      {
        "id": "prod-uuid",
        "name": "Midnight Velvet Matte Almond",
        "slug": "midnight-velvet-matte-almond",
        "sku": "FIX-PRS-007",
        "basePrice": 999,
        "compareAtPrice": 1299,
        "category": { "name": "Press-on Nails", "slug": "press-on-nails" },
        "inStock": true
      }
    ],
    "matchedCategories": []
  },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 4,
    "totalPages": 1
  },
  "timestamp": "2026-11-07T06:30:00.000Z"
}
```
- **Error `400 VALIDATION_FAILED`**: If `q` parameter is missing or empty.

