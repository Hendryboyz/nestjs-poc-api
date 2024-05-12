import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { INestApplication, Logger, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

const logger = new Logger('main')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (process.env.ENABLE_OPENAPI === 'true' || process.env.NODE_ENV !== 'production') {
    enableOpenAPI(app);
  }

  const port = config.get<number>('port');

  await app.listen(port, () => {
    logger.log(`This server starts to listen on port ${port}`)
  });
}

function enableOpenAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Backend practice API')
    .setDescription('A practice to implement restful API best practice')
    .addServer(process.env.OPENAPI_BASENAME || '/')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}

bootstrap()

