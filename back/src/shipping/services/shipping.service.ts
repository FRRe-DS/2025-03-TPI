import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippmentRequestDto } from '../dto/create-shippment-request.dto';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import TransportMethodsRepository from '../repositories/transport_methods.repository';
import ShipmentRepository from '../repositories/shipment.repository';
import UserRepository from '../repositories/user.repository';
import AddressRepository from '../repositories/address.repository';
import ProductRepository from '../repositories/product.repository';
import { TransportMethodsResponseDto } from '../dto/transport-methods-response.dto';
import { ShippingListResponseDto } from '../dto/shipping-list.response';
import { ShippingDetailsResponseDto } from '../dto/shipping-detail.dto';
import { TransportMethodNotFoundException } from '../../common/exceptions/transport_method-notfound.exception';
import { ShippingIdNotFoundException } from '../../common/exceptions/shipping-id-notfound.exception';
import { ShippingIdNonCancellableException } from '../../common/exceptions/shipping-id-noncancellable.exception';
import { CostCalculationRequestDto } from '../dto/cost-calculation-request.dto';
import { CreateShippingResponseDto } from '../dto/create-shipment-response.dto';
import { CancelShippingResponseDto } from '../dto/cancel-shipping-response.dto';
import { CostCalculationResponseDto } from '../dto/cost-calculation-response.dto';
import { ShippingStatementLogsRequestDto } from '../dto/shipping-statement-logs-request.dto';
import { ShippingStatementLogsResponseDto } from '../dto/shipping-statement-logs-response.dto';
import { CostCalculatorService, ProductWithDetails } from './cost-calculation-service';
import ShipmentProductRepository from '../repositories/shipment_product.repository';
import shippingLogRepository from '../repositories/shipping-log.repository';
import { StockProduct } from 'src/shared/types/stock-api';
import { ShippingStatusTransitionHelper } from '../helpers/shipping-status-transition.helper';
import { BusinessRuleViolationException } from '../../common/exceptions/business-rule-viol.exception';

@Injectable()
export class ShippingService {
  constructor(
    private readonly transportMethodsRepository: TransportMethodsRepository,
    private readonly shipmentRepository: ShipmentRepository,
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository,
    private readonly shipmentProductRepository: ShipmentProductRepository,
    private readonly costCalculatorService: CostCalculatorService,
    private readonly shippingLogRepository: shippingLogRepository
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
    let user = await this.userRepository.findOne(createShippmentDto.user_id);

    if (!user) {
      user = this.userRepository.create(createShippmentDto.user_id);
      user = await this.userRepository.save(user);
    }

    //TODO esto se deberia buscar de los productos
    // 2. Crear direcciones (siempre se crean nuevas)
    const originAddress = await this.addressRepository.createAddress({
      street: "Av. Siempre Viva 742",
      city: "Springfield",
      state: "Illinois",
      postal_code: "62704",
      country: "US"
    });
    const savedOriginAddress = await this.addressRepository.saveAddress(originAddress);

    const destinationAddress = await this.addressRepository.createAddress(createShippmentDto.delivery_address);

    const savedDestinationAddress = await this.addressRepository.saveAddress(destinationAddress);

    // 3. Verificar método de transporte
    const transportMethod = await this.transportMethodsRepository.findOne(createShippmentDto.transport_type);

    if (!transportMethod) {
      throw new TransportMethodNotFoundException();
    }

    // TODO: Implementar lógica de cálculo de costo
    const totalCost = 100;
    // 4. Crear shipment
    // Generar tracking number aleatorio
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000); // 9 dígitos
    const trackingNumber = `LOG-AR-${randomNumber}`;
    const carrierName = 'Andreani'
    const savedShipment = await this.shipmentRepository.createShipment(user, createShippmentDto.order_id, savedOriginAddress, savedDestinationAddress, transportMethod, totalCost, trackingNumber, carrierName);

    // 5. Verificar o crear produtos y crea relaciones 
    for (const productDto of createShippmentDto.products) {
      let product = await this.productRepository.findOne(productDto.id);

      if (!product) {
        product = this.productRepository.create(productDto.id);
        product = await this.productRepository.save(product);
      }

      //TODO: Esto debería ser un repository, estamos ligados a la BD con esto
      const shipmentProduct = await this.shipmentProductRepository.create(savedShipment, product, productDto.quantity);

      await this.shipmentProductRepository.save(shipmentProduct);
    }
    //TODO: Esto debería ser un repository, estamos ligados a la BD con esto
    const shippingLog = await this.shippingLogRepository.create(savedShipment);
    await this.shippingLogRepository.save(shippingLog);

    // 6. Retornar shipment completo
    const result = await this.shipmentRepository.findShipmentById(savedShipment.id);

