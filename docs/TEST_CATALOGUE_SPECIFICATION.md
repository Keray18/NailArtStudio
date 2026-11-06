# The Nail Lounge — Test Catalogue Specification (Development Fixtures)
**Document Version:** 1.0.0  
**Status:** Approved Fixture Specification for Phase 1 Prototype  
**Notice:** All products, descriptions, prices, SKUs, and stock quantities in this document are **realistic fictional development fixtures**. They are designed to stress-test the UI across normal and edge cases and do not represent actual commercial inventory or pricing commitments.

---

## 1. Category Distribution Summary

The prototype fixture catalogue contains exactly **36 deterministic products** across 5 distinct categories:

| Category Code | Category Display Name | Target Count | Actual Count | Key Edge Cases Represented |
| :--- | :--- | :---: | :---: | :--- |
| `press-on-nails` | Press-on Nails | 18 | 18 | Multi-variant, Universal vs Sized, Out of stock, Low stock, Unavailable variant, Long product name |
| `nail-polish-gel` | Nail Polish & Gel Systems | 6 | 6 | No sizing required, Single variant, Volume variants, Air dry vs UV gel |
| `nail-accessories` | Nail Art & Accessories | 5 | 5 | Single variant, No secondary image, Tiny unit price, High stock |
| `nail-tools` | Nail-Art Tools & Lamps | 4 | 4 | Electrical vs manual tool, Premium price point, Low stock |
| `application-kits`| Application & Care Kits | 3 | 3 | Bundle kit, Multi-component package contents, Starter set |
| **TOTAL** | | **36** | **36** | Comprehensive catalog coverage |

---

## 2. Edge Case Coverage Matrix

To rigorously test UI resilience rather than merely presenting idealized layouts, the catalogue intentionally includes:

| Edge Case Code | Description | Fixture Product SKU | Expected UI Behavior |
| :--- | :--- | :--- | :--- |
| **EC-01: Out of Stock** | Physical stock = 0 on all variants | `FIX-PRS-004` (Midnight Velvet Coffin) | "Sold Out" button, disabled Add to Bag, out-of-stock badge on catalog card. |
| **EC-02: Low Stock** | Physical stock <= 3 units | `FIX-PRS-002` (Blush French Almond) | "Only 2 left" low-stock indicator, warning in PDP accordion. |
| **EC-03: Single Variant** | Item with no size or finish options | `FIX-ACC-001` (Gold Chrome Nail Powder) | Variant selector hidden or collapsed to simple "Standard 5g Pot". |
| **EC-04: Multi-Variant Sizing** | Universal 24-pc vs Custom 10-pc (XS/S/M/L) | `FIX-PRS-001` (Glazed Rose Chrome Almond) | Interactive radio/pill selector; switches price and updates availability. |
| **EC-05: Unavailable Combination**| Size L is out of stock while XS/S/M are in stock | `FIX-PRS-003` (Golden Halo Square) | Size 'L' chip struck through / disabled; displays "Out of Stock in this size". |
| **EC-06: No Secondary Image** | Product has only 1 primary image | `FIX-TLS-002` (Dual-Ended Cuticle Pusher) | Gallery disables thumbnail carousel; single main image renders cleanly without layout break. |
| **EC-07: Ultra-Long Title** | Title exceeding 50 characters | `FIX-PRS-018` | Truncation or clean multi-line wrapping without breaking grid alignment. |
| **EC-08: Ultra-Short Description**| Description is a single short sentence | `FIX-ACC-004` (Mini Wooden Cuticle Sticks) | Layout handles short vertical content without collapsing containers. |
| **EC-09: Premium High Price** | Item priced at ₹1,899 (Pro UV lamp) | `FIX-TLS-004` (Salon Flash-Cure UV Lamp) | Formatting of 4-digit INR prices with commas (`₹1,899.00`). |
| **EC-10: Budget Low Price** | Item priced at ₹79 (Prep wipes pack) | `FIX-KIT-003` (Alcohol Dehydrator Wipes) | In-cart quick add handles low prices without breaking subtotal calculations. |
| **EC-11: Non-Sizing Category** | Polish, tools, and accessories | `FIX-POL-001` through `FIX-TLS-004` | Hides nail shape, length, and finger sizing UI completely. |

