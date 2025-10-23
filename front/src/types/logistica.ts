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
  order_id: number;
  products: ProductItemInput[];
  transport_type: string;
}

export interface ShippingCreationResponse {
  shipping_id: number;
  status: string; 
  transport_type: string; 
  estimated_delivery_at: string; 
}

export interface TransportMethod {
  id: number;
  name: string;
  type: string;
  estimatedDays: string;
}

export interface AddressWithId {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: number;
}

export interface ShipmentProduct {
  idShipment: number;
  idProduct: number;
  quantity: number;
  product: {
    id: number;
  };
}

export interface ShippingResponse {
  id: number;
  user: {
    id: number;
  };
  originAddress: AddressWithId;
  destinationAddress: AddressWithId;
  date: string;
  status: string;
  transportMethod: TransportMethod;
  totalCost: string;
  createdAt: string;
  updatedAt: string;
  shipmentProducts: ShipmentProduct[];
}