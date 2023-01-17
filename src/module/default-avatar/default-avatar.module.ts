import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwt_config } from 'src/config/constant.config';
import { DefaultAvatarController } from './default-avatar.controller';
import { DefaultAvatarService } from './default-avatar.service';
import { DefaultAvatar } from './entities/avatar.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([DefaultAvatar]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: jwt_config.SECRET,
			signOptions: {
				expiresIn: jwt_config.EXPIRES_IN,
			},
		}),
	],
	controllers: [DefaultAvatarController],
	providers: [DefaultAvatarService],
	exports: [DefaultAvatarService],
})
export class DefaultAvatarModule {}
