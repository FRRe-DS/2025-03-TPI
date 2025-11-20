import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import ProductRepository from '../product.repository';

@Injectable()
export default class MySqlProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly userRepository: Repository<Product>,
    ) {}

    async findOne (idp:number):Promise<Product|null>{
        return this.userRepository.findOne({
            where: { id: idp }
        })
    }

    create(idp:number):Product{
        return this.userRepository.create({id:idp})
    }

    async save(user:Partial<Product>):Promise<Product>{
        return this.userRepository.save(user)
    }
}