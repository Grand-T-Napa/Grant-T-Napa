import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ILog } from './log.interface';

export class CommonLogger extends Logger {
	private winstonLogger: winston.Logger;

	constructor(context?: string) {
		super(context);
		const winstonTransports = new winston.transports.DailyRotateFile({
			filename: '%DATE%.log',
			dirname: './logs/',
			datePattern: 'YYYY-MM-DD',
			maxSize: '10m',
			maxFiles: '7d',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
		});
		this.winstonLogger = winston.createLogger({
			transports: winstonTransports,
		});
	}

	customError(message: string, trace: string, log: ILog) {
		this.winstonLogger.error(message, log);
		super.error(message, trace);
	}

	log(message: any, context?: string) {
		super.log(message, context);
	}
}
