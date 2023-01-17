import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonLogger } from 'src/share/common/logger/common.logger';
import { Repository } from 'typeorm';
import { DefaultAvatar } from './entities/avatar.entity';

@Injectable()
export class DefaultAvatarService {
	constructor(
		@InjectRepository(DefaultAvatar)
		private readonly defaultAvatarRepository: Repository<DefaultAvatar>,
	) {}

	/**
	 * @description find all avatar
	 */
	public async getAllDefaultAvatar(): Promise<DefaultAvatar[]> {
		try {
			return await this.defaultAvatarRepository.find();
		} catch (error) {
			CommonLogger.log(`${ new Date().toDateString() }_ERRORS_FIND_ALL_CATEGORIES`, error);
			throw error;
		}
	}
}
