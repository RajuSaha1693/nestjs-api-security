import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  //HTTPS Options
  const httpsOptions = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  //CORS Configuration
  app.enableCors({ origin: true, credentials: true });

  //Cookie Parser Middleware
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  //Middleware Configurations
  app.use(helmet());
  app.use(helmet.hsts({ maxAge: 31536000 }));

  //Validation Pipeline Configurations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