---

## 3. Complete 36-Product Catalog Data Dictionary

### Category 1: Press-on Nails (18 Products)

1. **`FIX-PRS-001` — Glazed Rose Chrome Almond**
   - Price: ₹899 | MRP: ₹1,199 | Shape: Almond | Length: Medium | Finish: Glazed Chrome | Color: Blush / Rose
   - Variants: Universal 24-Pcs (Stock: 12), Custom 10-Pcs XS (Stock: 4), S (Stock: 2), M (Stock: 5), L (Stock: 3)
   - Collection: "The Minimalist Edit" | Images: 3 photos | Edge Case: Multi-variant core showcase

2. **`FIX-PRS-002` — Blush Micro-French Almond**
   - Price: ₹799 | MRP: ₹999 | Shape: Almond | Length: Short | Finish: Glossy | Color: Nude / Pink
   - Variants: Universal 24-Pcs (Stock: 2 — Low Stock Alert)
   - Collection: "The Minimalist Edit" | Images: 2 photos | Edge Case: Low Stock (`EC-02`)

3. **`FIX-PRS-003` — Golden Halo Square**
   - Price: ₹949 | MRP: ₹1,299 | Shape: Square | Length: Medium | Finish: 3D Embellished | Color: Gold / Ivory
   - Variants: Custom 10-Pcs XS (Stock: 4), S (Stock: 3), M (Stock: 2), L (Stock: 0 — Unavailable)
   - Collection: "Bridal & Festive" | Images: 3 photos | Edge Case: Unavailable Variant (`EC-05`)

4. **`FIX-PRS-004` — Midnight Velvet Coffin**
   - Price: ₹899 | MRP: ₹1,199 | Shape: Coffin | Length: Long | Finish: Cat Eye / Velvet | Color: Black / Charcoal
   - Variants: Universal 24-Pcs (Stock: 0 — Sold Out)
   - Collection: "Midnight Glam" | Images: 2 photos | Edge Case: Out of Stock (`EC-01`)

5. **`FIX-PRS-005` — Royal Pearl Embellished Stiletto**
   - Price: ₹1,299 | MRP: ₹1,699 | Shape: Stiletto | Length: Long | Finish: 3D Rhinestone & Pearl | Color: Champagne / Pearl
   - Variants: Custom 10-Pcs S (Stock: 4), M (Stock: 3)
   - Collection: "Bridal & Festive" | Images: 3 photos | Edge Case: Premium Embellished Set

6. **`FIX-PRS-006` — Classic Nude Squoval**
   - Price: ₹699 | MRP: ₹899 | Shape: Squoval | Length: Short | Finish: Velvet Matte | Color: Neutral Nude
   - Variants: Universal 24-Pcs (Stock: 25)
   - Collection: "Everyday 9-to-5" | Images: 2 photos | Edge Case: High Stock Universal Set

7. **`FIX-PRS-007` — Lavender Fog Aura Almond**
   - Price: ₹849 | MRP: ₹1,099 | Shape: Almond | Length: Medium | Finish: Aura Gradient / Glossy | Color: Pastel Lavender
   - Variants: Universal 24-Pcs (Stock: 8), Custom 10-Pcs S (Stock: 3), M (Stock: 4)
   - Collection: "The Minimalist Edit" | Images: 2 photos

8. **`FIX-PRS-008` — Crimson Wine Gold Leaf Coffin**
   - Price: ₹999 | MRP: ₹1,349 | Shape: Coffin | Length: Medium | Finish: Gold Leaf Foil | Color: Deep Red / Wine
   - Variants: Universal 24-Pcs (Stock: 7)
   - Collection: "Bridal & Festive" | Images: 3 photos

9. **`FIX-PRS-009` — Espresso Swirl Oval**
   - Price: ₹799 | MRP: ₹999 | Shape: Oval | Length: Short | Finish: Abstract Swirl Gloss | Color: Brown / Coffee
   - Variants: Universal 24-Pcs (Stock: 11)
   - Collection: "Everyday 9-to-5" | Images: 2 photos

