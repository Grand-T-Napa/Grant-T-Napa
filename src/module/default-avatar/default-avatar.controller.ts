import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/share/guard/jwt.guard';
import { DefaultAvatarService } from './default-avatar.service';

@ApiTags('Default Avatar')
@Controller('default-avatars')
export class DefaultAvatarController {
	constructor(private defaultAvatarService: DefaultAvatarService) {}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('')
	async getAllDefaultAvatar() {
		return await this.defaultAvatarService.getAllDefaultAvatar();
	}
}
