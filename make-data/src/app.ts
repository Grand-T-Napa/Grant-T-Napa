import express from 'express';
import cors from 'cors';

const fs = require('fs');
const readline = require('readline');

let resources = [
	{
		file: 'avatars',
		table_name: 'avatars',
		mapping: {
			url: 0,
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
