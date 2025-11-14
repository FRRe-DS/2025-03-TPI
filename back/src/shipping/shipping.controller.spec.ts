import { Test, TestingModule } from '@nestjs/testing';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './services/shipping.service';
import { CreateShippmentRequestDto } from './dto/create-shippment-request.dto';
import { CostCalculationRequestDto } from './dto/cost-calculation-request.dto';
import { PaginationInDto } from '../shared/dto/pagination-in-dto';
import { ShippingStatus } from '../shared/enums/shipping-status.enum';
import { TransportMethods } from '../shared/enums/transport-methods.enum';
import { ShippingIdNotFoundException } from '../common/exceptions/shipping-id-notfound.exception';

describe('ShippingController', () => {
  let controller: ShippingController;
  let service: jest.Mocked<ShippingService>;

  beforeEach(async () => {
    const mockShippingService = {
      createShipment: jest.fn(),
      calculateCost: jest.fn(),
      findById: jest.fn(),
      ShippingServicePagination: jest.fn(),
      cancelShipment: jest.fn(),
      getTransportMethods: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [
        {
          provide: ShippingService,
          useValue: mockShippingService,
        },
      ],
    }).compile();

    controller = module.get<ShippingController>(ShippingController);
    service = module.get(ShippingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Definición del controller', () => {
    it('debería estar definido', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('POST /shipping - createShippingOrder', () => {
    it('debería crear un shipment exitosamente', async () => {
      const mockDto: CreateShippmentRequestDto = {
        user_id: 1,
        order_id: 100,
        delivery_address: {
          street: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1043AAZ',
          country: 'Argentina',
        },
        transport_type: TransportMethods.AIR,
        products: [{ id: 101, quantity: 2 }],
      };

      const mockResponse = {
        shipping_id: 1,
        status: ShippingStatus.PENDING,
        transport_type: TransportMethods.AIR,
        estimated_delivery_at: '2',
      };

      service.createShipment.mockResolvedValue(mockResponse);

      const result = await controller.createShippingOrder(mockDto);

      expect(result).toEqual(mockResponse);
      expect(service.createShipment).toHaveBeenCalledWith(mockDto);
      expect(service.createShipment).toHaveBeenCalledTimes(1);
    });

    it('debería propagar errores del servicio', async () => {
      const mockDto: CreateShippmentRequestDto = {
        user_id: 1,
        order_id: 100,
        delivery_address: {
          street: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1043AAZ',
          country: 'Argentina',
        },
        transport_type: TransportMethods.AIR,
        products: [{ id: 101, quantity: 2 }],
      };

      const error = new Error('Database error');
      service.createShipment.mockRejectedValue(error);

      await expect(controller.createShippingOrder(mockDto)).rejects.toThrow('Database error');
      expect(service.createShipment).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('POST /shipping/cost - calculateShippingCost', () => {
    it('debería calcular el costo de envío exitosamente', async () => {
      const mockDto: CostCalculationRequestDto = {
        delivery_address: {
          street: 'Av. Belgrano 5678',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1092AAA',
          country: 'Argentina',
        },
        products: [{ id: 101, quantity: 2 }],
      };

      const mockResponse = {
        total_cost: 1500,
        currency: 'ARS',
        transport_type: 'AIR',
        products: [{ id: 101, cost: 1500 }],
      };

      service.calculateCost.mockResolvedValue(mockResponse);

      const result = await controller.calculateShippingCost(mockDto);

      expect(result).toEqual(mockResponse);
      expect(service.calculateCost).toHaveBeenCalledWith(mockDto);
      expect(service.calculateCost).toHaveBeenCalledTimes(1);
    });

    it('debería propagar errores del servicio', async () => {
      const mockDto: CostCalculationRequestDto = {
        delivery_address: {
          street: 'Av. Belgrano 5678',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1092AAA',
          country: 'Argentina',
        },
        products: [{ id: 101, quantity: 2 }],
      };

      const error = new Error('Invalid product');
      service.calculateCost.mockRejectedValue(error);

      await expect(controller.calculateShippingCost(mockDto)).rejects.toThrow('Invalid product');
      expect(service.calculateCost).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('GET /shipping/:id - getShippingOrderById', () => {
    it('debería retornar los detalles de un shipment por ID', async () => {
      const mockDetail = {
        shipping_id: 1,
        order_id: 100,
        user_id: 1,
        delivery_Address: {
          street: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1043AAZ',
          country: 'Argentina',
        },
        departure_Address: {
          street: 'Av. Belgrano 5678',
          city: 'Buenos Aires',
          state: 'CABA',
          postal_code: 'C1092AAA',
          country: 'Argentina',
        },
        products: [{ id: 101, productId: 101, quantity: 2 }],
        status: ShippingStatus.PENDING,
        transport_type: { type: TransportMethods.AIR },
        estimated_delivery_at: '2024-01-03',
        tracking_number: 'LOG-AR-123456789',
        carrier_name: 'Andreani',
        total_cost: 1500,
        currency: 'ARS',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        logs: [],
      };

      service.findById.mockResolvedValue(mockDetail);

      const result = await controller.getShippingOrderById(1);

      expect(result).toEqual(mockDetail);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar ShippingIdNotFoundException cuando no existe el shipment', async () => {
      service.findById.mockRejectedValue(
        new ShippingIdNotFoundException('Shipment with id 999 not found'),
      );

      await expect(controller.getShippingOrderById(999)).rejects.toThrow(ShippingIdNotFoundException);
      expect(service.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('GET /shipping - getShippingOrders', () => {
    it('debería retornar una lista paginada de shipments', async () => {
      const paginationDto: PaginationInDto = { page: 1, items_per_page: 20 };
      
      const mockList = {
        shipments: [
          {
            shipping_id: 1,
            order_id: 100,
            user_id: 1,
            products: [{ id: 101, quantity: 2 }],
            status: ShippingStatus.PENDING,
            transport_type: TransportMethods.AIR,
            estimated_delivery_at: '2',
            created_at: '2024-01-01',
          },
        ],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 1,
          items_per_page: 20,
        },
      };

      service.ShippingServicePagination.mockResolvedValue(mockList);

      const result = await controller.getShippingOrders(paginationDto);

      expect(result).toEqual(mockList);
      expect(service.ShippingServicePagination).toHaveBeenCalledWith(1, 20);
      expect(service.ShippingServicePagination).toHaveBeenCalledTimes(1);
    });

    it('debería manejar diferentes páginas correctamente', async () => {
      const paginationDto: PaginationInDto = { page: 2, items_per_page: 10 };
      
      const mockList = {
        shipments: [],
        pagination: {
          current_page: 2,
          total_pages: 3,
          total_items: 25,
          items_per_page: 10,
        },
      };

      service.ShippingServicePagination.mockResolvedValue(mockList);

      const result = await controller.getShippingOrders(paginationDto);

      expect(result.pagination.current_page).toBe(2);
      expect(service.ShippingServicePagination).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('POST /shipping/:id/cancel - cancelShippingOrder', () => {
    it('debería cancelar un shipment exitosamente', async () => {
      const mockResponse = {
        shipping_id: 1,
        status: ShippingStatus.CANCELLED,
        cancelled_at: '2024-01-01T10:00:00.000Z',
      };

      service.cancelShipment.mockResolvedValue(mockResponse);

      const result = await controller.cancelShippingOrder(1);

      expect(result).toEqual(mockResponse);
      expect(service.cancelShipment).toHaveBeenCalledWith(1);
      expect(service.cancelShipment).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar ShippingIdNotFoundException cuando no existe el shipment', async () => {
      service.cancelShipment.mockRejectedValue(
        new ShippingIdNotFoundException('Shipment with id 999 not found'),
      );

      await expect(controller.cancelShippingOrder(999)).rejects.toThrow(ShippingIdNotFoundException);
      expect(service.cancelShipment).toHaveBeenCalledWith(999);
    });
  });

  describe('GET /shipping/transport-methods - getTransportMethods', () => {
    it('debería retornar todos los métodos de transporte', async () => {
      const mockMethods = {
        transportMethods: [
          { name: 'Air Transport', type: TransportMethods.AIR, estimatedDays: '2' },
          { name: 'Road Transport', type: TransportMethods.ROAD, estimatedDays: '5' },
          { name: 'Sea Transport', type: TransportMethods.SEA, estimatedDays: '15' },
        ],
      };

      service.getTransportMethods.mockResolvedValue(mockMethods);

      const result = await controller.getTransportMethods();

      expect(result).toEqual(mockMethods);
      expect(result.transportMethods).toHaveLength(3);
      expect(service.getTransportMethods).toHaveBeenCalledTimes(1);
    });

    it('debería incluir todos los tipos de transporte', async () => {
      const mockMethods = {
        transportMethods: [
          { name: 'Air Transport', type: TransportMethods.AIR, estimatedDays: '2' },
          { name: 'Road Transport', type: TransportMethods.ROAD, estimatedDays: '5' },
          { name: 'Sea Transport', type: TransportMethods.SEA, estimatedDays: '15' },
        ],
      };

      service.getTransportMethods.mockResolvedValue(mockMethods);

      const result = await controller.getTransportMethods();

      const types = result.transportMethods.map(tm => tm.type);
      expect(types).toContain(TransportMethods.AIR);
      expect(types).toContain(TransportMethods.ROAD);
      expect(types).toContain(TransportMethods.SEA);
    });
  });
});
