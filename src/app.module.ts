import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ROUTES } from './common/constants/routes.constant';
import { AuditModule } from './common/audit/audit.module';
import { JwtAuthGuard } from './domains/auth/guards/jwt-auth.guard';
import { RolesGuard } from './domains/auth/guards/roles.guard';

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
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
    SupplierModule,
    MedicineModule,
    CategoryModule,
    OrderModule,
    OrderDetailModule,
    PunchModule,
    ResumeModule,
    VocabularyModule,
    QuizModule,
    AuditModule,
    RouterModule.register([
      {
        path: ROUTES.ADMINISTRATION.ROOT,
        children: [
          { path: ROUTES.ADMINISTRATION.USER, module: UserModule },
          { path: ROUTES.ADMINISTRATION.AUTH, module: AuthModule },
          { path: ROUTES.ADMINISTRATION.ROLE, module: RoleModule },
          { path: ROUTES.ADMINISTRATION.MENU, module: MenuModule },
        ],
      },
      {
        path: ROUTES.INVENTORY.ROOT,
        children: [
          { path: ROUTES.INVENTORY.SUPPLIER, module: SupplierModule },
          { path: ROUTES.INVENTORY.MEDICINE, module: MedicineModule },
          { path: ROUTES.INVENTORY.CATEGORY, module: CategoryModule },
          { path: ROUTES.INVENTORY.ORDER, module: OrderModule },
          { path: ROUTES.INVENTORY.ORDER_DETAIL, module: OrderDetailModule },
        ],
      },
      {
        path: ROUTES.HR.ROOT,
        children: [{ path: ROUTES.HR.PUNCH, module: PunchModule }],
      },
      {
        path: ROUTES.RESUME.ROOT,
        children: [{ path: ROUTES.RESUME.RESUME, module: ResumeModule }],
      },
      {
        path: ROUTES.EDUCATION.ROOT,
        children: [
          { path: ROUTES.EDUCATION.VOCABULARY, module: VocabularyModule },
          { path: ROUTES.EDUCATION.QUIZ, module: QuizModule },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
