import { dropForeignKeys } from 'src/share/util/db-helper';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const tableName = 'letters';

export class createLetterTable1669712967950 implements MigrationInterface {
	table: Table = new Table({
		name: tableName,
		columns: [
			{
				name: 'id',
				type: 'bigint',
				isPrimary: true,
				isGenerated: true,
				generationStrategy: 'increment',
				isNullable: false,
				unsigned: true,
			},
			{
				name: 'user_id',
				type: 'bigint',
				isNullable: false,
				unsigned: true,
			},
			{
				name: 'full_name',
				type: 'nvarchar',
				isNullable: true,
			},
			{
				name: 'email',
				type: 'varchar',
				isNullable: false,
			},
			{
				name: 'identify',
				type: 'tinyint',
				isNullable: true,
			},
			{
				name: 'is_subscribed',
				type: 'tinyint',
				default: 0,
				isNullable: true,
			},
			{
				name: 'created_at',
				type: 'datetime',
				default: 'now()',
			},
			{
				name: 'updated_at',
				type: 'datetime',
				default: 'now()',
			},
		],
	});

	foreignKeys: TableForeignKey[] = [
		new TableForeignKey({
			columnNames: ['user_id'],
			referencedColumnNames: ['id'],
			referencedTableName: 'users',
			onDelete: 'CASCADE',
		}),
	];

	public async up(queryRunner: QueryRunner): Promise<any> {
		try {
			await queryRunner.createTable(this.table, true);
			await queryRunner.createForeignKeys(tableName, this.foreignKeys);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		}
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		try {
			await dropForeignKeys(tableName, this.foreignKeys, queryRunner);
			await queryRunner.dropTable(tableName, true);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		}
	}
}
