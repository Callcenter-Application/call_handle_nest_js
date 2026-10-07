import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
// import { TypeOrmModule } from '@nestjs/typeorm'; ===> Tengo que configurar esto bien.
// import { ConfigModule } from '@nestjs/config'; ===> Esta parte tambien es necesaria. 
// import configuration from './config/configuration.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
