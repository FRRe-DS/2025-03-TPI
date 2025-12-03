import { TransportMethodDomain } from "../domain/transport-method";
import { TransportMethods } from "src/shared/enums/transport-methods.enum";

export default abstract class TransportMethodsRepository {
    abstract getTransportMethods(): Promise<TransportMethodDomain[]>;
    
    abstract count(): Promise<number>;
    abstract createTransportMethod(data: Partial<TransportMethodDomain>): Promise<TransportMethodDomain>;
    abstract findOne(transport_type:TransportMethods):Promise<TransportMethodDomain|null>;
}