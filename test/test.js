const NFe = artifacts.require('NFe')

contract('Create Document', async accounts => {
	NFe.defaults({
	  from: accounts[0],
	  gas: 4712388,
	  gasPrice: 10000000000
	});
	it('Should sign NFe', async () => {
		let privateKey = '0x242f54c531a15370cdc8814cf7beabac0766f0bc4380534b497b4bbfb2febaad';
		let account = '0x948BEBc23eB2fC86Ee8028983a97D4c951541AcB';

		let instance = await NFe.deployed(account);

		let data = "NFe XML Content";
		let dataHash = web3.utils.sha3(data);
		let signedObj = await web3.eth.accounts.sign(dataHash, privateKey);

		await instance.sign(account, dataHash, signedObj.signature)

		let signature = await instance.getSignature();

		assert.equal(signedObj.signature, signature);
 
	});

});