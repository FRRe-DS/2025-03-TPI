import { Shipment } from "../entities/shipment.entity";

export default abstract class GetShipmentsRepository {
    abstract findAll(page: number, itemsPerPage: number): Promise<[Shipment[], number]>;
    abstract findById(id: number): Promise<Shipment | null>;
}