import { ProductsService } from './products.service';
import { BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  describe('getDiscountedPrice', () => {
    it('debería calcular correctamente el precio con un 20% de descuento', () => {
      const result = service.getDiscountedPrice(100, 20);
      expect(result).toBe(80);
    });

    it('debería lanzar un error si el descuento es mayor al 100%', () => {
      expect(() => service.getDiscountedPrice(100, 150)).toThrow(BadRequestException);
    });

    it('debería lanzar un error si el descuento es negativo', () => {
      expect(() => service.getDiscountedPrice(100, -10)).toThrow(BadRequestException);
    });
  });

  describe('getIVA', () => {
    it('debería calcular correctamente el IVA del 13%', () => {
      const result = service.getIVA(100);
      expect(result).toBe(13);
    });
  });
});