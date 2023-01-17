import * as defaultAvatar from '../../database/seeds/avatars.json';
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedDto } from './dto/seed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { seed_config } from '../../config/constant.config';
import { common_error } from './common.constant';
import { CommonLogger } from '../../share/common/logger/common.logger';
import { DefaultAvatar } from '../default-avatar/entities/avatar.entity';
import { runQuery } from 'src/share/util/helper.util';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedController {
	constructor(
		@InjectRepository(DefaultAvatar)
		private readonly defaultAvatarRepository: Repository<DefaultAvatar>,
	) {}

	@Post('/data-master')
	async insertMasterData(@Body() seedDto: SeedDto) {
		try {
			const { password } = seedDto;
			if (password != seed_config.PASSWORD)
				throw new HttpException(common_error.WRONG_PASSWORD, HttpStatus.BAD_REQUEST);

			const defaultAvatars = await this.handleFormatData({ file: defaultAvatar });
			// prettier-ignore
			await runQuery(async (queryRunner) => {
				return Promise.all([
					this.handleInsertMultiData({ entity: DefaultAvatar, data: defaultAvatars, repo: this.defaultAvatarRepository, queryRunner }),
					]);
			})

			return null;
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_INSERT_MASTER_DATA`, error);
			throw error;
		}
	}

	/** ************************ PRIVATE FUNCTION ********************************** */

	/**
	 * @description This is function handle format data.
	 * @param file
	 * @private
	 */
	private handleFormatData = async ({ file }: { file: any }): Promise<any> => {
		return file.map((item) => {
			item.created_at = new Date();
			item.updated_at = new Date();
			return item;
		});
	};

	/**
	 * @description This is function handle insert multi data to db.
	 * @param entity
	 * @param data
	 * @param repo
	 * @param queryRunner
	 * @private
	 */
	private handleInsertMultiData = async ({
		data,
		repo,
		queryRunner,
	}: {
		entity: any;
		data: any;
		repo: Repository<any>;
		queryRunner?: QueryRunner;
	}): Promise<any> => {
		const result = await repo.find();
		if (result.length > 0) return null;
		return repo.createQueryBuilder(null, queryRunner).insert().values(data).execute();
	};
}
