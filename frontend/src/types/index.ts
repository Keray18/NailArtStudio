export type CategorySlug = 
  | "press-on-nails" 
  | "nail-polish-gel" 
  | "nail-accessories" 
  | "nail-tools" 
  | "application-kits";

export type NailShape = "Almond" | "Coffin" | "Square" | "Oval" | "Stiletto" | "Squoval";
export type NailLength = "Short" | "Medium" | "Long";
export type NailFinish = "Glossy" | "Velvet Matte" | "Glazed Chrome" | "Cat Eye" | "3D Embellished" | "Gold Leaf";
export type ColorFamily = "Nude" | "Pink" | "Red" | "Gold" | "Black" | "Pastel" | "Neutral" | "Blue" | "Green" | "Silver" | "Brown";

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  setType: "UNIVERSAL_24" | "CUSTOM_10" | "STANDARD";
  size?: "XS" | "S" | "M" | "L" | null;
  shape?: NailShape | null;
  length?: NailLength | null;
  finish?: string | null;
  volume?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: {
    name: string;
    slug: CategorySlug;
  };
  collections: string[];
  shortDescription: string;
  description: string;
  packageContents?: string[];
  applicationGuide?: string[];
  removalGuide?: string[];
  basePrice: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes?: {
    shape?: NailShape;
    length?: NailLength;
    finish?: NailFinish;
    colorFamily?: ColorFamily;
    volume?: string;
    material?: string;
    kitType?: string;
  };
  isFeatured?: boolean;
  isNewArrival?: boolean;
  totalStock: number;
  isAvailable: boolean;
  edgeCaseCode?: string; // For testing diagnostics
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  productCount: number;
}

export interface CartItem {
  id: string; // unique item id in cart: `${productId}_${variantId}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderConfirmationData {
  orderNumber: string;
  orderAccessToken: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: "COD" | "ONLINE_MOCK";
  estimatedDeliveryWindow: string;
  isSimulatedPrototype: true;
}

