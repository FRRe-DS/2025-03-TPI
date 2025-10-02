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
