import { BigNumber } from 'ethers';
import * as moment from 'moment';
import { getConnection, QueryRunner } from 'typeorm';

export const removeDuplicated: (arr: any[]) => any[] = (arr) => [...new Set<any>(arr).keys()];

// Start database transaction.
export const runQuery = async <Result = any>(task: (queryRunner: QueryRunner) => Promise<any>): Promise<Result> => {
	const queryRunner: QueryRunner = getConnection().createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();
	try {
		// Run task
		const result = await task(queryRunner);

		// When task is finished, save all changes to database
		await queryRunner.commitTransaction();

		return result;
	} catch (error) {
		await queryRunner.rollbackTransaction();
		throw error;
	} finally {
		await queryRunner.release();
	}
};

export function BN(value: string | number | BigInt): BigNumber {
	return BigNumber.from(value.toString());
}

// Function helps transform data from query to data can show in chart
export function transformForChart(data: any[], startDate?: Date) {
	const dates = [];
	const counts = [];

	const currentDate = startDate ? moment(startDate) : moment(data[0].date + 'T00:00:00.000Z');
	const endDate = moment(moment().format('YYYY-MM-DD') + 'T00:00:00.000Z');
	const datesLength = endDate.diff(currentDate, 'days');
	const isShowYear = endDate.diff(currentDate, 'years') > 2;

	const itemsPerSample = Math.round(datesLength / 15);
	let tempCounts = [0];
	let currentItemId = 0;
	for (let dateId = 1; currentDate <= endDate; currentDate.add(1, 'days'), ++dateId) {
		const item = data[currentItemId];
		if (item && item.date == currentDate.format('YYYY-MM-DD')) {
			tempCounts.push(Number(item.count));
			++currentItemId;
		}

		if ((datesLength - dateId) % itemsPerSample == 0) {
			dates.push(currentDate.format(isShowYear ? 'DD MMM YYYY' : 'DD MMM'));
			counts.push(tempCounts.reduce((temp1, temp2) => temp1 + temp2));
			tempCounts = [0];
		}
	}

	return {
		counts,
		dates,
	};
}

// Function helps split array to multiple chunk
export function splitArray<T>(arr: T[], size: number): Array<T[]> {
	function* chunks<V>(arr: V[], n: number): Generator<V[], void> {
		for (let i = 0; i < arr.length; i += n) {
			yield arr.slice(i, i + n);
		}
	}

	return [...chunks(arr, size)];
}