10. **`FIX-PRS-010` — Celestial Star Glaze Almond**
    - Price: ₹899 | MRP: ₹1,199 | Shape: Almond | Length: Medium | Finish: Chrome with Star Nail Art | Color: Silver / Blue
    - Variants: Universal 24-Pcs (Stock: 6)
    - Collection: "Midnight Glam" | Images: 2 photos

11. **`FIX-PRS-011` — Emerald Green Chrome Square**
    - Price: ₹849 | MRP: ₹1,099 | Shape: Square | Length: Short | Finish: Mirror Chrome | Color: Emerald Green
    - Variants: Universal 24-Pcs (Stock: 9)
    - Collection: "Midnight Glam" | Images: 2 photos

12. **`FIX-PRS-012` — Champagne French Ballerina**
    - Price: ₹949 | MRP: ₹1,249 | Shape: Coffin | Length: Long | Finish: Glitter French | Color: Champagne Gold
    - Variants: Custom 10-Pcs S (Stock: 5), M (Stock: 4)
    - Collection: "Bridal & Festive" | Images: 3 photos

13. **`FIX-PRS-013` — Matte Tortoiseshell Oval**
    - Price: ₹849 | MRP: ₹1,099 | Shape: Oval | Length: Medium | Finish: Velvet Matte | Color: Tortoise Amber / Black
    - Variants: Universal 24-Pcs (Stock: 14)
    - Collection: "Everyday 9-to-5" | Images: 2 photos

14. **`FIX-PRS-014` — Baby Pink Sugar Glitter Short Round**
    - Price: ₹749 | MRP: ₹949 | Shape: Oval | Length: Short | Finish: Textured Sugar Glitter | Color: Baby Pink
    - Variants: Universal 24-Pcs (Stock: 18)
    - Collection: "The Minimalist Edit" | Images: 2 photos

15. **`FIX-PRS-015` — Gothic Rose 3D Stiletto**
    - Price: ₹1,149 | MRP: ₹1,499 | Shape: Stiletto | Length: Long | Finish: 3D Floral Acrylic | Color: Blood Red / Black
    - Variants: Custom 10-Pcs M (Stock: 3)
    - Collection: "Midnight Glam" | Images: 2 photos

16. **`FIX-PRS-016` — Vanilla Chrome Micro-Square**
    - Price: ₹799 | MRP: ₹999 | Shape: Square | Length: Short | Finish: Pearlescent Glaze | Color: Off-White / Pearl
    - Variants: Universal 24-Pcs (Stock: 16)
    - Collection: "The Minimalist Edit" | Images: 2 photos

17. **`FIX-PRS-017` — Ruby Sabyasachi Inspired Bridal Coffin**
    - Price: ₹1,399 | MRP: ₹1,899 | Shape: Coffin | Length: Long | Finish: Kundan Stone Embellished | Color: Maroon / Gold
    - Variants: Universal 24-Pcs (Stock: 5)
    - Collection: "Bridal & Festive" | Images: 3 photos

18. **`FIX-PRS-018` — Handcrafted Artisan Floral Blossom Luxe Embellished Medium Almond Press-On Set**
    - Price: ₹1,199 | MRP: ₹1,599 | Shape: Almond | Length: Medium | Finish: 3D Encapsulated Florals | Color: Peach / Gold
    - Variants: Universal 24-Pcs (Stock: 4)
    - Collection: "Bridal & Festive" | Images: 2 photos | Edge Case: Ultra-Long Title (`EC-07`)

---

### Category 2: Nail Polish & Gel Systems (6 Products)

19. **`FIX-POL-001` — Gel Glaze Top Coat (No-Wipe UV Formula)**
    - Price: ₹399 | MRP: ₹499 | Volume: 15ml | Type: UV/LED Gel | Color: Clear High-Gloss
    - Edge Case: Single variant, non-sizing product

20. **`FIX-POL-002` — Velvet Matte Gel Finish Coat**
    - Price: ₹399 | MRP: ₹499 | Volume: 15ml | Type: UV/LED Gel | Color: Matte Clear

