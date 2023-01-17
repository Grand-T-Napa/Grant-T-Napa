import * as bcrypt from 'bcrypt';
import { common_const } from '../common/app.const';

export const encryptPassword = (password: string) => {
	return bcrypt.hashSync(password, common_const.BCRYPT_HASH_ROUND);
};

export const isPasswordMatch = (password: string, hash: string) => {
	return bcrypt.compareSync(password, hash);
};
