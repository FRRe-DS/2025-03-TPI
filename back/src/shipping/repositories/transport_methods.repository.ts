import { TransportMethod } from "../entities/transport-method.entity";

export default abstract class TransportMethodsRepository {
    abstract getTransportMethods(): Promise<TransportMethod[]>;
    abstract findOne(transport_type:string):Promise<TransportMethod|null>;
}