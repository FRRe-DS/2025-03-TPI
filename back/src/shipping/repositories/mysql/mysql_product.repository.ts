import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import ProductRepository from '../product.repository';

@Injectable()
export default class MySqlProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async findOne (idp:number):Promise<Product|null>{
        return this.productRepository.findOne({
            where: { id: idp }
        })
    }

    create(idp:number):Product{
        return this.productRepository.create({id:idp})
    }

    async save(product:Partial<Product>):Promise<Product>{
        return this.productRepository.save(product)
    }

    async count():Promise<number>{
        return this.productRepository.count();
    }
}