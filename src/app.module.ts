import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ResumeModule } from './domains/resume/resume.module';
import { VocabularyModule } from './domains/vocabulary/vocabulary.module';
import { QuizModule } from './domains/EnglishBuilder/quiz/quiz.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'audio'),
      serveRoot: '/audio',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://thaitai:thaitai123@medi.28aks.mongodb.net/yourDB?retryWrites=true&w=majority',
    ),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    SupplierModule,
    MedicineModule,
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
    CategoryModule,
    OrderModule,
    OrderDetailModule,
    PunchModule,
    ResumeModule,
    VocabularyModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
