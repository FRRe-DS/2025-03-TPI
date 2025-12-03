import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ShippingController } from '../../shipping/shipping.controller';
import { ShippingService } from '../../shipping/services/shipping.service';
import { AfterInsert } from 'typeorm';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';



describe('Shipping API (e2e) - mocked', () => {
  let app: INestApplication;
  const mockService = {
    getTransportMethods: jest.fn().mockResolvedValue({
      items: [
        { id: 1, type: 'AIR', name: 'Aéreo', estimated_days: 2 },
        { id: 2, type: 'LAND', name: 'Terrestre', estimated_days: 5 },
      ],
    }),
    createShipment: jest.fn().mockResolvedValue({
      id: 123,
      status: ShippingStatus.CREATED,
      tracking_number: 'LOG-AR-123456789',
    }),
    ShippingServicePagination: jest.fn().mockResolvedValue({
      items: [{ id: 123, status: ShippingStatus.CREATED }],
      total: 1,
      page: 1,
      perPage: 20,
    }),
    findById: jest.fn().mockResolvedValue({
      id: 123,
      status: 'PENDING',
      transport_method: { id: 1, type: 'AIR', estimated_days: 2 },
    }),
    cancelShipment: jest.fn().mockResolvedValue({ id: 123, status: ShippingStatus.CANCELLED }),
    calculateCost: jest.fn().mockResolvedValue({ total: 150 }),
    updateShippingStatus: jest.fn().mockResolvedValue({ id: 123, status: ShippingStatus.DELIVERED }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [{ provide: ShippingService, useValue: mockService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /shipping/transport-methods -> returns transport methods', async () => {
    const res = await request(app.getHttpServer()).get('/shipping/transport-methods').expect(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.items || res.body)).toBe(true);
    expect(mockService.getTransportMethods).toHaveBeenCalled();
  });

  it('POST /shipping -> creates a shipment', async () => {
    const payload = {
      user_id: 1,
      order_id: 1,
      origin_address: { street: 'Av A', city: 'X', state: 'S', postal_code: 'A0000ABC', country: 'AR' },
      destination_address: { street: 'Av B', city: 'Y', state: 'S', postal_code: 'B1111DEF', country: 'AR' },
      transport_type: 'air',
      products: [{id:1,quantity:1}],
      };
    const res = await request(app.getHttpServer()).post('/shipping').send(payload).expect(200);
    expect(res.body.id).toBe(123);
    expect(mockService.createShipment).toHaveBeenCalled();
  });

  it('GET /shipping -> list shipments (pagination)', async () => {
    const res = await request(app.getHttpServer()).get('/shipping').expect(200);
    expect(res.body).toBeDefined();
    expect(mockService.ShippingServicePagination).toHaveBeenCalled();
  });

  it('GET /shipping/:id -> get shipment by id', async () => {
    const res = await request(app.getHttpServer()).get('/shipping/123').expect(200);
    expect(res.body.id).toBe(123);
    expect(mockService.findById).toHaveBeenCalledWith(123);
  });

  it('POST /shipping/:id/cancel -> cancel shipment', async () => {
    const res = await request(app.getHttpServer()).post('/shipping/123/cancel').expect(200);
    expect(res.body.status).toBe(ShippingStatus.CANCELLED);
    expect(mockService.cancelShipment).toHaveBeenCalledWith(123);
  });

  it('POST /shipping/cost -> calculate cost', async () => {
    const payload = {
      user_id: 1,
      transport_type: 'AIR',
      products: [],
      origin_address: { street: 'A', city: 'X', state: 'S', postal_code: '0000', country: 'AR' },
      destination_address: { street: 'B', city: 'Y', state: 'S', postal_code: '1111', country: 'AR' },
    };
    const res = await request(app.getHttpServer()).post('/shipping/cost').send(payload).expect(200);
    expect(res.body.total).toBe(150);
    expect(mockService.calculateCost).toHaveBeenCalled();
  });

  it('PATCH /shipping/:id/status -> update status', async () => {
    const res = await request(app.getHttpServer()).patch('/shipping/123/status').send({ status: ShippingStatus.DELIVERED }).expect(200);
    expect(res.body.status).toBe(ShippingStatus.DELIVERED);
    expect(mockService.updateShippingStatus).toHaveBeenCalledWith(123, ShippingStatus.DELIVERED);
  });
});