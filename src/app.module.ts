import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './domains/cat/cat.module';
import { SupplierModule } from './domains/supplier/supplier.module';
import { MedicineModule } from './domains/medidines/medidines.module';
import { UserModule } from './domains/user/user.module';
import { AuthModule } from './domains/auth/auth.module';
import { RoleModule } from './domains/role/role.module';
import { MenuModule } from './domains/menu/menu.module';
import { CategoryModule } from './domains/category/category.module';
import { OrderModule } from './domains/order/order.module';
import { OrderDetailModule } from './domains/order_detail/order_detail.module';
import { PunchModule } from './domains/user copy/punch.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://thaitai:thaitai123@medi.28aks.mongodb.net/yourDB?retryWrites=true&w=majority'
    ),
      DevtoolsModule.register({
        http: process.env.NODE_ENV !== 'production',
      }),
    CatsModule,
    SupplierModule,
    MedicineModule,
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
    CategoryModule,
    OrderModule,
    OrderDetailModule,
    PunchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
