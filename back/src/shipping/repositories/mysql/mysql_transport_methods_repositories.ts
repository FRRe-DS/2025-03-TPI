import { Injectable } from "@nestjs/common";
import { TransportMethod } from "src/shipping/entities/transport-method.entity";
import TransportMethodsRepository from "../transport_methods.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export default class MySqlTransportMethodsRepositories implements TransportMethodsRepository {
    constructor(
        @InjectRepository(TransportMethod)
        private readonly itemsRepository: Repository<TransportMethod>
    ) { }
    async getTransportMethods(): Promise<TransportMethod[]> {
        return await this.itemsRepository.find();
    }
}