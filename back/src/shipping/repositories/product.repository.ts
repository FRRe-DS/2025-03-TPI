import { Product } from "../entities/product.entity";

export default abstract class ProductRepository{
    abstract findOne(idp: number):Promise<Product|null>;
    abstract create(idp:number):Product;
    abstract save(product:Product):Promise<Product>;
    abstract count():Promise<number>;
    abstract findAll(): Promise<Product[]>;
}