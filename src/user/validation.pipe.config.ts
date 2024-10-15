import { ValidationPipe, BadRequestException } from '@nestjs/common';

// Configure options for ValidationPipe
export const validationPipeOptions = new ValidationPipe({
  whitelist: true, // Remove properties not defined in DTO
  forbidNonWhitelisted: true, // Prohibit sending properties not defined in DTO
  transform: true, // Automatically convert data types
  exceptionFactory: (errors) => {
    const result = errors.map((error) => ({
      property: error.property,
      message: error.constraints[Object.keys(error.constraints)[0]],
    }));

    return new BadRequestException(result);
  },
  stopAtFirstError: false, // Continue checking for errors, don't stop after the first error
});
