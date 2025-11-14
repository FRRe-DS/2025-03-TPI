import { Test, TestingModule } from '@nestjs/testing';
import { ShippingService } from './shipping.service';
import ShipmentRepository from '../repositories/shipment.repository';
import GetShipmentsRepository from '../repositories/get-shipments.repository';
import AddressRepository from '../repositories/address.repository';
import TransportMethodsRepository from '../repositories/transport_methods.repository';
import { ShippingIdNotFoundException } from '../../common/exceptions/shipping-id-notfound.exception';
import { ShippingIdNonCancellableException } from '../../common/exceptions/shipping-id-noncancellable.exception';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { Product } from '../entities/product.entity';
import { ShipmentProduct } from '../entities/shipment-product.entity';
import { TransportMethod } from '../entities/transport-method.entity';
import { ShippingLog } from '../entities/shipping-log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CostCalculatorService } from './cost-calculation-service';

describe('ShippingService', () => {
  let service: ShippingService;
  let shipmentRepository: jest.Mocked<ShipmentRepository>;
  let getShipmentsRepository: jest.Mocked<GetShipmentsRepository>;
  let transportMethodsRepository: jest.Mocked<TransportMethodsRepository>;
  let userRepository: jest.Mocked<Repository<User>>;
  let addressRepository: jest.Mocked<Repository<Address>>;
  let productRepository: jest.Mocked<Repository<Product>>;
  let shipmentProductRepository: jest.Mocked<Repository<ShipmentProduct>>;
  let transportMethodRepository: jest.Mocked<Repository<TransportMethod>>;
  let costCalculatorService: jest.Mocked<CostCalculatorService>;
  let shippingLogRepository: jest.Mocked<Repository<ShippingLog>>;

  // Mock de datos de prueba
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockAddress = {
    id: 1,
    street: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: 'C1043AAZ',
    country: 'Argentina',
  };

  const mockTransportMethod = {
    id: 1,
    name: 'Air Transport',
    type: TransportMethods.AIR,
    estimatedDays: '2',
    shipments: [],
  };

  const mockProduct = {
    id: 101,
    name: 'Product 1',
    weight: 5,
    price: 100,
    shipmentProducts: [],
  };

  const mockShipment = {
    id: 1,
    orderId: 100,
    user: mockUser,
    originAddress: mockAddress,
    destinationAddress: { ...mockAddress, id: 2 },
    status: ShippingStatus.PENDING,
    transportMethod: mockTransportMethod,
    trackingNumber: null,
    carrierName: null,
    totalCost: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
    shipmentProducts: [
      {
        id: 1,
        shipment: null as any,
        product: mockProduct,
        quantity: 2,
      },
    ],
    logs: [],
  } as any;

  beforeEach(async () => {
    // Crear mocks de los repositorios
    const mockShipmentRepository = {
      createShipment: jest.fn(),
      findShipmentById: jest.fn(),
    };

    const mockGetShipmentsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const mockTransportMethodsRepository = {
      getTransportMethods: jest.fn(),
      count: jest.fn(),
      createTransportMethod: jest.fn(),
    };

    const mockAddressRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockProductRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockShipmentProductRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockTransportMethodRepository = {
      findOne: jest.fn(),
    };

    const mockCostCalculatorService = {
      calculateCost: jest.fn(),
    };

    const mockShippingLogRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingService,
        {
          provide: ShipmentRepository,
          useValue: mockShipmentRepository,
        },
        {
          provide: GetShipmentsRepository,
          useValue: mockGetShipmentsRepository,
        },
        {
          provide: TransportMethodsRepository,
          useValue: mockTransportMethodsRepository,
        },
        {
          provide: AddressRepository,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ShipmentProduct),
          useValue: mockShipmentProductRepository,
        },
        {
          provide: getRepositoryToken(TransportMethod),
          useValue: mockTransportMethodRepository,
        },
        {
          provide: CostCalculatorService,
          useValue: mockCostCalculatorService,
        },
        {
          provide: getRepositoryToken(ShippingLog),
          useValue: mockShippingLogRepository,
        },
      ],
    }).compile();

    service = module.get<ShippingService>(ShippingService);
    shipmentRepository = module.get(ShipmentRepository);
    getShipmentsRepository = module.get(GetShipmentsRepository);
    transportMethodsRepository = module.get(TransportMethodsRepository);
    addressRepository = module.get(getRepositoryToken(Address));
    userRepository = module.get(getRepositoryToken(User));
    productRepository = module.get(getRepositoryToken(Product));
    shipmentProductRepository = module.get(getRepositoryToken(ShipmentProduct));
    transportMethodRepository = module.get(getRepositoryToken(TransportMethod));
    costCalculatorService = module.get(CostCalculatorService);
    shippingLogRepository = module.get(getRepositoryToken(ShippingLog));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Definición del servicio', () => {
    it('debería estar definido', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findById', () => {
    it('debería retornar un shipment cuando existe', async () => {
      // Arrange
      getShipmentsRepository.findById.mockResolvedValue(mockShipment);

      // Act
      const result = await service.findById(1);

      // Assert
      expect(result).toBeDefined();
      expect(result.shipping_id).toBe(1);
      expect(getShipmentsRepository.findById).toHaveBeenCalledWith(1);
      expect(getShipmentsRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar ShippingIdNotFoundException cuando el shipment no existe', async () => {
      // Arrange
      getShipmentsRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(999)).rejects.toThrow(
        ShippingIdNotFoundException,
      );
      expect(getShipmentsRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('cancelShipment', () => {
    it('debería lanzar un error porque el método no está implementado', async () => {
      // Arrange
      const pendingShipment = { ...mockShipment, status: ShippingStatus.PENDING };
      shipmentRepository.findShipmentById.mockResolvedValue(pendingShipment);

      // Act & Assert
      await expect(service.cancelShipment(1)).rejects.toThrow(
        'Method not implemented',
      );
    });

    it('debería lanzar NotFoundException cuando el shipment no existe', async () => {
      // Arrange
      shipmentRepository.findShipmentById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cancelShipment(999)).rejects.toThrow(
        'Shipment with id 999 not found',
      );
    });
  });

  describe('ShippingServicePagination', () => {
    it('debería retornar una lista paginada de shipments', async () => {
      // Arrange
      const mockShipments = [mockShipment];
      const total = 1;
      getShipmentsRepository.findAll.mockResolvedValue([mockShipments, total]);

      // Act
      const result = await service.ShippingServicePagination(1, 20);

      // Assert
      expect(result).toEqual({
        shipments: expect.arrayContaining([
          expect.objectContaining({
            shipping_id: 1,
            status: ShippingStatus.PENDING,
          }),
        ]),
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 1,
          items_per_page: 20,
        },
      });
      expect(getShipmentsRepository.findAll).toHaveBeenCalledWith(1, 20);
    });

    it('debería calcular correctamente las páginas totales', async () => {
      // Arrange
      const mockShipments = Array(25).fill(mockShipment);
      const total = 25;
      getShipmentsRepository.findAll.mockResolvedValue([mockShipments, total]);

      // Act
      const result = await service.ShippingServicePagination(1, 10);

      // Assert
      expect(result.pagination.total_pages).toBe(3); // 25 items / 10 per page = 3 pages
      expect(result.pagination.total_items).toBe(25);
    });
  });

  describe('getTransportMethods', () => {
    it('debería retornar todos los métodos de transporte', async () => {
      // Arrange
      const mockTransportMethods = [
        mockTransportMethod,
        { ...mockTransportMethod, id: 2, type: TransportMethods.ROAD, name: 'Road Transport' },
        { ...mockTransportMethod, id: 3, type: TransportMethods.SEA, name: 'Sea Transport' },
      ];
      transportMethodsRepository.getTransportMethods.mockResolvedValue(mockTransportMethods);

      // Act
      const result = await service.getTransportMethods();

      // Assert
      expect(result).toBeDefined();
      expect(result.transportMethods).toHaveLength(3);
      expect(result.transportMethods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: TransportMethods.AIR,
          }),
          expect.objectContaining({
            type: TransportMethods.ROAD,
          }),
          expect.objectContaining({
            type: TransportMethods.SEA,
          }),
        ]),
      );
      expect(transportMethodsRepository.getTransportMethods).toHaveBeenCalledTimes(1);
    });

    it('debería retornar un array vacío si no hay métodos de transporte', async () => {
      // Arrange
      transportMethodsRepository.getTransportMethods.mockResolvedValue([]);

      // Act
      const result = await service.getTransportMethods();

      // Assert
      expect(result.transportMethods).toEqual([]);
      expect(transportMethodsRepository.getTransportMethods).toHaveBeenCalledTimes(1);
    });
  });
});