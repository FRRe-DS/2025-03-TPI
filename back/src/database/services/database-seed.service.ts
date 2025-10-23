import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import TransportMethodsRepository from '../../shipping/repositories/transport_methods.repository';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    private readonly transportMethodRepository: TransportMethodsRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Starting database seeding...');
    await this.seedTransportMethods();
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
}

