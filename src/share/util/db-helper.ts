import { database_config_mysql } from 'src/config/constant.config';
import { QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

const buildCreateColumnSql = (column: TableColumn): string => {
	// Get column length
	let length = null;
	if (column.length) length = column.length.toString();
	/**
	 * fix https://github.com/typeorm/typeorm/issues/1139
	 */
	if (column.generationStrategy === 'uuid') length = '36';
	switch (column.type) {
		case 'varchar':
		case 'nvarchar':
		case 'national varchar':
			length = '255';
		case 'varbinary':
			length = '255';
	}

	// Generate column type
	let type = column.type;
	// MySQL requires column length for `varchar`, `nvarchar` and `varbinary` data types
	if (length) {
		type += '('.concat(length, ')');
	} else if (column.width) {
		type += '('.concat(column.width.toString(), ')');
	} else if (
		column.precision !== null &&
		column.precision !== undefined &&
		column.scale !== null &&
		column.scale !== undefined
	) {
		type += '('.concat(column.precision.toString(), ',').concat(column.scale.toString(), ')');
	} else if (column.precision !== null && column.precision !== undefined) {
		type += '('.concat(column.precision.toString(), ')');
	}
	if (column.isArray) type += ' array';

	// Build sql command
	let sql = '`'.concat(column.name, '` ').concat(type);
	if (column.asExpression)
		sql += ' AS ('.concat(column.asExpression, ') ').concat(column.generatedType ? column.generatedType : 'VIRTUAL');

	// if you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to that column.
	if (column.zerofill) sql += ' ZEROFILL';
	else if (column.unsigned) sql += ' UNSIGNED';

	if (column.enum)
		sql += ' ('.concat(
			column.enum
				.map(function (value) {
					return "'" + value.replace(/'/g, "''") + "'";
				})
				.join(', '),
			')',
		);
	if (column.charset) sql += ' CHARACTER SET "'.concat(column.charset, '"');
	if (column.collation) sql += ' COLLATE "'.concat(column.collation, '"');
	if (!column.isNullable) sql += ' NOT NULL';
	if (column.isNullable) sql += ' NULL';
	if (column.isPrimary) sql += ' PRIMARY KEY';
	if (column.isGenerated && column.generationStrategy === 'increment') sql += ' AUTO_INCREMENT';
	if (column.comment && column.comment.length > 0) {
		let comment = '';
		if (!column.comment || column.comment.length === 0) {
			comment = "''";
		} else {
			comment = comment
				.replace(/\\/g, '\\\\') // MySQL allows escaping characters via backslashes
				.replace(/'/g, "''")
				.replace(/\u0000/g, ''); // Null bytes aren't allowed in comments
			comment = "'".concat(comment, "'");
		}
		sql += ' COMMENT '.concat(comment);
	}

	if (column.default !== undefined && column.default !== null) sql += ' DEFAULT '.concat(column.default);
	if (column.onUpdate) sql += ' ON UPDATE '.concat(column.onUpdate);

	return sql;
};

export const addColumns = (
	tableName: string,
	tableColumns: TableColumn[],
	beforeColumn: string,
	queryRunner: QueryRunner,
): Promise<any> => {
	return Promise.all(
		tableColumns
			.reverse()
			.map((tableColumn) =>
				queryRunner.query(
					`ALTER TABLE \`${tableName}\` ADD ${buildCreateColumnSql(tableColumn)} AFTER \`${beforeColumn}\``,
				),
			),
	);
};

export const reverseChangeColumns = (
	changeColumns: {
		oldColumn: TableColumn;
		newColumn: TableColumn;
	}[],
): {
	oldColumn: TableColumn;
	newColumn: TableColumn;
}[] => {
	return changeColumns.map((changeColumn) => {
		const oldColumn: TableColumn = changeColumn.oldColumn;
		changeColumn.oldColumn = changeColumn.newColumn;
		changeColumn.newColumn = oldColumn;

		return changeColumn;
	});
};

export const executeNoForeignKeyCheck = async (task: () => Promise<any>, queryRunner: QueryRunner) => {
	await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
	await task();
	await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
};

export const dropForeignKeys = async (tableName: string, foreignKeys: TableForeignKey[], queryRunner: QueryRunner) => {
	const table = await queryRunner.getTable(`${database_config_mysql.DATABASE}.${tableName}`);

	const columnNames = foreignKeys.reduce((result, foreignKey) => {
		result.push(...foreignKey.columnNames);
		return result;
	}, []);

	return Promise.all(
		columnNames.map((columnName) => {
			const tableColumn = new TableColumn({
				name: columnName,
				type: 'bigint',
			});

			return queryRunner.dropForeignKeys(tableName, table.findColumnForeignKeys(tableColumn));
		}),
	);
};
