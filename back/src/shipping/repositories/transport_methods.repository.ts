import { TransportMethod } from "../entities/transport-method.entity";

export default abstract class TransportMethodsRepository {
    abstract getTransportMethods(): Promise<TransportMethod[]>;
}