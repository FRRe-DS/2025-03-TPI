import { Injectable } from '@nestjs/common';
import { CreateShipmentDto } from '../dto/create-shippment.dto';
import { CostCalculationRequestDto } from '../dto/cost-calculation-request.dto';
import { TransportMethodsResponseDto } from '../dto/transport-methods-response.dto';
import { ShippingDetailsResponseDto } from '../dto/shipping-detail.dto';
import { ShippingStatus } from 'src/shared/enums/shipping-status.enum';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

//exceptions
import { InvalidCostCalculationException } from 'src/common/exceptions/invalid-cost-calculation.exception';
import { UnexpectedErrorException } from 'src/common/exceptions/unexpected-error.ecxeption';
import { UnprocessableEntityException } from 'src/common/exceptions/unprocessable-entity.exception';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';
import { BusinessRuleViolationException } from 'src/common/exceptions/business-rule-viol.exception';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server.exception';
import { InvalidShippingOrderException } from 'src/common/exceptions/invalid-shipping-order.exception';
import { ShippingIdNonCancellableException } from 'src/common/exceptions/shipping-id-noncancellable.exception';
import { ShippingIdNotFoundException } from 'src/common/exceptions/shipping-id-notfound.exception';
import { ShippingOrdersException } from 'src/common/exceptions/shipping-orders.exception';

@Injectable()
export class ShippingService {
  constructor(
    // Inyectar repositorios, servicios externos, etc.
    // private readonly shippingRepository: ShippingRepository,
    // private readonly carrierService: CarrierService,
  ) {}
  
  async getTransportMethods(): Promise<TransportMethodsResponseDto> {
    try {
      // Lógica para obtener métodos de transporte
      // const methods = await this.transportRepository.findAll();
      
      // Mock de respuesta
      return {
        transportMethods: [
        {
          type: TransportMethods.AIR,
          name: 'Air',
          estimatedDeliveryTimeInDays: [1, 2]
        },
        {
          type: TransportMethods.SEA,
          name: 'Sea',
          estimatedDeliveryTimeInDays: [5, 10]
        },
        {
          type: TransportMethods.ROAD,
          name: 'Road',
          estimatedDeliveryTimeInDays: [3, 7]
        },
        {
          type: TransportMethods.RAIL,
          name: 'Rail',
          estimatedDeliveryTimeInDays: [4, 8]
        }
      ]
      };
    } catch (error) {   //Captura todos los errores conocidos por HttpException y los definidos por nosotros
      if (error.status) {
        throw error;
      }
      throw new UnexpectedErrorException(); //En este ultimo bloque devuelve si el error no es conocido
    }
  }

  async createShipment(ship: CreateShipmentDto) {
    try {
      // Validaciones de negocio
      // this.validateShipmentData(createShipmentDto);

      // Lógica de creación
      // const shipment = await this.shippingRepository.create(createShipmentDto);
      
      // Por ahora retornamos mock
      return { message: 'Shipping order created successfully', order: ship };
    } catch (error) {
      // Si ya es una HttpException, la propagamos
      if (error.status) {
        throw error;
      }
      // Si es un error inesperado, lo envolvemos
      throw new UnexpectedErrorException();
    }
  }

  async findById(id: number): Promise<ShippingDetailsResponseDto> {
    try {
      // Buscar en base de datos
      // const shipping = await this.shippingRepository.findById(id);

      // Retornar datos
      return {
        shipping_id: id,
        order_id: 123,
        user_id: 456,
        deliveryAddress: {
          street: 'Av. Siempre Viva 742',
          city: 'Springfield',
          state: 'Illinois',
          country: 'US',
          postalCode: '62704',
        },
        departureAddress: {
          street: 'Depósito Central',
          city: 'Springfield',
          state: 'Illinois',
          country: 'US',
          postalCode: '62701',
        },
        products: [{ id: 1, quantity: 2 }],
        shippingStatus: ShippingStatus.IN_TRANSIT,
        transport_type: { type: 'road' },
        tracking_number: 'LOG-AR-123456789',
        carrier_name: 'Express Logistics SA',
        total_cost: 45.5,
        currency: 'ARS',
        estimated_delivery_at: '2025-10-01T00:00:00Z',
        created_at: '2025-09-01T10:00:00Z',
        updated_at: '2025-09-20T10:00:00Z',
        logs: [
          {
            timestamp: '2025-09-15T09:29:00Z',
            status: ShippingStatus.IN_TRANSIT,
            message: 'Shipment is in distribution',
          },
          {
            timestamp: '2025-09-10T14:00:00Z',
            status: ShippingStatus.CREATED,
            message: 'Shipment created',
          },
        ],
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnexpectedErrorException();
    }
  }

  async cancelShipment(id: number) {
    try {
      // Buscar el envío
      //const shipping = await this.findById(id);

      // Validar si puede ser cancelado
      //this.validateCancellation(shipping);

      // Actualizar estado
      // await this.shippingRepository.update(id, { 
      //   status: ShippingStatus.CANCELLED 
      // });

      return { message: `Shipping order ${id} canceled successfully` };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnexpectedErrorException();
    }
  }

  async calculateCost(costRequest: CostCalculationRequestDto) {
    try {
      // Validar datos de entrada
      //this.validateCostCalculation(costRequest);

      // Lógica de cálculo de costo
      // const cost = await this.costCalculatorService.calculate(costRequest);

      // const cost = this.mockCalculateCost(costRequest);

      return { currency: 'ARS', 
        cost: 10.0, 
        transport_method: TransportMethods.AIR, 
        products: [{ id: 1, quantity: 2 }] };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnexpectedErrorException();
    }
  }
} // class ShippingService