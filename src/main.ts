import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuditGuard } from './domains/auth/guards/audit.guard';
import { AuditInterceptor } from './common/audit/audit.inteceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
app.useGlobalInterceptors(new AuditInterceptor());
  const config = new DocumentBuilder()
    .setTitle('EL example')
    .setDescription('The EL API description')
    .setVersion('1.0')
    .addTag('EL')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
