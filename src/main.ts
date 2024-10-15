import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { validationPipeOptions } from './user/validation.pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());

  // Using ValidationPipe with exceptionFactory to handle errors
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      transform: true,
      stopAtFirstError: false,
    }),
  );

  //Use ValidationPipe global
  app.useGlobalPipes(validationPipeOptions);
  // Add prefix for API
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
bootstrap();
