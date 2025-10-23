import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ContextValidationPipe implements PipeTransform<any> {
  constructor(private readonly ExceptionClass: any) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = errors.map(error => ({
        field: error.property,
        constraints: Object.values(error.constraints || {}),
        value: error.value,
      }));

      // Lanzar la excepción usando solo el mensaje por defecto y los detalles
      throw new this.ExceptionClass(undefined, details);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}