import app from './app';

(async () => {
	try {
		await app.init();
		app.start(4000);
	} catch (error) {
		console.log('LISTEN ERROR:', error);
	}
})();
