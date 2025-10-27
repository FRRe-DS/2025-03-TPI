import { TransportMethod } from "../entities/transport-method.entity";
import { TransportMethods } from "src/shared/enums/transport-methods.enum";

export default abstract class TransportMethodsRepository {
    abstract getTransportMethods(): Promise<TransportMethod[]>;
    
    abstract count(): Promise<number>;
    abstract createTransportMethod(data: Partial<TransportMethod>): Promise<TransportMethod>;
    abstract findOne(transport_type:TransportMethods):Promise<TransportMethod|null>;
}