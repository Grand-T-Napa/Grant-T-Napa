import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { common_const } from './share/common/app.const';
import { TransformInterceptor } from './share/intereceptor/transform.interceptor';
import { ValidationPipe } from './share/pipe/validation.pipe';
import { HttpExceptionFilter } from './share/filter/http-exception.filter';
import * as session from 'express-session';
import { session_config } from './config/constant.config';
import { loggerMiddleware } from './share/middleware/logger.middleware';

// AbortController polyfill for Node 14 using in AWS
import { AbortController } from 'node-abort-controller';
global.AbortController = AbortController;

dotenv.config();
const configService = new ConfigService();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: false });

	app.enableCors({
		origin: [`${configService.get<number>('ORIGIN_URL')}`, `${configService.get<number>('ORIGIN_URL_LOCAL')}`],
		credentials: true,
	});

	const config = new DocumentBuilder()
		.setTitle('Backend API Swagger')
		.setDescription('This is a detail specification of API Swagger')
		.setVersion('1.0')
		.addBearerAuth({ in: 'header', type: 'http' })
		.addServer('http://localhost:8000/api/v1')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-swagger', app, document);

	app.setGlobalPrefix(common_const.API_PREFIX);
	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.use(cookieParser());
	app.use(loggerMiddleware);
	app.use(
		session({
			secret: session_config.SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: { secure: false },
		}),
	);

	await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
