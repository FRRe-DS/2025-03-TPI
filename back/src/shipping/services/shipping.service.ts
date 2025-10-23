import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';
import { Address } from '../entities/address.entity';
import { Product } from '../entities/product.entity';
import { ShipmentProduct } from '../entities/shipment-product.entity';
import { User } from '../entities/user.entity';
import { TransportMethod } from '../entities/transport-method.entity';
import { CreateShippmentRequestDto } from '../dto/create-shippment-request.dto';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import TransportMethodsRepository from '../repositories/transport_methods.repository';
import ShipmentRepository from '../repositories/shipment.repository';
import GetShipmentsRepository from '../repositories/get-shipments.repository';
import { TransportMethodsResponseDto } from '../dto/transport-methods-response.dto';
import { ShippingListResponseDto } from '../dto/shipping-list.response';
import { ShippingDetailsResponseDto } from '../dto/shipping-detail.dto';
import { ShippingIdNotFoundException } from '../../common/exceptions/shipping-id-notfound.exception';
import { CostCalculationRequestDto } from '../dto/cost-calculation-request.dto';
import { CreateShippingResponseDto } from '../dto/create-shipment-response.dto';
import { CancelShippingResponseDto } from '../dto/cancel-shipping-response.dto'; 
import { CostCalculationResponseDto } from '../dto/cost-calculation-response.dto';


@Injectable()
export class ShippingService {
  constructor(
    private readonly transportMethodsRepository: TransportMethodsRepository,
    private readonly shipmentRepository: ShipmentRepository,
    private readonly getShipmentsRepository: GetShipmentsRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ShipmentProduct)
    private readonly shipmentProductRepository: Repository<ShipmentProduct>,
    @InjectRepository(TransportMethod)
    private readonly transportMethodRepository: Repository<TransportMethod>
  ) { }

  async getTransportMethods(): Promise<TransportMethodsResponseDto> {
    const methods = await this.transportMethodsRepository.getTransportMethods();
    return {
      transportMethods: methods.map(method => ({
        id: method.id,
        name: method.name,
        type: method.type,
        estimatedDays: method.estimatedDays
      }))
    };
  }

  async createShipment(createShippmentDto: CreateShippmentRequestDto): Promise<CreateShippingResponseDto> {
    // 1. Verificar o crear usuario
    let user = await this.userRepository.findOne({
      where: { id: createShippmentDto.user_id }
    });

    if (!user) {
      user = this.userRepository.create({ id: createShippmentDto.user_id });
      user = await this.userRepository.save(user);
    }

    //TODO esto se deberia buscar de los productos
    // 2. Crear direcciones (siempre se crean nuevas)
    const originAddress = this.addressRepository.create({
      street: "Av. Siempre Viva 742",
      city: "Springfield",
      state: "Illinois",
      country: "US",
      postalCode: 62704
    });
    const savedOriginAddress = await this.addressRepository.save(originAddress);

    const destinationAddress = this.addressRepository.create({
      street: createShippmentDto.delivery_address.street,
      city: createShippmentDto.delivery_address.city,
      state: createShippmentDto.delivery_address.state,
      country: createShippmentDto.delivery_address.country,
      postalCode: createShippmentDto.delivery_address.postal_code
    });
    const savedDestinationAddress = await this.addressRepository.save(destinationAddress);

    // 3. Verificar método de transporte
    const transportMethod = await this.transportMethodRepository.findOne({
      where: { type: createShippmentDto.transport_type }
    });

    if (!transportMethod) {
      throw new NotFoundException('Transport method not found');
    }

    // TODO: Implementar lógica de cálculo de costo
    const totalCost = 100;
    // 4. Crear shipment
    const savedShipment = await this.shipmentRepository.createShipment({
      user: user,
      originAddress: savedOriginAddress,
      destinationAddress: savedDestinationAddress,
      transportMethod: transportMethod,
      status: ShippingStatus.PENDING,
      totalCost: totalCost,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 5. Verificar o crear produtos y crea relaciones 
    for (const productDto of createShippmentDto.products) {
      let product = await this.productRepository.findOne({
        where: { id: productDto.id }
      });

      if (!product) {
        product = this.productRepository.create({ id: productDto.id });
        product = await this.productRepository.save(product);
      }

      const shipmentProduct = this.shipmentProductRepository.create({
        shipment: savedShipment,
        product: product,
        quantity: productDto.quantity
      });
      await this.shipmentProductRepository.save(shipmentProduct);
    }

    // 6. Retornar shipment completo
    const result = await this.shipmentRepository.findShipmentById(savedShipment.id);

    if (!result) {
      throw new NotFoundException('Shipment created but not found');
    }

    return {
      shipping_id: result.id,
      status: result.status,
      transport_type: result.transportMethod.type,
      estimated_delivery_at: result.transportMethod.estimatedDays,
    };
  }

  async ShippingServicePagination(
    page: number = 1,
    itemsPerPage: number = 20,
  ): Promise<ShippingListResponseDto> {
    const [shipments, total] = await this.getShipmentsRepository.findAll(page, itemsPerPage);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      shipments: shipments.map(shipment => ({
        shipping_id: shipment.id,
        order_id: shipment.orderId,
        user_id: shipment.user.id,
        products: shipment.shipmentProducts.map(sp => ({
          id: sp.product.id,
          productId: sp.product.id,
          quantity: sp.quantity
        })),
        status: shipment.status,
        transport_type: shipment.transportMethod.type,
        estimated_delivery_at: shipment.transportMethod.estimatedDays,
        created_at: shipment.createdAt.toDateString(),
      })),
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: total,
        items_per_page: itemsPerPage,
      },
    };
  }

  async findById(id: number): Promise<ShippingDetailsResponseDto> {
    const shipment = await this.getShipmentsRepository.findById(id);

    if (!shipment) {
      throw new ShippingIdNotFoundException();
    }

    return {
      shipping_id: shipment.id,
      order_id: shipment.orderId,
      user_id: shipment.user.id,
      delivery_Address: {
        street: shipment.destinationAddress.street,
        city: shipment.destinationAddress.city,
        state: shipment.destinationAddress.state,
        postal_code: shipment.destinationAddress.postalCode,
        country: shipment.destinationAddress.country,
      },
      departure_Address: {
        street: shipment.originAddress.street,
        city: shipment.originAddress.city,
        state: shipment.originAddress.state,
        postal_code: shipment.originAddress.postalCode,
        country: shipment.originAddress.country,
      },
      products: shipment.shipmentProducts.map(sp => ({
        id: sp.product.id,
        productId: sp.product.id,
        quantity: sp.quantity
      })),
      status: shipment.status,
      transport_type: {
        type: shipment.transportMethod.type,
      },
      tracking_number: shipment.trackingNumber,
      carrier_name: shipment.carrierName,
      total_cost: shipment.totalCost,
      currency: 'ARS',
      estimated_delivery_at: shipment.transportMethod.estimatedDays,
      created_at: shipment.createdAt.toDateString(),
      updated_at: shipment.updatedAt.toDateString(),
      logs: shipment.logs?.map(log => ({
        timestamp: log.timestamp.toISOString(),
        status: log.status,
        message: log.message,
      })),
    };
  }

  async cancelShipment(id: number): Promise<CancelShippingResponseDto> {
    const shipment = await this.shipmentRepository.findShipmentById(id);

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    // TODO: Implementar lógica de cancelación
    throw new Error('Method not implemented');
  }

  async calculateCost(costRequest: CostCalculationRequestDto): Promise<CostCalculationResponseDto> {
    // TODO: Implementar lógica de cálculo de costo
    throw new Error('Method not implemented');
  }
}