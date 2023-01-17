import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { DefaultAvatar } from '../default-avatar/entities/avatar.entity';

@Module({
	imports: [TypeOrmModule.forFeature([DefaultAvatar])],
	controllers: [SeedController],
	providers: [],
	exports: [],
})
export class CommonModule {}
