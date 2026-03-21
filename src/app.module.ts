import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierModule } from './domains/shopping-cart/supplier/supplier.module';
import { MedicineModule } from './domains/medidines/medidines.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { MenuModule } from './core/menu/menu.module';
import { CategoryModule } from './domains/shopping-cart/category/category.module';
import { PunchModule } from './domains/shopping-cart/punch/punch.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ResumeModule } from './domains/resume-maker/resume/resume.module';
import { VocabularyModule } from './domains/english-builder/vocabulary/vocabulary.module';
import { QuizModule } from './domains/english-builder/quiz/quiz.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ROUTES } from './common/constants/routes.constant';
import { AuditModule } from './common/audit/audit.module';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { RolesGuard } from './core/auth/guards/roles.guard';
import { RoleModule } from './core/role/role.module';
import { OrderDetailModule } from './domains/shopping-cart/order-detail/order_detail.module';
import { OrderModule } from './domains/shopping-cart/order/order.module';
import { CollaborativeModule } from './domains/coballative-text/coballative-module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'audio'),
      serveRoot: '/audio',
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
      'mongodb://admin:123456@localhost:27017/yourDB?authSource=admin',
    ),

    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    CollaborativeModule,
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
        path: ROUTES.COLLABORATIVE.ROOT,
        module: CollaborativeModule,
      },
      {
        path: ROUTES.ADMINISTRATION.ROOT,
        children: [
          { path: ROUTES.ADMINISTRATION.USER, module: UserModule },
          { path: ROUTES.ADMINISTRATION.AUTH.ROOT, module: AuthModule },
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
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule { }
