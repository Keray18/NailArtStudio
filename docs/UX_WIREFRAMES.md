# The Nail Lounge — UX Wireframes Blueprint
**Document Version:** 1.0.0  
**Status:** Approved Blueprint for Phase 0  

---

## 1. Wireframe Architecture & Layout Principles

These low-fidelity structural wireframes define the visual hierarchy, component positioning, content containers, and Call-to-Action (CTA) placements across all primary pages of **The Nail Lounge**.

### Responsive Breakpoint Foundations:
- **Desktop Grid:** 12-column layout, max-width `1280px` centered, `32px` gutter, `24px` horizontal padding.
- **Mobile Grid:** 4-column layout, full width with `16px` side margins, sticky bottom bars for critical actions.

---

## 2. Wireframes for Core Commercial Pages

---

### Wireframe 1: Homepage (`/`)

#### 1A. Desktop Homepage Wireframe (12-Column Layout)
```text
+--------------------------------------------------------------------------------------------------+
| [Top Announcement Bar]: Free Express Delivery on orders above ₹999 | Handcrafted in Abohar, Punjab |
+--------------------------------------------------------------------------------------------------+
| [LOGO: THE NAIL LOUNGE]      [Shop All]  [Collections]  [Nail Studio]  [Sizing Guide]      [Search Q] [♡ Wishlist (0)] [Bag (0)] |
+--------------------------------------------------------------------------------------------------+
| HERO EDITORIAL BANNER (Split 60/40)                                                              |
| +-------------------------------------------------------+--------------------------------------+ |
| |  TAGLINE: Artistry at Your Fingertips                 | [High-Resolution Editorial Image:   ] | |
| |  HEADLINE: Salon-Grade Press-On Nails Delivered        | [Hand with Glazed Chrome Almond Set  ] | |
| |  SUB: Handcrafted, reusable, 15-minute home manicure. | [                                    ] | |
| |                                                       | [                                    ] | |
| |  [ PRIMARY CTA: Explore The Collection ]              | [                                    ] | |
| |  [ SECONDARY CTA: Find Your Nail Size ]               | [                                    ] | |
| +-------------------------------------------------------+--------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| CATEGORY QUICK-PILLS                                                                             |
| [All Styles]   [Press-on Nails]   [Gel Polishes]   [Nail Art & Charms]   [Tools & Lamps]   [Prep Kits] |
+--------------------------------------------------------------------------------------------------+
| VALUE PROPOSITION STRIP (4 Pillars)                                                              |
| [ * 15-Min Application ]  [ * Reusable Up to 3x ]  [ * Natural Nail Safe ]  [ * Abohar Studio Quality ] |
+--------------------------------------------------------------------------------------------------+
| FEATURED CURATED EDIT: "The Bridal & Festive Collection" (Title + Subtitle + "View All ->")     |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
| | [Product Card 1]   | | [Product Card 2]   | | [Product Card 3]   | | [Product Card 4]   |     |
| | Image + Badge      | | Image + Badge      | | Image + Badge      | | Image + Badge      |     |
| | Title & Shape      | | Title & Shape      | | Title & Shape      | | Title & Shape      |     |
| | Price: ₹899 [₹1199]| | Price: ₹749 [₹999] | | Price: ₹999 [₹1299]| | Price: ₹849 [₹1099]|     |
| | [ Quick Add + ]    | | [ Quick Add + ]    | | [ Quick Add + ]    | | [ Quick Add + ]    |     |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
+--------------------------------------------------------------------------------------------------+
| INTERACTIVE SIZING BANNER                                                                        |
| +----------------------------------------------------------------------------------------------+ |
| | "Unsure About Your Nail Size?"                                                               | |
| | Try our Multi-Size 24-Piece Sets (Multiple sizes included) or use our 2-min size tool.       | |
| | [ CTA: Open Sizing Guide & Calculator ]                                                      | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SHOP BY MOOD & OCCASION (4 Visual Tiles)                                                         |
| [ Tile 1: Soft Minimalist ] [ Tile 2: Romantic Bridal ] [ Tile 3: Bold & Edgy ] [ Tile 4: Party Chrome ] |
+--------------------------------------------------------------------------------------------------+
| FOOTER (4 Columns + Bottom Copyright Bar)                                                        |
| Col 1: Brand & Abohar Story | Col 2: Shop Links | Col 3: Customer Care & Sizing | Col 4: Legal & WhatsApp |
+--------------------------------------------------------------------------------------------------+
```

