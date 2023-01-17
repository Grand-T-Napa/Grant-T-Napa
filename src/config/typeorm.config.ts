import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { database_config_mysql } from './constant.config';

const configMysql: any = {
	type: database_config_mysql.TYPE,
	host: database_config_mysql.HOST,
	port: database_config_mysql.PORT,
	username: database_config_mysql.USERNAME,
	database: database_config_mysql.DATABASE,
	password: database_config_mysql.PASSWORD,
	entities: [`${__dirname}/../**/*.entity.{js,ts}`],
	migrations: [`${__dirname}/../database/migrations/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/../database/migrations,`,
	},
	extra: { charset: 'utf8mb4_unicode_ci' },
	synchronize: false,
	logging: database_config_mysql.LOGGING,
};

export const typeOrmAsyncConfigMysql: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (): Promise<TypeOrmModuleOptions> => configMysql,
};

export const typeOrmConfig: TypeOrmModuleOptions = configMysql;
