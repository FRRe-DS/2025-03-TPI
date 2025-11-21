import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { TransportMethods } from '../shared/enums/transport-methods.enum';
import TransportMethodsRepository from '../shipping/repositories/transport_methods.repository';
import AddressRepository from '../shipping/repositories/address.repository';
import ProductRepository from '../shipping/repositories/product.repository';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly transportMethodRepository: TransportMethodsRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository,
  ) { }

  async onModuleInit() {
    this.logger.log('🌱 Starting database seeding...');
    await this.seedTransportMethods();
    await this.seedAddresses();
    await this.seedProducts();
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
}

