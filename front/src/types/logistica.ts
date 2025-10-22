// src/types/logistica.ts
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ProductItemInput {
  id: number;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ShippingCostRequest {
  delivery_address: Address;
  departure_postal_code: string;
  products: ProductItemInput[];
  transport_method?: string;
}

export interface ProductCost {
  id: number;
  cost: number;
}

export interface ShippingCostResponse {
  currency: string;
  total_cost: number;
  transport_type: string;
  products: ProductCost[];
}

export interface ShippingCreationRequest {
  user_id: number; 
  delivery_address: Address;
  departure_postal_code: string;
  products: ProductItemInput[];
}

export interface ShippingCreationResponse {
  shipping_id: number;
  status: string; 
  transport_type: string; 
  estimated_delivery_at: string; 
}