#### 1B. Mobile Homepage Wireframe (Viewport: 375px–420px)
```text
+----------------------------------------+
| [Top Bar: Free Delivery above ₹999]    |
+----------------------------------------+
| [= Menu]   [THE NAIL LOUNGE]   [Q] [Bag]|
+----------------------------------------+
| HERO SECTION                           |
| +------------------------------------+ |
| | [Full Width Editorial Hero Image]  | |
| |                                    | |
| | Artistry at Your Fingertips        | |
| | Salon-grade press-on nails         | |
| |                                    | |
| | [ PRIMARY CTA: Explore Styles ]    | |
| | [ SEC CTA: Sizing Guide ]          | |
| +------------------------------------+ |
+----------------------------------------+
| HORIZONTAL SCROLL CATEGORY PILLS       |
| (Press-on) (Nail Art) (Gel) (Kits) ->  |
+----------------------------------------+
| 4-ICON TRUST BAR                       |
| [15-Min Manicure] [Damage-Free Removal]|
+----------------------------------------+
| TRENDING EDITS (Header + "See All")    |
| +------------------+ +---------------+ |
| | [Product Card 1] | |[Product Card 2]| |
| | Image + Badge    | | Image + Badge  | |
| | Title (Almond)   | | Title (Coffin) | |
| | ₹899 [Save 25%]  | | ₹749 [Save 20%]| |
| | [+ Quick Add]    | | [+ Quick Add]  | |
| +------------------+ +---------------+ |
+----------------------------------------+
| SIZING CALLOUT BANNER                  |
| "Universal 24-Piece Sets: Zero Measure"|
| [ Learn How to Measure ]               |
+----------------------------------------+
| FOOTER ACCORDIONS & WHATSAPP CHAT PILL |
+----------------------------------------+
| [STICKY BOTTOM NAV: Shop | Sizing | Bag]|
+----------------------------------------+
```

---

### Wireframe 2: Shop All Catalog (`/shop`)

