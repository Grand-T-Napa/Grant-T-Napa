import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfigMysql } from './config/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommonModule } from './module/common/common.module';
import { DefaultAvatarModule } from './module/default-avatar/default-avatar.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmAsyncConfigMysql),
		EventEmitterModule.forRoot(),
		CommonModule,
		DefaultAvatarModule,
	],
})
export class AppModule {}
