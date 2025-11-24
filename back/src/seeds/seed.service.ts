import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { TransportMethods } from '../shared/enums/transport-methods.enum';
import TransportMethodsRepository from '../shipping/repositories/transport_methods.repository';
import AddressRepository from '../shipping/repositories/address.repository';
import ProductRepository from '../shipping/repositories/product.repository';
import UserRepository from '../shipping/repositories/user.repository';
import ShipmentRepository from '../shipping/repositories/shipment.repository';
import ShipmentProductRepository from '../shipping/repositories/shipment_product.repository';
import ShippingLogRepository from '../shipping/repositories/shipping-log.repository';
import { ShippingStatus } from '../shared/enums/shipping-status.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly transportMethodRepository: TransportMethodsRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly shipmentRepository: ShipmentRepository,
    private readonly shipmentProductRepository: ShipmentProductRepository,
    private readonly shippingLogRepository: ShippingLogRepository,
  ) { }

  async onModuleInit() {
    this.logger.log('🌱 Starting database seeding...');
    await this.seedTransportMethods();
    await this.seedAddresses();
    await this.seedProducts();
    await this.seedUsers();
    await this.seedShipments();
    await this.seedShipmentProducts();
    await this.seedShippingLogs();
  }

  private async seedTransportMethods() {
    try {
      // Check if transport methods already exist
      const count = await this.transportMethodRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Transport methods already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding transport methods...');

      // Transport methods data based on the enum
      const transportMethods = [
        {
          name: 'Air Transport',
          type: TransportMethods.AIR,
          estimatedDays: '1-3',
        },
        {
          name: 'Sea Transport',
          type: TransportMethods.SEA,
          estimatedDays: '7-21',
        },
        {
          name: 'Road Transport',
          type: TransportMethods.ROAD,
          estimatedDays: '2-5',
        },
        {
          name: 'Rail Transport',
          type: TransportMethods.RAIL,
          estimatedDays: '3-7',
        },
      ];

      // Insert transport methods
      for (const method of transportMethods) {
        await this.transportMethodRepository.createTransportMethod(method);
        this.logger.log(
          `✅ Inserted: ${method.name} (${method.type}) - ${method.estimatedDays} days`,
        );
      }

      // Verify the data
      const allMethods = await this.transportMethodRepository.getTransportMethods();
      this.logger.log('\n📋 Current transport methods in database:');
      allMethods.forEach((method) => {
        this.logger.log(
          `  - ${method.name} (${method.type}) - ${method.estimatedDays} days`,
        );
      });

      this.logger.log('🎉 Transport methods seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding transport methods:', error.message);
      // Don't throw - let the application continue even if seeding fails
    }
  }

  private async seedAddresses() {
    try {
      const count = await this.addressRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Addresses already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding addresses...');

      // datos de prueba
      const addresses = [
        { street: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', country: 'USA', postal_code: '62704' },
        { street: '4 Privet Drive', city: 'Little Whinging', state: 'Surrey', country: 'UK', postal_code: 'CR300AA' },
        { street: '221B Baker Street', city: 'London', state: 'England', country: 'UK', postal_code: 'NW156XE' },
      ];

      for (const address of addresses) {
        await this.addressRepository.createAddress(address);
        this.logger.log(`✅ Inserted address: ${address.street}, ${address.city}`);
      }

      this.logger.log('🎉 Address seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding addresses:', error.message);
    }
  }

  private async seedProducts() {
    try {
      const contador = await this.productRepository.count();

      if (contador > 0) {
        this.logger.log(`✅ Products already seeded (${contador} records found)`);
        return;
      }

      this.logger.log('📝 Seeding products...');

      // Crear 5 productos de ejemplo con IDs específicos
      const productIds = [1, 2, 3, 4, 5];

      for (const id of productIds) {
        const product = this.productRepository.create(id);
        await this.productRepository.save(product);
        this.logger.log(`✅ Inserted product with ID: ${id}`);
      }

      this.logger.log('🎉 Products seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding products:', error.message);
    }
  }

  private async seedUsers() {
    try {
      const count = await this.userRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Users already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding users...');

      // Crear 5 usuarios de ejemplo con IDs específicos
      const userIds = [1, 2, 3, 4, 5];

      for (const id of userIds) {
        const user = this.userRepository.create(id);
        await this.userRepository.save(user);
        this.logger.log(`✅ Inserted user with ID: ${id}`);
      }

      this.logger.log('🎉 Users seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding users:', error.message);
    }
  }

  private async seedShipments() {
    try {
      const count = await this.shipmentRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Shipments already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding shipments...');

      // Obtener datos necesarios
      const users = await this.userRepository.findAll();
      const addresses = await this.addressRepository.findAll();
      const transportMethods = await this.transportMethodRepository.getTransportMethods();

      // 👇 AGREGÁ ESTOS LOGS PARA DETECTAR EL ERROR
      this.logger.log(`🔍 Debug: Users found: ${users.length}`);
      this.logger.log(`🔍 Debug: Addresses found: ${addresses.length}`);
      this.logger.log(`🔍 Debug: Transports found: ${transportMethods.length}`);
    
      if (users.length < 2 || addresses.length < 2 || transportMethods.length === 0) {
        this.logger.warn('⚠️ Not enough data to seed shipments. Skipping...');
        return;
      }

      // Crear shipments de ejemplo
      const shipments = [
        {
          user: users[0],
          orderId: 1001,
          originAddress: addresses[0],
          destinationAddress: addresses[1],
          transportMethod: transportMethods[0],
          totalCost: 150.50,
          trackingNumber: 'TRACK001',
          carrierName: 'FastShip Inc.'
        },
        {
          user: users[1],
          orderId: 1002,
          originAddress: addresses[1],
          destinationAddress: addresses[2],
          transportMethod: transportMethods[1],
          totalCost: 89.99,
          trackingNumber: 'TRACK002',
          carrierName: 'OceanCargo Ltd.'
        },
        {
          user: users[0],
          orderId: 1003,
          originAddress: addresses[2],
          destinationAddress: addresses[0],
          transportMethod: transportMethods[2],
          totalCost: 45.00,
          trackingNumber: 'TRACK003',
          carrierName: 'RoadExpress'
        },
      ];

      for (const shipmentData of shipments) {
        await this.shipmentRepository.createShipment(
          shipmentData.user,
          shipmentData.orderId,
          shipmentData.originAddress,
          shipmentData.destinationAddress,
          shipmentData.transportMethod,
          shipmentData.totalCost,
          shipmentData.trackingNumber,
          shipmentData.carrierName
        );
        this.logger.log(`✅ Inserted shipment: Order ${shipmentData.orderId} - ${shipmentData.trackingNumber}`);
      }

      this.logger.log('🎉 Shipments seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding shipments:', error.message);
    }
  }

  private async seedShipmentProducts() {
    try {
      const count = await this.shipmentProductRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Shipment Products already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding shipment products...');

      // Obtener todos los envíos y productos
      const [shipments] = await this.shipmentRepository.findAll(1, 100);
      const products = await this.productRepository.findAll();

      this.logger.log(`🔍 Debug: Shipments found: ${shipments.length}`);
      this.logger.log(`🔍 Debug: Products found: ${products.length}`);

      if (shipments.length === 0 || products.length === 0) {
        this.logger.warn('⚠️ Not enough data to seed shipment products. Skipping...');
        return;
      }

      // Crear relaciones entre envíos y productos
      for (let i = 0; i < shipments.length; i++) {
        const shipment = shipments[i];
        // Seleccionar un producto (el primero o uno al azar)
        const product = products[i % products.length];
        const quantity = Math.floor(Math.random() * 5) + 1; // Cantidad entre 1 y 5

        await this.shipmentProductRepository.create(shipment, product, quantity);
        this.logger.log(`✅ Inserted shipment product: Shipment ${shipment.id} - Product ${product.id} - Qty: ${quantity}`);
      }

      this.logger.log('🎉 Shipment Products seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding shipment products:', error.message);
    }
  }

  private async seedShippingLogs() {
    try {
      const count = await this.shippingLogRepository.count();

      if (count > 0) {
        this.logger.log(`✅ Shipping Logs already seeded (${count} records found)`);
        return;
      }

      this.logger.log('📝 Seeding shipping logs...');

      // Obtenemos los envíos para crearles logs
      // Usamos desestructuración [shipments] porque tu findAll devuelve [data, count]
      const [shipments] = await this.shipmentRepository.findAll(1, 100);

      if (shipments.length === 0) {
        this.logger.warn('⚠️ No shipments found to create logs. Skipping...');
        return;
      }

      for (const shipment of shipments) {
        // Creamos el log inicial (CREATED)
        // Tu repositorio MySqlShippingLogRepository.create ya maneja el status y timestamp internamente
        await this.shippingLogRepository.create(shipment);
        
        this.logger.log(`✅ Inserted log for Shipment ID: ${shipment.id}`);
      }

      this.logger.log('🎉 Shipping Logs seed completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding shipping logs:', error.message);
    }
  }
}

