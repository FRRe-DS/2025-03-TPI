export interface StockProduct {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stockDisponible: number;
    pesoKg: number;
    dimensiones: Dimensiones;
    ubicacion: Ubicacion;
    imagenes: ImagenesItem[];
    categorias: CategoriasItem[];
}
interface Dimensiones {
    largoCm: number;
    anchoCm: number;
    altoCm: number;
}
interface Ubicacion {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}
interface ImagenesItem {
    url: string;
    esPrincipal: boolean;
}
interface CategoriasItem {
    id: number;
    nombre: string;
    descripcion: string;
}
