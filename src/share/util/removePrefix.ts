export const removePrefix = (results: any, prefixList: string[]) => {
	return results.map((result: any) =>
		Object.keys(result).reduce((_, key) => {
			const prefix = prefixList.find((prefix) => key.includes(prefix));
			if (prefix) {
				result[prefix.slice(0, -1)] = result[prefix.slice(0, -1)] || {};

				// Insert new key
				const newKey = key.replace(prefix, '');
				result[prefix.slice(0, -1)][newKey] = result[key];

				// Remove old key
				result[key] = undefined;
			}
			return result;
		}, {}),
	);
};
