import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import UserRepository from '../user.repository';

@Injectable()
export default class MySqlUserRepository implements UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne (idu:number):Promise<User|null>{
        return this.userRepository.findOne({
            where: { id: idu }
        })
    }

    async create(idu:number):Promise<User>{
        
    }

}