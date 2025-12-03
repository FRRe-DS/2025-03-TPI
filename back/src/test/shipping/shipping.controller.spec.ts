import { Test, TestingModule } from '@nestjs/testing';
import { ShippingController } from '../../shipping/shipping.controller';
import { ShippingService } from '../../shipping/services/shipping.service';

describe('ShippingController (unit)', () => {
  let controller: ShippingController;
  const mockService = {
    createShipment: jest.fn().mockResolvedValue({ id: 1 }),
    getTransportMethods: jest.fn().mockResolvedValue({ items: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [{ provide: ShippingService, useValue: mockService }],
    }).compile();

    controller = module.get<ShippingController>(ShippingController);
  });

  it('createShippingOrder llama al servicio', async () => {
    const dto = { user_id: 1, transport_type: 'AIR', products: [] } as any;
    const res = await controller.createShippingOrder(dto);
    expect(mockService.createShipment).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 1 });
  });

  it('getTransportMethods devuelve datos', async () => {
    const res = await controller.getTransportMethods();
    expect(mockService.getTransportMethods).toHaveBeenCalled();
    expect(res).toEqual({ items: [] });
  });
});
