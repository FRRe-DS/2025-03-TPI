import { Test, TestingModule } from '@nestjs/testing';
import { CostCalculatorService, ProductWithDetails } from './cost-calculation-service';

describe('CostCalculatorService', () => {
  let service: CostCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostCalculatorService],
    }).compile();

    service = module.get<CostCalculatorService>(CostCalculatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockProduct = (overrides?: Partial<ProductWithDetails>): ProductWithDetails => ({
    id: 1,
    quantity: 1,
    weight: 5,
    length: 30,
    width: 20,
    height: 10,
    warehouse_postal_code: 'C1000AAA',
    ...overrides,
  });

  describe('Definición del servicio', () => {
    it('debería estar definido', () => {
      expect(service).toBeDefined();
    });
  });

  describe('calculateCost - Estructura de respuesta', () => {
    it('debería retornar todos los campos requeridos', () => {
      const products = [createMockProduct()];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('total_cost');
      expect(result).toHaveProperty('transport_type');
      expect(result).toHaveProperty('products');
      expect(Array.isArray(result.products)).toBe(true);
    });

    it('debería retornar moneda ARS', () => {
      const products = [createMockProduct()];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.currency).toBe('ARS');
    });

    it('debería retornar costos como números positivos', () => {
      const products = [createMockProduct()];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
      expect(typeof result.total_cost).toBe('number');
    });

    it('debería retornar un producto por cada producto enviado', () => {
      const products = [
        createMockProduct({ id: 1 }),
        createMockProduct({ id: 2 }),
        createMockProduct({ id: 3 }),
      ];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.products).toHaveLength(3);
      expect(result.products[0].id).toBe(1);
      expect(result.products[1].id).toBe(2);
      expect(result.products[2].id).toBe(3);
    });
  });

  describe('calculateCost - Cálculos por zona', () => {
    it('debería calcular costo para envío LOCAL (misma región AMBA)', () => {
      const products = [createMockProduct({ warehouse_postal_code: 'C1000AAA' })];
      const destinationPostalCode = 'B1636DSR';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
      expect(result.products[0]).toHaveProperty('id');
      expect(result.products[0]).toHaveProperty('cost');
    });

    it('debería calcular costo para envío REGIONAL (misma región NEA)', () => {
      const products = [createMockProduct({ warehouse_postal_code: 'H3500ABC' })];
      const destinationPostalCode = 'W3400LQU';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
    });

    it('debería calcular costo para envío NACIONAL (diferentes regiones)', () => {
      const products = [createMockProduct({ warehouse_postal_code: 'C1000AAA' })];
      const destinationPostalCode = 'U9000XAP';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
    });

    it('envío NACIONAL debería ser más caro que REGIONAL', () => {
      const product = createMockProduct({ warehouse_postal_code: 'C1000AAA' });
      
      const regionalCost = service.calculateCost([product], 'B1636DSR');
      const nationalCost = service.calculateCost([{ ...product }], 'U9000XAP');

      expect(nationalCost.total_cost).toBeGreaterThan(regionalCost.total_cost);
    });
  });

  describe('calculateCost - Peso volumétrico vs peso real', () => {
    it('debería usar peso volumétrico cuando es mayor que peso real', () => {
      const lightButBulky = createMockProduct({
        weight: 1,
        length: 100,
        width: 100,
        height: 100,
      });
      const products = [lightButBulky];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
    });

    it('debería usar peso real cuando es mayor que peso volumétrico', () => {
      const heavyButSmall = createMockProduct({
        weight: 50,
        length: 10,
        width: 10,
        height: 10,
      });
      const products = [heavyButSmall];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
    });

    it('producto pesado y voluminoso debería costar más que liviano y pequeño', () => {
      const small = createMockProduct({ weight: 1, length: 10, width: 10, height: 10 });
      const large = createMockProduct({ weight: 50, length: 100, width: 100, height: 100 });

      const smallCost = service.calculateCost([small], 'H3500ABC');
      const largeCost = service.calculateCost([large], 'H3500ABC');

      expect(largeCost.total_cost).toBeGreaterThan(smallCost.total_cost);
    });
  });

  describe('calculateCost - Múltiples productos', () => {
    it('debería calcular correctamente con múltiples productos', () => {
      const products = [
        createMockProduct({ id: 1, weight: 5 }),
        createMockProduct({ id: 2, weight: 10 }),
        createMockProduct({ id: 3, weight: 15 }),
      ];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.products).toHaveLength(3);
      expect(result.total_cost).toBeGreaterThan(0);
      
      const sumOfProducts = result.products.reduce((sum, p) => sum + p.cost, 0);
      expect(sumOfProducts).toBeCloseTo(result.total_cost, 2);
    });

    it('debería prorratear costos entre productos según peso', () => {
      const products = [
        createMockProduct({ id: 1, weight: 10 }),
        createMockProduct({ id: 2, weight: 20 }),
      ];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.products[1].cost).toBeGreaterThan(result.products[0].cost);
    });

    it('debería manejar productos de diferentes almacenes', () => {
      const products = [
        createMockProduct({ id: 1, warehouse_postal_code: 'C1000AAA' }),
        createMockProduct({ id: 2, warehouse_postal_code: 'H3500ABC' }),
        createMockProduct({ id: 3, warehouse_postal_code: 'U9000XAP' }),
      ];
      const destinationPostalCode = 'B1636DSR';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.products).toHaveLength(3);
      expect(result.total_cost).toBeGreaterThan(0);
    });
  });

  describe('calculateCost - Cantidades', () => {
    it('debería calcular correctamente con múltiples unidades del mismo producto', () => {
      const singleUnit = createMockProduct({ quantity: 1, weight: 5 });
      const multipleUnits = createMockProduct({ quantity: 3, weight: 5 });

      const singleCost = service.calculateCost([singleUnit], 'H3500ABC');
      const multipleCost = service.calculateCost([multipleUnits], 'H3500ABC');

      expect(multipleCost.total_cost).toBeGreaterThan(singleCost.total_cost);
    });

    it('debería calcular correctamente peso total con cantidades', () => {
      const products = [
        createMockProduct({ id: 1, quantity: 2, weight: 5 }),
        createMockProduct({ id: 2, quantity: 3, weight: 10 }),
      ];
      const destinationPostalCode = 'H3500ABC';

      const result = service.calculateCost(products, destinationPostalCode);

      expect(result.total_cost).toBeGreaterThan(0);
      expect(result.products).toHaveLength(2);
    });
  });
});
