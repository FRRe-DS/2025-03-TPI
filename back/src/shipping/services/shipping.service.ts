import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';
import { Address } from '../entities/address.entity';
import { Product } from '../entities/product.entity';
import { ShipmentProduct } from '../entities/shipment-product.entity';
import { User } from '../entities/user.entity';
import { TransportMethod } from '../entities/transport-method.entity';
import { CreateShippmentDto } from '../dto/create-shippment.dto';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import TransportMethodsRepository from '../repositories/transport_methods.repository';
import ShipmentRepository from '../repositories/shipment.repository';
import { TransportMethodsResponseDto } from '../dto/transport-methods-response.dto';
import { ShippingListResponse } from '../dto/shipping-list.response';
import { ShippingDetailsResponseDto } from '../dto/shipping-detail.dto';
//import { PaginationDto } from '../../shared/dto/pagination.dto';
import { CostCalculationRequestDto } from '../dto/cost-calculation-request.dto';

@Injectable()
export class ShippingService {
  constructor(
    private readonly transportMethodsRepository: TransportMethodsRepository,
    private readonly shipmentRepository: ShipmentRepository,
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

  async createShipment(createShippmentDto: CreateShippmentDto): Promise<Shipment> {
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
      postalCode: parseInt(createShippmentDto.delivery_address.postal_code || '0')
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

    // 5. Verificar o crear produtos e criar relações
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

    return result;
  }

  async ShippingServicePagination(page: number, itemsPerPage: number): Promise<ShippingListResponse> {
    // TODO: Implementar lógica de paginación
    throw new Error('Method not implemented');
  }

  async findById(id: number): Promise<ShippingDetailsResponseDto> {
    const shipment = await this.shipmentRepository.findShipmentById(id);

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    // TODO: Mapear a ShippingDetailsResponseDto
    throw new Error('Method not implemented');
  }

  async cancelShipment(id: number): Promise<any> {
    const shipment = await this.shipmentRepository.findShipmentById(id);

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    // TODO: Implementar lógica de cancelación
    throw new Error('Method not implemented');
  }

  async calculateCost(costRequest: CostCalculationRequestDto): Promise<any> {
    // TODO: Implementar lógica de cálculo de costo
    throw new Error('Method not implemented');
  }
}