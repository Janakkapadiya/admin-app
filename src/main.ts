import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');
  const host = configService.get<string>('SERVER_HOST');
  const options = new DocumentBuilder()
    .setTitle('Admin-app')
    .setDescription('Admin application')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  // Start the server
  await app
    .listen(port)
    .then(() => {
      Logger.log(`Server is run and available at ${host}:${port}`);
      Logger.log(`Documentation is available at ${host}:${port}/doc`);
    })
    .catch(() => Logger.error("Something went wrong. Server can't be start."));
}
bootstrap();
