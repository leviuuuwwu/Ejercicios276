import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  
  getDiscountedPrice(price: number, discount: number): number {
    if (discount < 0 || discount > 100) {
      throw new BadRequestException('El descuento debe estar entre 0% y 100%');
    }
    return price - (price * (discount / 100));
  }

  getIVA(price: number): number {
    const IVA_RATE = 0.13;
    return price * IVA_RATE;
  }

}