'use strict';
module.exports = async function(app) {
	var blockchain = require('./controller');
	await blockchain.init(module.exports.env, module.exports.address);

	app.route('/account')
		.get(blockchain.createAccount);

	app.route('/sign')
		.post(blockchain.sign);

	app.route('/sign')
		.get(blockchain.getSignature);

	app.route('/hash')
		.get(blockchain.getDataHash);
}