21. **`FIX-POL-003` — Salon Pro Base Gel Primer**
    - Price: ₹349 | MRP: ₹449 | Volume: 15ml | Type: UV/LED Gel | Color: Clear

22. **`FIX-POL-004` — Studio Lacquer — Rose Chai**
    - Price: ₹249 | MRP: ₹299 | Volume: 12ml | Type: Breathable Air-Dry | Color: Dusky Pink

23. **`FIX-POL-005` — Studio Lacquer — Abohar Terracotta**
    - Price: ₹249 | MRP: ₹299 | Volume: 12ml | Type: Breathable Air-Dry | Color: Warm Clay

24. **`FIX-POL-006` — Magnetic Cat Eye Gel — Northern Aurora**
    - Price: ₹449 | MRP: ₹599 | Volume: 10ml | Type: Magnetic UV Gel | Color: Shimmer Violet

---

### Category 3: Nail Art & Accessories (5 Products)

25. **`FIX-ACC-001` — Ultra-Fine Glazed Chrome Mirror Powder (5g)**
    - Price: ₹299 | MRP: ₹399 | Color: White Iridescent | Format: Jar with sponge applicator
    - Edge Case: Low price point, single variant

26. **`FIX-ACC-002` — 3D Metallic Butterfly Charms (Pack of 10)**
    - Price: ₹199 | MRP: ₹249 | Material: Gold Alloy & Cubic Zirconia
    - Edge Case: Accessory, non-sizing

27. **`FIX-ACC-003` — French Tip Smile-Line Silicone Stamper & Scraper**
    - Price: ₹249 | MRP: ₹349 | Tool type: French manicure precision guide

28. **`FIX-ACC-004` — Mini Wooden Cuticle Manicure Sticks (Pack of 20)**
    - Price: ₹99 | MRP: ₹149 | Tool: Birchwood sticks
    - Edge Case: Ultra-short description (`EC-08`), single image (`EC-06`)

29. **`FIX-ACC-005` — Swarovski-Style Crystal Rhinestones Wheel (12 Compartments)**
    - Price: ₹349 | MRP: ₹499 | Variety: Mixed sizes (SS3 to SS10)

---

### Category 4: Nail-Art Tools & Equipment (4 Products)

30. **`FIX-TLS-001` — Professional Dual-Grit Glass Nail File & Shaper**
    - Price: ₹199 | MRP: ₹299 | Material: Tempered Nano-Glass

31. **`FIX-TLS-002` — Dual-Ended Surgical Stainless Steel Cuticle Pusher**
    - Price: ₹179 | MRP: ₹249 | Material: Medical Stainless Steel
    - Edge Case: Only 1 primary image (`EC-06`)

32. **`FIX-TLS-003` — Ultra-Precision Detail Liner Brush Set (3 Sizes)**
    - Price: ₹349 | MRP: ₹499 | Includes: 7mm, 9mm, 11mm nylon bristles

33. **`FIX-TLS-004` — Salon Flash-Cure Mini UV/LED Handheld Lamp**
    - Price: ₹1,899 | MRP: ₹2,499 | Power: 18W USB Rechargeable | Color: Ivory Gold
    - Edge Case: High ticket price point (`EC-09`), low stock (Stock: 3)

---

### Category 5: Application & Care Kits (3 Products)

34. **`FIX-KIT-001` — The Complete Press-On Application Starter Kit**
    - Price: ₹449 | MRP: ₹599 | Includes: 1 Liquid Glue (2g), 48 Jelly Tabs, 1 Glass File, 2 Cuticle Sticks, 4 Prep Wipes
    - Edge Case: Multi-component kit bundle

35. **`FIX-KIT-002` — Extra-Strength Jelly Glue Adhesive Tabs (Sheet of 48)**
    - Price: ₹129 | MRP: ₹179 | Count: 48 waterproof adhesive tabs
    - Edge Case: Frequent in-cart 1-click upsell

36. **`FIX-KIT-003` — Alcohol Dehydrator & Sanitizing Prep Wipes (Pack of 10)**
    - Price: ₹79 | MRP: ₹99 | Count: 10 individually sealed isopropyl wipes
    - Edge Case: Lowest catalogue price (`EC-10`)

