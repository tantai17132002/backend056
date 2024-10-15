// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_FILTER } from '@nestjs/core';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
// import { HttpExceptionFilter } from './user/try-exception';
// import { User } from './user/user.entity';
// import { JwtStrategy } from './user/jwt.strategy';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // Để sử dụng biến môi trường trong toàn cục
//     }),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'tntt',
//       password: 'T@i17042002',
//       database: 'lab5va6',
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'), // Lấy secret từ biến môi trường
//         signOptions: { expiresIn: '1h' },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [UserController],
//   providers: [
//     UserService,
//     JwtStrategy,
//     {
//       provide: APP_FILTER,
//       useClass: HttpExceptionFilter,
//     },
//   ],
//   exports: [JwtModule],
// })
// export class AppModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
// import { User } from './user/user.entity';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtStrategy } from './user/jwt.strategy';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // Sử dụng biến môi trường toàn cục
//     }),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'tntt',
//       password: 'T@i17042002',
//       database: 'lab5va6',
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule], 
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'), // Lấy secret từ biến môi trường
//         signOptions: { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [UserController],
//   providers: [UserService, JwtStrategy], // Đảm bảo JwtStrategy được thêm vào providers
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { HttpExceptionFilter } from './user/try-exception';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'tntt',
      password: 'T@i17042002',
      database: 'lab5va6',
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([User]),

    // Cấu hình JwtModule với secret và thời gian hết hạn
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'r81lA4aJvxEl8TQD4J6D7pgN2wUEopwigmX92nbNqdY', // Sử dụng biến môi trường hoặc secret mặc định
      signOptions: { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
    }),

    UserModule, // Import UserModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [JwtModule], // Export JwtModule để các module khác có thể tái sử dụng
})
export class AppModule {}



