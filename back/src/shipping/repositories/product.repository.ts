import { ProductDomain } from "../domain/product";

export default abstract class ProductRepository {
    abstract findOne(idp: number): Promise<ProductDomain | null>;
    abstract create(idp: number): ProductDomain;
    abstract save(product: Partial<ProductDomain>): Promise<ProductDomain>;
    abstract count(): Promise<number>;
    abstract findAll(): Promise<ProductDomain[]>;
}