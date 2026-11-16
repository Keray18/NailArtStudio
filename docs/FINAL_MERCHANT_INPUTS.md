# THE NAIL LOUNGE — MERCHANT DEPENDENCIES & INPUT SPECIFICATION
**Date:** November 15, 2026  
**Purpose:** Clear catalog of every decision, data point, and configuration required from the business owner to achieve launch readiness.  

---

## 1. ESSENTIAL LAUNCH BLOCKERS (MANDATORY BEFORE LAUNCH)

The items in this section cannot be guessed or improvised by the engineering team. Launch is blocked until the owner provides these inputs.

### A. Real Initial Product Inventory
The storefront cannot launch selling the 36 fictional development products. The merchant must provide at least a core launch collection (recommended: 5 to 15 real products).

For each product, the merchant must provide:
1. **Product Name** (e.g., *"Blush Pearl Handcrafted Press-On Set"*)
2. **Category** (Press-on Nails, Nail Polish & Gel, Nail Accessories, Nail Tools, or Application Kits)
3. **Retail Price (in INR)** (e.g., ₹899)
4. **Compare-At / MRP Price (optional, for discount badge)** (e.g., ₹1,199)
5. **Available Stock Quantity** (Total units available in the Abohar studio)
6. **Product Weight in Grams** (e.g., 40g per press-on kit, 80g per gel bottle)
7. **Sizing / Variant Options** (e.g., Universal 24-piece set, or Custom 10-piece XS/S/M/L)
8. **Product Photos** (At least 1 high-resolution main image, preferably 2–3 showing close-up detailing)

*Format Accepted:* A simple spreadsheet (CSV/Excel) or bulleted list, along with image files or Google Drive links.

---

### B. Delivery Partner Billing Specification
The delivery partner has quoted a rate of **₹60 per kilogram**. The engineering team needs one specific clarification:
- **Billing Method Decision:**
  - **Option 1 (Proportional / Continuous):** Does the courier charge strictly pro-rata by grams?
    *(Example: A 500g package costs ₹30; a 750g package costs ₹45; a 1,200g package costs ₹72).*
  - **Option 2 (Rounded Up / Slab Billing):** Does the courier bill in full 1 kg increments?
    *(Example: Anything up to 1,000g costs ₹60; 1,001g to 2,000g costs ₹120).*
  - **Option 3 (Base Minimum + Excess):** Is there a flat base fee for the first 500g or 1kg?
  
*Default Assumption until Merchant Confirms:* The code will be built with a configurable parameter defaulting to **Option 2 (Rounded Up to nearest kg with a minimum charge of ₹60)**, which is standard for independent parcel couriers in Punjab.

---

### C. Standard Packaging Weight Allowance
Total parcel weight includes not only the press-on nails or polish bottles, but also the protective packaging (mailer box, bubble wrap, nail file, glue, and instruction card).
- **Merchant Input Needed:** What is the average packaging allowance per order in grams?
  *(Recommended industry standard for small beauty mailers: **100 grams**).*

---

### D. Payment Acceptance Method for 1-Day Launch
Because setting up an external payment gateway (e.g., Razorpay, Cashfree, PayU) requires business registration documents, bank KYC verification, and webhook configuration that typically takes 24–72 hours, the merchant must decide which launch payment path to authorize for Day 1:

- **Option A: Direct UPI VPA / QR Code (Prepaid — Highly Recommended for Beauty Re-orders)**
  - Customer completes checkout and is directed to an order receipt screen displaying:
    - Official Merchant UPI ID (VPA), e.g. `merchant@okaxis` or `thenaillounge@icici`.
    - Dynamic UPI QR Code for the exact total amount.
  - Customer pays via Google Pay, PhonePe, or Paytm and enters their 12-digit UTR / Transaction Reference number.
  - The merchant receives the money instantly in their bank account with zero payment gateway transaction fees (0% MDR).
  - *Merchant must provide:* Active Business or Personal UPI ID and registered recipient name.

- **Option B: Phone-Verified Cash on Delivery (COD)**
  - Customer selects Cash on Delivery.
  - Order status is set to `PENDING_VERIFICATION`.
  - The merchant calls the customer on the submitted 10-digit number before packing to verify their intent and address.
  - *Merchant must confirm:* Are you willing to accept COD orders, keeping in mind courier COD reconciliation fees and Return-To-Origin (RTO) risks?

- **Option C: Hybrid (UPI Preferred + COD with ₹50 advance or phone verification)**
  - Allow both options above.

---

### E. Official Merchant Contact Information
The current contact page and footer display generic placeholder contact details. The merchant must provide:
1. **Official WhatsApp Business Phone Number** (for customer support inquiries and order dispatch notifications)
2. **Support Email Address** (e.g., `care@thenaillounge.in` or personal Gmail if domain email is not yet set up)
3. **Physical Studio / Dispatch Address in Abohar** (for invoice compliance and consumer protection rules)

---

## 2. SECONDARY DETAILS (CAN BE REFINED POST-LAUNCH)

These items do NOT block day-one operations and can use sensible defaults:

| Detail | Recommended Default | Safe to Adjust Later? |
|---|---|:---:|
| **Delivery Pincode Coverage** | All serviceable pin codes across India via Indian Post / courier partner | YES |
| **Delivery Transit Promise** | Display: *"Handcrafted in Abohar • Estimated 3 to 7 business days delivery depending on location"* | YES |
| **Promo / Discount Codes** | Disable coupon box on day one to prevent margin leakage | YES |
| **Return & Cancellation Window** | Hygiene non-returnable once opened; 48-hour damaged-in-transit replacement guarantee | YES (Already drafted in policy) |
| **Order Status Notification** | Simple 1-click WhatsApp message button on Owner Dashboard | YES |
| **Email Invoice Automation** | Manual PDF invoice or WhatsApp receipt generated from order screen | YES |

---

## 3. CHECKLIST FOR THE OWNER

Please reply with the following:
```
[ ] 1. Product List: Names, prices, stock counts, approximate weights in grams, and images.
[ ] 2. Delivery Partner Billing: Proportional by weight OR rounded up to nearest kilogram (₹60 base)?
[ ] 3. Packaging Weight: Confirm 100 grams standard packaging allowance?
[ ] 4. Payment Method: Provide UPI ID for direct QR payment, or approve Phone-Verified COD?
[ ] 5. Contact Details: Real WhatsApp number, support email, and studio address.
```

