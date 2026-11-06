# The Nail Lounge — API Contract Plan
**Document Version:** 1.0.0  
**Status:** Approved Blueprint for Phase 0  
**API Base URL:** `/api/v1`  
**Protocol:** REST over JSON / HTTPS  

---

## 1. Global API Standards & Response Envelopes

Every endpoint in **The Nail Lounge** backend returns a strictly typed JSON envelope.

### 1.1 Success Response Envelope (`ApiResponse<T>`)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 48,
    "totalPages": 3
  },
  "timestamp": "2026-11-05T18:30:00.000Z"
}
```

### 1.2 Error Response Envelope (`ApiErrorResponse`)
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input parameters provided.",
    "details": [
      {
        "field": "pincode",
        "message": "Pincode must be exactly 6 digits."
      }
    ]
  },
  "timestamp": "2026-11-05T18:30:00.000Z"
}
```

### 1.3 Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created (e.g. Order placed).
- `400 Bad Request`: Input validation failed (Zod error).
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Business logic violation (e.g. Item out of stock).
- `422 Unprocessable Entity`: Semantic logic error.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server exception.

---

## 2. Catalog & Discovery Endpoints

### 2.1 Products API

#### `GET /api/v1/products`
Retrieves paginated products with faceted filtering.
- **Query Parameters:**
  - `page`: integer (default: 1)
  - `limit`: integer (default: 20, max: 50)
  - `category`: string (slug)
  - `shape`: string (`almond`, `coffin`, `square`, `oval`, `stiletto`)
  - `length`: string (`short`, `medium`, `long`)
  - `finish`: string (`glossy`, `matte`, `chrome`, `glazed`, `cat_eye`)
  - `minPrice`: number
  - `maxPrice`: number
  - `sort`: string (`featured`, `price_asc`, `price_desc`, `newest`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "prod_c1042a",
      "name": "Glazed Rose Chrome Almond",
      "slug": "glazed-rose-chrome-almond",
      "shortDescription": "Soft iridescent rose chrome finish on elegant almond tips.",
      "basePrice": 899.00,
      "compareAtPrice": 1199.00,
      "category": {
        "name": "Press-on Nails",
        "slug": "press-on-nails"
      },
      "primaryImage": {
        "url": "https://res.cloudinary.com/tnl/image/upload/v1/products/rose-almond-1.webp",
        "altText": "Glazed Rose Chrome Almond press-on nails on hand"
      },
      "attributes": {
        "shape": "Almond",
        "length": "Medium",
        "finish": "Chrome Glazed"
      },
      "isUniversalFit": true,
      "inStock": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### `GET /api/v1/products/:slug`
Retrieves comprehensive product details for the PDP.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "prod_c1042a",
    "name": "Glazed Rose Chrome Almond",
    "slug": "glazed-rose-chrome-almond",
    "description": "Full markdown or rich editorial description...",
    "basePrice": 899.00,
    "compareAtPrice": 1199.00,
    "discountPercentage": 25,
    "countryOfOrigin": "India",
    "packageContents": "24 handcrafted press-on nails in 12 sizes, 1 sheet extra-strength jelly tabs (24 tabs), 1 premium liquid nail glue (2g), 1 wooden cuticle pusher stick, 1 dual-sided mini buffer, 2 alcohol prep pads.",
    "applicationGuide": "Step 1: Prep nails...",
    "removalGuide": "Step 1: Soak in warm soapy water for 10 minutes...",
    "images": [
      {
        "id": "img_1",
        "url": "https://res.cloudinary.com/tnl/image/upload/v1/products/rose-almond-1.webp",
        "altText": "Front view on hand",
        "isPrimary": true
      },
      {
        "id": "img_2",
        "url": "https://res.cloudinary.com/tnl/image/upload/v1/products/rose-almond-box.webp",
        "altText": "Unboxing kit contents",
        "isPrimary": false
      }
    ],
    "variants": [
      {
        "id": "var_uni_01",
        "sku": "TNL-ALM-RCR-UNI24",
        "title": "Universal 24-Piece Set",
        "setType": "UNIVERSAL_24",
        "size": null,
        "shape": "Almond",
        "length": "Medium",
        "finish": "Chrome Glazed",
        "price": 899.00,
        "compareAtPrice": 1199.00,
        "inventory": {
          "available": 14,
          "isLowStock": false
        }
      },
      {
        "id": "var_cust_s",
        "sku": "TNL-ALM-RCR-CUST-S",
        "title": "Custom 10-Piece Set (Size Small)",
        "setType": "CUSTOM_10",
        "size": "S",
        "shape": "Almond",
        "length": "Medium",
        "finish": "Chrome Glazed",
        "price": 799.00,
        "compareAtPrice": 999.00,
        "inventory": {
          "available": 2,
          "isLowStock": true
        }
      }
    ]
  }
}
```

---

### 2.2 Collections API

#### `GET /api/v1/collections`
Retrieves all active curated lookbooks and seasonal collections.

#### `GET /api/v1/collections/:slug`
Retrieves a single collection with its editorial narrative and member products.

---

### 2.3 Search API

#### `GET /api/v1/search`
Typo-tolerant product search with faceted aggregation.
- **Query:** `?q=almond`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "query": "almond",
    "totalMatches": 14,
    "products": [ /* array of matching product summaries */ ],
    "facets": {
      "shapes": [{ "name": "Almond", "count": 14 }],
      "finishes": [
        { "name": "Chrome Glazed", "count": 6 },
        { "name": "Glossy", "count": 5 },
        { "name": "Matte", "count": 3 }
      ]
    }
  }
}
```

