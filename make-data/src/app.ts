import express from 'express';
import cors from 'cors';

const fs = require('fs');
const readline = require('readline');

let resources = [
	{
		file: 'issue_tag',
		table_name: 'issue_tags',
		mapping: {
			name: 0,
			icon: 1,
			color: 2,
		},
	},
	{
		file: 'faq',
		table_name: 'faqs',
		mapping: {
			title: 0,
			description: 1,
			index: 2,
		},
	},
	{
		file: 'countries',
		table_name: 'countries',
		mapping: {
			long_name: 0,
			short_name: 1,
			icon_url: 2,
		},
	},
	{
		file: 'licenses',
		table_name: 'licenses',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'languages',
		table_name: 'languages',
		mapping: {
			name: 0,
			img_url: 1,
			color: 2,
		},
	},
	{
		file: 'categories',
		table_name: 'categories',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'themes',
		table_name: 'themes',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'theme_items',
		table_name: 'theme_items',
		mapping: {
			theme_id: 0,
			name: 1,
			icon_url: 2,
			quorum: 3,
			point: 4,
			avatar_url: 5,
		},
	},
	{
		file: 'seeds',
		table_name: 'seeds',
		mapping: {
			name: 0,
			img_url: 1,
		},
	},
	{
		file: 'skills',
		table_name: 'skills',
		mapping: {
			type: 0,
			value: 1,
		},
	},
	{
		file: 'avatars',
		table_name: 'avatars',
		mapping: {
			url: 0,
		},
	},
	{
		file: 'bounty_types',
		table_name: 'bounty_types',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'experience_levels',
		table_name: 'experience_levels',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'bounty_payment_methods',
		table_name: 'bounty_payment_methods',
		mapping: {
			name: 0,
			symbol: 1,
		},
	},
	{
		file: 'bounty_payment_tokens',
		table_name: 'bounty_payment_tokens',
		mapping: {
			bounty_payment_method_id: 0,
			name: 1,
			symbol: 2,
			token_address: 3,
			price: 4,
		},
	},
	{
		file: 'governance_colors',
		table_name: 'governance_colors',
		mapping: {
			hex: 0,
			name: 1,
		},
	},
	{
		file: 'goals',
		table_name: 'goals',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'images',
		table_name: 'images',
		mapping: {
			name: 0,
			url: 1,
		},
	},
	{
		file: 'links',
		table_name: 'links',
		mapping: {
			name: 0,
			icon_url: 1,
			url: 2,
		},
	},
	{
		file: 'working_modes',
		table_name: 'working_modes',
		mapping: {
			name: 0,
		},
	},
	{
		file: 'file_types',
		table_name: 'file_types',
		mapping: {
			value: 0,
			description: 1,
		},
	},
	{
		file: 'documentations',
		table_name: 'documentations',
		mapping: {
			name: 0,
		},
	},
];

let outputRoot = './../src/database/seeds/';
let inputRoot = 'data/';

class App {
	public express;

	constructor() {
		this.express = express();
	}

	public async init() {
		this.express.use(cors());
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));

		this.express.use('/make-json', async (req, res, next) => {
			for (let index = 0; index < resources.length; index += 1) {
				await this.make(resources[index].file, resources[index].table_name, resources[index].mapping);
			}
			res.json('ok');
		});
	}

	//seed data
	public async make(file, table_name, mapping) {
		const stream = fs.createReadStream(inputRoot + file + '.tsv');
		const lines = readline.createInterface({
			input: stream,
			crlfDelay: Infinity,
		});
		// Note: we use the crlfDelay option to recognize all instances of CR LF
		// ('\r\n') in input.txt as a single line break.
		let contents = [];
		for await (const line of lines) {
			let arr = line.split('\t');
			let element = {};
			for (let field in mapping) {
				if (mapping[field] >= 0 && mapping[field] < arr.length) {
					let data = arr[mapping[field]].trim();
					if (data != '') {
						element[field] = data;
					}
				}
			}
			contents.push(element);
		}
		await new Promise((finish, error) => {
			fs.writeFile(outputRoot + table_name + '.json', JSON.stringify(contents, null, 2), (e) => {
				if (e) {
					console.log(e);
					error(e);
				} else {
					finish(true);
				}
			});
		});
	}

	public start(port: number) {
		this.express.listen(port, (err) => {
			if (err) return console.log(err);
			return console.log(`server is listening on ${port}`);
		});
	}
}

export default new App();
