import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
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
      validationError: { target: false },
    });

    if (errors.length > 0) {
      const details = this.flattenValidationErrors(errors);
      throw new this.ExceptionClass(undefined, details);
    }

    return value;
  }

  private flattenValidationErrors(errors: ValidationError[], parentPath = ''): any[] {
    const flatErrors: any[] = [];

    for (const error of errors) {
      const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

      // Si tiene errores de constraints directos
      if (error.constraints) {
        flatErrors.push({
          field: propertyPath,
          constraints: Object.values(error.constraints),
          value: error.value,
        });
      }

      // Si tiene errores anidados (children), procesarlos recursivamente
      if (error.children && error.children.length > 0) {
        const childErrors = this.flattenValidationErrors(error.children, propertyPath);
        flatErrors.push(...childErrors);
      }
    }

    return flatErrors;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}