    if (!result) {
      throw new ShippingIdNotFoundException();
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
    const [shipments, total] = await this.shipmentRepository.findAll(page, itemsPerPage);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      shipments: shipments.map(shipment => ({
        shipping_id: shipment.id,
        order_id: shipment.orderId,
        user_id: shipment.user.id,
        products: shipment.shipmentProducts.map(sp => ({
          id: sp.product.id,
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
    const shipment = await this.shipmentRepository.findShipmentById(id);

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
    // 1. Buscar el shipment
    const shipment = await this.shipmentRepository.findShipmentById(id);

    // 2b. Si no existe, lanzar error
    if (!shipment) {
      throw new ShippingIdNotFoundException();
    }

    // 2a. Verificar el estado actual
    const cancellableStatuses = [
      ShippingStatus.CREATED,
      ShippingStatus.RESERVED,
    ];

    // 3b. Si no se puede cancelar, lanzar error
    if (!cancellableStatuses.includes(shipment.status)) {
      throw new ShippingIdNonCancellableException();
    }

    // 3a. Cancelar el shipment
    await this.shipmentRepository.cancelById(id);

    // Retornar respuesta
    return {
      shipping_id: id,
      status: ShippingStatus.CANCELLED,
      //Se pone la fecha y hora actual
      cancelled_at: new Date().toISOString(),
    };
  }

  async calculateCost(costRequest: CostCalculationRequestDto, token: string): Promise<CostCalculationResponseDto> {
    // 1. Obtener los detalles de los productos desde la API de stock

    console.log(`---------------------------> Hacer request a servicio de stock: ${process.env.STOCK_SERVICE_URL}/api/productos`);
    
    const promises = costRequest.products.map(async (p) => {
      const response = await fetch(`${process.env.STOCK_SERVICE_URL}/api/productos/${p.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP al obtener producto ${p.id}: ${response.status}`);
      }
      
      return response.json() as Promise<StockProduct>;
    });

    const stockProducts: StockProduct[] = await Promise.all(promises);

    // 2. Mapear los productos de stock a ProductWithDetails
    const productsWithDetails: ProductWithDetails[] = costRequest.products.map((p, index) => {
      const stockProduct = stockProducts[index];
      
      return {
        id: p.id,
        quantity: p.quantity,
        weight: stockProduct.pesoKg,
        length: stockProduct.dimensiones.largoCm,
        width: stockProduct.dimensiones.anchoCm,
        height: stockProduct.dimensiones.altoCm,
        warehouse_postal_code: stockProduct.ubicacion.postal_code,
      };
    });

    console.log(`-------------------------> Products with details: ${JSON.stringify(productsWithDetails)}`);


    const destinationPostalCode = costRequest.delivery_address.postal_code || 'C1000AAA';

    return this.costCalculatorService.calculateCost(
      productsWithDetails,
      destinationPostalCode as any,
    )
  }

  async updateShippingStatus(id: number, updateStatusDto: ShippingStatementLogsRequestDto): Promise<ShippingStatementLogsResponseDto> {
    // 1. Buscar el shipment
    const shipment = await this.shipmentRepository.findShipmentById(id);

    // 2. Si no existe, lanzar error
    if (!shipment) {
      throw new ShippingIdNotFoundException();
    }

    // 3. Validar que la transición de estado sea permitida
    const isValidTransition = ShippingStatusTransitionHelper.isValidTransition(
      shipment.status,
      updateStatusDto.newStatus
    );

    if (!isValidTransition) {
      throw new BusinessRuleViolationException(
        `No se puede cambiar del estado "${shipment.status}" al estado "${updateStatusDto.newStatus}". ` +
        `Transiciones permitidas: ${ShippingStatusTransitionHelper.getAvailableNextStatuses(shipment.status).join(', ') || 'ninguna'}`
      );
    }

    // 4. Actualizar el estado y crear log
    const message = updateStatusDto.notes || `Estado actualizado a ${updateStatusDto.newStatus}`;
    await this.shipmentRepository.updateStatus(id, updateStatusDto.newStatus, message);

    // 5. Obtener todos los logs actualizados
    const logs = await this.shippingLogRepository.findByShipmentId(id);

    // 6. Obtener estados permitidos siguientes
    const allowedNextStatuses = ShippingStatusTransitionHelper.getAvailableNextStatuses(updateStatusDto.newStatus);

    // 7. Retornar respuesta
    return {
      orderId: id.toString(),
      currentStatus: updateStatusDto.newStatus,
      statusHistory: logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        status: log.status,
        message: log.message,
      })),
      allowedNextStatuses: allowedNextStatuses,
    };
  }
}