---

## 3. Cart & Checkout Endpoints

### 3.1 Cart API

#### `POST /api/v1/cart/sync`
Synchronizes guest cart items stored in browser `localStorage` with live backend stock and pricing.
- **Request Body:**
```json
{
  "items": [
    {
      "variantId": "var_uni_01",
      "quantity": 1
    }
  ]
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "variantId": "var_uni_01",
        "productName": "Glazed Rose Chrome Almond",
        "variantTitle": "Universal 24-Piece Set",
        "unitPrice": 899.00,
        "quantity": 1,
        "lineTotal": 899.00,
        "image": "https://res.cloudinary.com/tnl/image/upload/v1/products/rose-almond-1.webp",
        "availableStock": 14,
        "isStockAvailable": true
      }
    ],
    "subtotal": 899.00,
    "freeShippingThreshold": 999.00,
    "amountNeededForFreeShipping": 100.00,
    "isFreeShippingEligible": false
  }
}
```

---

### 3.2 Checkout & Order Placement API

#### `POST /api/v1/checkout/validate-pincode`
Validates an Indian postal pincode and returns city, state, and estimated delivery days.
- **Request Body:**
```json
{
  "pincode": "152116"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "pincode": "152116",
    "city": "Abohar",
    "state": "Punjab",
    "isServiceable": true,
    "estimatedDays": "2-3 business days",
    "courierAvailable": ["Delhivery", "Bluedart"]
  }
}
```

---

#### `POST /api/v1/checkout/create-order`
Validates inventory, reserves stock, creates guest customer records, and creates an immutable order.
- **Request Body:**
```json
{
  "customer": {
    "fullName": "Simran Kaur",
    "phone": "+919876543210",
    "email": "simran.kaur@example.com"
  },
  "shippingAddress": {
    "fullName": "Simran Kaur",
    "phone": "+919876543210",
    "addressLine1": "House #124, Model Town",
    "addressLine2": "Near Gurudwara",
    "city": "Abohar",
    "state": "Punjab",
    "postalCode": "152116",
    "country": "India"
  },
  "items": [
    {
      "variantId": "var_uni_01",
      "quantity": 1
    }
  ],
  "shippingMethod": "STANDARD",
  "paymentMethod": "COD"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "orderNumber": "TNL-2026-10492",
    "status": "CONFIRMED",
    "totalAmount": 899.00,
    "subtotal": 899.00,
    "shippingFee": 0.00,
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "estimatedDelivery": "2026-11-12",
    "createdAt": "2026-11-05T18:45:00.000Z"
  }
}
```

---

### 3.3 Orders API

#### `GET /api/v1/orders/:orderNumber`
Retrieves public order confirmation details for the confirmation receipt screen.

#### `POST /api/v1/orders/track`
Allows guests to check parcel tracking status using Order Number + Phone Number.

