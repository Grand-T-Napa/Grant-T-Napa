import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';
import uuid from 'uuid';
import { aws_s3 } from '../../config/constant.config';
import { CommonLogger } from '../common/logger/common.logger';

@Injectable()
export class AwsService {
	constructor() {
		aws.config.update({
			region: aws_s3.S3_REGION,
			accessKeyId: aws_s3.S3_KEY,
			secretAccessKey: aws_s3.S3_SECRET,
			signatureVersion: 'v4',
		});
	}

	/**
	 * @description This is function get sign url s3.
	 * @param file_type
	 * @param file_name
	 */
	async getSingleUrlS3({ file_type, file_name }: { file_type: string; file_name: string }): Promise<any> {
		try {
			const s3 = new aws.S3();
			const bucket = aws_s3.S3_BUCKET;
			const fileType = file_type;
			const extension = file_name && file_name.split('.').pop();
			const name = (file_name && file_name.trim().split('.').shift().replace(/\s+/g, '_')) || uuid();
			const fileName = `${name}--${new Date().getTime()}.${extension}`;

			const s3Params = {
				Bucket: bucket,
				Key: fileName,
				Expires: 60000,
				ContentType: fileType,
			};
			const result = await s3.getSignedUrl('putObject', s3Params);

			return {
				signedRequest: result,
				url: `https://${bucket}.s3.amazonaws.com/${fileName}`,
				file_name: fileName || 'No Name',
			};
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_GET_SIGN_S3_SERVICE_`, error);
			throw error;
		}
	}

	/**
	 * @description This is function pre sign s3 url.
	 * @param file_path
	 */
	async preSignS3Url({ file_path }: { file_path: string }): Promise<any> {
		try {
			const s3 = new aws.S3();
			const s3Params = {
				Bucket: aws_s3.S3_BUCKET,
				Key: new URL(file_path).pathname.slice(1),
				Expires: 30,
			};

			return s3.getSignedUrl('getObject', s3Params);
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_PRE_SIGN_SIGN_S3_SERVICE_`, error);
			throw error;
		}
	}
}