#### 2A. Desktop Shop All Wireframe (Sidebar + 4-Col Grid)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER NAVIGATION (Sticky with Search and Mini-Cart indicator)                                   |
+--------------------------------------------------------------------------------------------------+
| Breadcrumbs: Home > Shop All                                         Total: 48 Handcrafted Styles |
| Title: "All Nail Collections"                                        Sort by: [ Featured v ]     |
+----------------------------------+---------------------------------------------------------------+
| LEFT FILTER SIDEBAR (Width: 260px)| MAIN PRODUCT GRID (10-12 Columns, 4-Card Responsive Grid)     |
|                                  |                                                               |
| [ Active Filters: Almond (x) ]   | +-----------------+ +-----------------+ +-----------------+   |
|                                  | | [Product Card 1]| | [Product Card 2]| | [Product Card 3]|   |
| CATEGORY                         | | Image (Hover Zm)| | Image (Hover Zm)| | Image (Hover Zm)|   |
| [x] Press-on Nails (38)          | | Almond | Glossy | | Coffin | Chrome | | Square | Matte   |   |
| [ ] Nail Art Accessories (6)     | | "Rose Quartz"   | | "Glazed French" | | "Espresso Chic" |   |
| [ ] Application Kits (4)         | | ₹899  MRP ₹1199 | | ₹949  MRP ₹1299 | | ₹799  MRP ₹999  |   |
|                                  | | [ Quick Add + ] | | [ Quick Add + ] | | [ Quick Add + ] |   |
| NAIL SHAPE                       | +-----------------+ +-----------------+ +-----------------+   |
| [x] Almond (18)                  | +-----------------+ +-----------------+ +-----------------+   |
| [ ] Coffin (12)                  | | [Product Card 4]| | [Product Card 5]| | [Product Card 6]|   |
| [ ] Square (10)                  | | ...             | | ...             | | ...             |   |
| [ ] Oval (8)                     | +-----------------+ +-----------------+ +-----------------+   |
|                                  |                                                               |
| FINISH                           | [ LOAD MORE STYLES: Showing 12 of 48 ]                        |
| [ ] Glossy   [ ] Velvet Matte    |                                                               |
| [ ] Chrome   [ ] 3D Crystals     |                                                               |
|                                  |                                                               |
| PRICE SLIDER (₹499 - ₹1,499)     |                                                               |
| [ Clear All Filters ]            |                                                               |
+----------------------------------+---------------------------------------------------------------+
```

#### 2B. Mobile Shop All Wireframe (2-Col Grid + Bottom Filter Trigger)
```text
+----------------------------------------+
| [= Menu]   [THE NAIL LOUNGE]   [Q] [Bag]|
+----------------------------------------+
| Breadcrumbs: Home > Shop All           |
| "Shop All Nails" (48 styles)           |
+----------------------------------------+
| [ FILTER & SORT TRIGGER BUTTON (Fixed) ]|
| Active: [ Almond (x) ] [ Under ₹999 (x)]|
+----------------------------------------+
| 2-COLUMN RESPONSIVE GRID               |
| +------------------+ +---------------+ |
| | [Product Card 1] | |[Product Card 2]| |
| | Almond | Glossy  | | Coffin | Chrome| |
| | "Rose Quartz"    | | "Glazed French"| |
| | ₹899  MRP ₹1199  | | ₹949  MRP ₹1299| |
| | [+ Add to Bag]   | | [+ Add to Bag] | |
| +------------------+ +---------------+ |
| +------------------+ +---------------+ |
| | [Product Card 3] | |[Product Card 4]| |
| | Square | Matte   | | Oval | Velvet  | |
| | "Espresso Chic"  | | "Lavender Fog" | |
| | ₹799  MRP ₹999   | | ₹849  MRP ₹1099| |
| | [+ Add to Bag]   | | [+ Add to Bag] | |
| +------------------+ +---------------+ |
+----------------------------------------+
| [ Load 12 More Styles Button ]         |
+----------------------------------------+
```

---

### Wireframe 3: Collection Listing (`/collections`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER NAVIGATION                                                                                |
+--------------------------------------------------------------------------------------------------+
| Editorial Title: "Curated Lookbooks & Thematic Collections"                                       |
| Subtitle: "Handcrafted sets assembled for occasions, moods, and seasonal moments."               |
+--------------------------------------------------------------------------------------------------+
| HERO COLLECTION CARD (Full Width Span)                                                           |
| +----------------------------------------------------------------------------------------------+ |
| | [ High-Res Banner: "The Royal Bridal Suite"                                                  | |
| |   Intricate pearls, 3D florals, and champagne metallic finishes for your big day.           | |
| |   [ EXPLORE BRIDAL EDIT -> ]                                                                 | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| 3-COLUMN EDITORIAL COLLECTION GRID                                                               |
| +--------------------------+ +--------------------------+ +--------------------------+           |
| | [Collection Card 1]      | | [Collection Card 2]      | | [Collection Card 3]      |           |
| | "Clean Girl Minimalist"  | | "The Midnight Gala Edit" | | "Festive Sparkle Suite"  |           |
| | Soft nudes, micro-French | | Moody velvet, deep wine  | | Gold leaf & chrome foil  |           |
| | 12 Handcrafted Styles    | | 8 Handcrafted Styles     | | 14 Handcrafted Styles    |           |
| | [ View Collection -> ]   | | [ View Collection -> ]   | | [ View Collection -> ]   |           |
| +--------------------------+ +--------------------------+ +--------------------------+           |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 4: Individual Collection Detail (`/collections/:slug`)
```text
+--------------------------------------------------------------------------------------------------+
| Breadcrumbs: Home > Collections > The Bridal Edit                                                |
| +----------------------------------------------------------------------------------------------+ |
| | EDITORIAL HERO BANNER                                                                        | |
| | "The Bridal & Festive Collection"                                                            | |
| | Handcrafted sets designed with luxury Swarovski-style crystals, gel gloss, and gold leaf.    | |
| | Bundle Perk: Buy 2 Bridal Sets, Get 1 Deluxe Application Kit Free.                          | |
| +----------------------------------------------------------------------------------------------+ |
| Collection Filter Pills: [All Bridal] [French Elegance] [Heavy Embellished] [Subtle Shimmer]    |
+--------------------------------------------------------------------------------------------------+
| 4-COLUMN COLLECTION PRODUCT GRID (Products specifically assigned to this collection)             |
| [ Card 1: Golden Tiara Almond ]  [ Card 2: Pearl French Coffin ]  [ Card 3: Rose Quartz Glaze ]   |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 5: Category Listing (`/category/:slug`)
```text
+--------------------------------------------------------------------------------------------------+
| Breadcrumbs: Home > Categories > Nail Art Tools & Care Kits                                      |
| Category Header: "Nail Tools, Glues & Preparation Kits"                                          |
| Category Intro: "Salon-grade essentials designed for damage-free wear, longevity, and safe removal."|
+--------------------------------------------------------------------------------------------------+
| Sub-Category Chips: [All Tools]  [Glues & Tabs]  [Prep Wipes & Dehydrators]  [Cuticle Oils & Files]  |
+--------------------------------------------------------------------------------------------------+
| 4-COLUMN GRID (Focused on tools and application accessories)                                     |
| [ Card 1: Complete Prep Kit ] [ Card 2: 48x Jelly Tabs ] [ Card 3: Vitamin E Cuticle Oil Pen ]   |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 6: Product Detail Page (PDP) (`/products/:slug`)

#### 6A. Desktop PDP Wireframe (Split 2-Column Sticky Layout)
```text
+--------------------------------------------------------------------------------------------------+
| Breadcrumbs: Home > Press-on Nails > Glazed Rose Chrome Almond                                    |
+-------------------------------------------------------+------------------------------------------+
| LEFT COLUMN (Gallery & Media - Sticky)                | RIGHT COLUMN (Product Buy Box & Specs)   |
|                                                       |                                          |
| +---------------------------------------------------+ | Title: "Glazed Rose Chrome Almond"       |
| | [ MAIN IMAGE VIEWPORT (Aspect: 4:5)             ] | SKU: TNL-PRS-042 | Shape: Medium Almond  |
| | [ High-res macro shot of nails on hand          ] |                                          |
| | [ Hover: Pinch & Zoom magnifying view           ] | Price: ₹899  MRP: ₹1,199  (Save 25%)     |
| +---------------------------------------------------+ | Tax: Inclusive of all taxes              |
|                                                       |                                          |
| THUMBNAIL ROW (4-5 angles):                           | STEP 1: CHOOSE SET TYPE                  |
| [Thumb 1] [Thumb 2] [Thumb 3] [Box Contents] [Video]  | (•) Universal 24-Piece Set [RECOMMENDED] |
|                                                       |     "Fits all finger sizes. No measuring"|
|                                                       | ( ) Custom Sized 10-Piece Set            |
|                                                       |     Select Size: [ XS ] [ S ] [ M ] [ L ]|
|                                                       |     [ ? Sizing Guide & Calculator ]      |
|                                                       |                                          |
|                                                       | SPECIFICATION BADGES                     |
|                                                       | [ Shape: Almond ] [ Length: Medium ]     |
|                                                       | [ Finish: Glazed Chrome ]                |
|                                                       |                                          |
|                                                       | STOCK ALERT: [• In Stock (Ready to ship)]|
|                                                       |                                          |
|                                                       | QUANTITY & ACTIONS                       |
|                                                       | Qty: [ -  1  + ]                         |
|                                                       | [ PRIMARY CTA: ADD TO BAG — ₹899 ]       |
|                                                       | [ SECONDARY CTA: BUY NOW (Express Buy) ] |
|                                                       |                                          |
|                                                       | PINCODE SERVICEABILITY CHECKER           |
|                                                       | Enter 6-digit Pincode: [ 152116 ] [Check]|
|                                                       | Estimated Delivery: 2-3 Days (Free)      |
|                                                       |                                          |
|                                                       | COLLAPSIBLE INFORMATION ACCORDIONS       |
|                                                       | [v] What's Inside the Box (Complete Kit) |
|                                                       | [>] How to Apply in 4 Steps (Tabs vs Glue|
|                                                       | [>] Safe, Damage-Free Removal            |
|                                                       | [>] Material, Country of Origin & Care   |
+-------------------------------------------------------+------------------------------------------+
| COMPLETE YOUR MANICURE (Frequently Bought Together Bundle)                                        |
| [x] This Press-on Set (₹899)  +  [x] Jelly Glue Tabs (₹99)  +  [x] Cuticle Oil Pen (₹149)        |
| Total: ₹1,047 (Save ₹100) -> [ Add All 3 to Bag ]                                                |
+--------------------------------------------------------------------------------------------------+
| VERIFIED CUSTOMER REVIEWS (Empty state for new launch: "Be the first to review this style")       |
+--------------------------------------------------------------------------------------------------+
| RELATED STYLES CAROUSEL (4 Recommended Styles in Almond Shape)                                    |
+--------------------------------------------------------------------------------------------------+
```

#### 6B. Mobile PDP Wireframe (Single Column + Sticky Bottom Bar)
```text
+----------------------------------------+
| [< Back]   [THE NAIL LOUNGE]   [♡] [Bag]|
+----------------------------------------+
| FULL-BLEED SWIPEABLE IMAGE CAROUSEL    |
| +------------------------------------+ |
| |                                    | |
| | [ Macro Photo of Nails on Hand ]   | |
| |                                    | |
| | [o o o o] (Image 1 of 4)           | |
| +------------------------------------+ |
+----------------------------------------+
| TITLE & PRICING                        |
| "Glazed Rose Chrome Almond"            |
| ₹899  MRP ₹1,199 [25% OFF]             |
| Inclusive of all taxes                 |
+----------------------------------------+
| SET TYPE SELECTOR                      |
| [x] Multi-Size 24-Piece Set (12 Sizes) |
| [ ] Custom 10-Piece Set (XS / S / M /L)|
| [ ? Sizing Guide: Measure in 2 Mins ]  |
+----------------------------------------+
| PINCODE CHECKER                        |
| [ Enter Pincode... ] [ Check ]         |
+----------------------------------------+
| PRODUCT ACCORDIONS (Tap to Expand)     |
| [v] What's in the Box                  |
| [>] How to Apply (Tabs vs Glue)        |
| [>] Safe Removal & Reusability         |
+----------------------------------------+
| COMPLEMENTARY QUICK ADD-ONS            |
| [+ Add Cuticle Oil Pen for ₹149 ]      |
+----------------------------------------+
| REVIEWS & RATINGS                      |
+----------------------------------------+
| [PERSISTENT BOTTOM CTA BAR:            |
|  ₹899 | [ ADD TO BAG ]  [ BUY NOW ]   ]|
+----------------------------------------+
```

---

### Wireframe 7: Search Results (`/search`)
```text
+--------------------------------------------------------------------------------------------------+
| Search Header: [ Input: "french almond"                [X Clear] [Search Button] ]               |
| Found 14 styles matching "french almond"                                                         |
| Quick Filter Pills: [ All (14) ]  [ Short (4) ]  [ Medium (8) ]  [ Long (2) ]  [ Under ₹999 (9) ] |
+--------------------------------------------------------------------------------------------------+
| 4-COLUMN SEARCH RESULTS GRID                                                                     |
| [ Card 1: Classic French Almond ] [ Card 2: Glazed French Almond ] [ Card 3: Rose Gold French ]  |
+--------------------------------------------------------------------------------------------------+
| (IF ZERO RESULTS FOUND):                                                                         |
| "No styles matched your search for 'neon glitter stiletto'."                                     |
| Popular Searches: [ Bridal Almond ]  [ Everyday French ]  [ Chrome Glazed ]  [ Complete Prep Kit]|
| Curated Recommendation Grid (4 Trending Styles)                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 8: Slide-out Cart Drawer (Mini-Cart)
```text
+----------------------------------------------------------+
| YOUR SHOPPING BAG (2 Items)                     [ Close X ]|
+----------------------------------------------------------+
| FREE SHIPPING PROGRESS METER                             |
| [======------------] You are ₹100 away from FREE SHIPPING!|
+----------------------------------------------------------+
| CART ITEMS LIST (Scrollable Container)                   |
| +------------------------------------------------------+ |
| | [Thumb]  Glazed Rose Chrome Almond                   | |
| |          Set: Universal 24-Piece Set                 | |
| |          ₹899        Qty: [ -  1  + ]   [ Trash Icon]| |
| +------------------------------------------------------+ |
| | [Thumb]  Extra Jelly Glue Tabs (24 Tabs)             | |
| |          Essential Application Adhesive              | |
| |          ₹99         Qty: [ -  1  + ]   [ Trash Icon]| |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| IN-CART 1-CLICK UPSELL                                   |
| "Complete Your Manicure Kit:"                            |
| [Mini Pic] Nourishing Cuticle Oil Pen - ₹149  [ + Add ]  |
+----------------------------------------------------------+
| ORDER SUMMARY                                            |
| Subtotal:                                        ₹998.00 |
| Shipping:                           Calculated at Checkout|
+----------------------------------------------------------+
| [ PRIMARY CTA: PROCEED TO CHECKOUT — ₹998 ]              |
| [ Secondary: View Full Bag ]                             |
| (•) 100% Safe Payments | 48-Hour Damage Guarantee        |
+----------------------------------------------------------+
```

---

### Wireframe 9: Full Cart Page (`/cart`)
```text
+--------------------------------------------------------------------------------------------------+
| Breadcrumbs: Home > Shopping Bag                                                                 |
| Stepper: (1) Shopping Bag  ------  (2) Delivery & Payment  ------  (3) Order Confirmed           |
+---------------------------------------------------------+----------------------------------------+
| LEFT COLUMN: ITEMS TABLE (Width: 65%)                   | RIGHT COLUMN: ORDER SUMMARY (Width: 35%)|
|                                                         |                                        |
| Product                 Size/Variant   Qty    Total     | ORDER TOTALS                           |
| ------------------------------------------------------- | Subtotal:                      ₹998.00 |
| [Pic] Glazed Rose Almond  Universal    [1]    ₹899.00   | Shipping:                        ₹0.00 |
| [Pic] Jelly Glue Tabs     24-sheet     [1]     ₹99.00   | (Free Express Shipping Applied!)       |
|                                                         | -------------------------------------- |
| [ Continue Shopping Link ]                              | Total Amount:                  ₹998.00 |
|                                                         | Inclusive of all taxes                 |
| COUPON CODE PROMO:                                      |                                        |
| [ Enter Discount Code...      ] [ Apply ]               | [ PRIMARY CTA: PROCEED TO CHECKOUT ]   |
|                                                         |                                        |
|                                                         | Safe & Secure Checkout Guaranteed      |
|                                                         | Dispatched from Abohar, Punjab         |
+---------------------------------------------------------+----------------------------------------+
```

---

### Wireframe 10: Guest Checkout (`/checkout`)

#### 10A. Desktop Checkout Wireframe (2-Step Accordion + Summary)
```text
+--------------------------------------------------------------------------------------------------+
| MINIMAL HEADER: [ THE NAIL LOUNGE ]                      [ 100% Secure Checkout SSL ] [ Return ] |
+---------------------------------------------------------+----------------------------------------+
| LEFT COLUMN: CHECKOUT STEPS (Width: 60%)                | RIGHT COLUMN: ORDER SUMMARY (Width: 40%)|
|                                                         |                                        |
| STEP 1: CONTACT & SHIPPING ADDRESS                      | [Cart Item 1] Glazed Rose Almond  ₹899 |
| Email for receipt:   [ user@example.com              ]  | [Cart Item 2] Extra Glue Tabs     ₹99  |
| WhatsApp Phone:      [ +91 98765 43210               ]  | -------------------------------------- |
| Full Name:           [ Simran Kaur                   ]  | Subtotal:                      ₹998.00 |
| Street / House No:   [ House #124, Model Town        ]  | Delivery:                         FREE |
| 6-digit Pincode:     [ 152116 ] (Auto-verified)      | Total Payable:                 ₹998.00 |
| City:                [ Abohar ] (Auto-filled)        |                                        |
| State:               [ Punjab ] (Auto-filled)        |                                        |
|                                                         |                                        |
| STEP 2: SHIPPING METHOD & PAYMENT                       |                                        |
| Shipping Speed:                                         |                                        |
| (•) Standard Delivery (3-5 business days) — FREE        |                                        |
| ( ) Express Air Courier (1-2 business days) — ₹99       |                                        |
|                                                         |                                        |
| Payment Method:                                         |                                        |
| (•) Cash on Delivery (COD) / Direct Verification        |                                        |
| ( ) UPI / Netbanking / Cards (Phase 5 Gateway)          |                                        |
|                                                         |                                        |
| [ PRIMARY CTA: PLACE ORDER — ₹998 ]                     |                                        |
| By placing your order, you agree to our Terms of Sale.  |                                        |
+---------------------------------------------------------+----------------------------------------+
```

#### 10B. Mobile Checkout Wireframe (Stacked Single Column)
```text
+----------------------------------------+
| [< Bag]    THE NAIL LOUNGE    [Secure] |
+----------------------------------------+
| ORDER SUMMARY ACCORDION                |
| [v] 2 Items in Bag — Total: ₹998       |
+----------------------------------------+
| 1. CONTACT & DELIVERY                  |
| WhatsApp Phone: [ +91 98765 43210    ] |
| Full Name:      [ Simran Kaur        ] |
| Address:        [ House 124, St 2    ] |
| Pincode:        [ 152116 ]             |
| City / State:   [ Abohar, Punjab ]     |
+----------------------------------------+
| 2. PAYMENT                             |
| (•) Cash on Delivery (COD)             |
| ( ) UPI / Cards                        |
+----------------------------------------+
| [ PRIMARY CTA: CONFIRM ORDER — ₹998 ]  |
+----------------------------------------+
```

---

### Wireframe 11: Order Confirmation (`/order-confirmation/:orderNumber`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER NAVIGATION                                                                                |
+--------------------------------------------------------------------------------------------------+
| +----------------------------------------------------------------------------------------------+ |
| | SUCCESS BANNER                                                                               | |
| | [ Green Checkmark Icon ]                                                                     | |
| | "Thank you, Simran! Your order has been placed."                                             | |
| | Order Number: #TNL-2026-8812  |  A confirmation has been sent to your WhatsApp & Email.      | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| ESTIMATED DELIVERY WINDOW: Thursday, Nov 12 – Saturday, Nov 14                                   |
| Delivery Address: House #124, Model Town, Abohar, Punjab - 152116                                |
|                                                                                                  |
| ITEMS ORDERED:                                                                                   |
| 1. Glazed Rose Chrome Almond (Universal 24-Piece Set) x 1 ............................ ₹899.00  |
| 2. Extra Jelly Glue Tabs (Sheet of 24) x 1 ............................................. ₹99.00  |
| Total Paid (Cash on Delivery): ₹998.00                                                           |
|                                                                                                  |
| VALUE ADDITION ACTIONS:                                                                          |
| [ Download Step-by-Step Application Guide (PDF) ]                                                |
| [ Track Order Status ]        [ Continue Shopping ]                                              |
|                                                                                                  |
| Need assistance with this order?                                                                 |
| [ Chat with our Abohar Studio Concierge on WhatsApp ]                                            |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 12: About Us Page (`/about`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER NAVIGATION                                                                                |
+--------------------------------------------------------------------------------------------------+
| HERO MANIFESTO: "Artistry at Your Fingertips"                                                    |
| Subtitle: "Handcrafted salon luxury, born in Abohar and delivered to beauty lovers across India."|
+--------------------------------------------------------------------------------------------------+
| 2-COLUMN STORY SECTION (Split 50/50)                                                             |
| +------------------------------------+ +------------------------------------------------------+ |
| | [ Artisan Studio Image:            | | THE ABOHAR CRAFT HERITAGE                             | |
| |   Hand-painting intricate gel sets | | The Nail Lounge was founded with a single mission: to | |
| |   with precision brushes           | | make luxury, salon-grade manicures accessible, quick,  | |
| |   in Abohar, Punjab ]              | | and completely damage-free.                           | |
| +------------------------------------+ +------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| OUR 3 COMMITMENTS                                                                                |
| [ 1. Salon-Grade ABS Plastic ]  [ 2. 100% Reusable Tips ]  [ 3. Zero Natural Nail Damage ]       |
+--------------------------------------------------------------------------------------------------+
| [ CTA: Browse Our Artisan Collections -> ]                                                       |
+--------------------------------------------------------------------------------------------------+
```

---

### Wireframe 13: FAQ & Help Center (`/faq`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER NAVIGATION                                                                                |
+--------------------------------------------------------------------------------------------------+
| FAQ SEARCH BAR: [ Search questions (e.g. "sizing", "durability", "delivery")...        [Search] ]|
+--------------------------------------------------------------------------------------------------+
| CATEGORY TABS: [ All ]  [ Sizing & Fit ]  [ Application & Wear ]  [ Shipping ]  [ Care & Returns ]|
+--------------------------------------------------------------------------------------------------+
| ACCORDION QUESTIONS LIST                                                                         |
| [v] How long do The Nail Lounge press-ons stay on?                                               |
|     When applied with our liquid glue, sets last 2-3 weeks. When applied with jelly tabs, they   |
|     last 2-4 days, making them perfect for weekend parties and fully reusable.                   |
| [>] How do I know my nail size?                                                                  |
| [>] Will press-on nails damage my natural nail bed?                                              |
| [>] What courier partners do you use for delivery across India?                                  |
| [>] What if my set arrives damaged during shipping?                                              |
+--------------------------------------------------------------------------------------------------+
| STILL NEED HELP?                                                                                 |
| [ Direct WhatsApp Chat with Studio Specialist ]    [ Email Customer Support ]                    |
+--------------------------------------------------------------------------------------------------+
```

