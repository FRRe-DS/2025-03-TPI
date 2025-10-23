import { TransportMethod } from "../entities/transport-method.entity";

export default abstract class TransportMethodsRepository {
    abstract getTransportMethods(): Promise<TransportMethod[]>;
    
    abstract count(): Promise<number>;
    abstract createTransportMethod(data: Partial<TransportMethod>): Promise<TransportMethod>;
}