const Web3 = require("web3");
var web3;
const crypto = require('crypto');
const fs = require('fs');

const contractJson = JSON.parse(fs.readFileSync('./build/contracts/NFe.json', 'utf8'));
var contract;
const privateKey = '0x242f54c531a15370cdc8814cf7beabac0766f0bc4380534b497b4bbfb2febaad';
const account = '0x948BEBc23eB2fC86Ee8028983a97D4c951541AcB';

const libJson = JSON.parse(fs.readFileSync('./build/contracts/SignatureResolver.json', 'utf-8'));
var lib;

exports.init = async (provider, addr) => {
	const options = {
	  transactionConfirmationBlocks: 1
	};
	web3 = new Web3(new Web3.providers.HttpProvider(provider), null, options);

	var accountList = await web3.eth.personal.getAccounts();
	await web3.eth.sendTransaction({
		from: accountList[0],
		to: account,
		value: '1000000000000000000'
	});
	// account = accountList[0];

	const defaults = {
		defaultAccount: account,
		defaultGasPrice: '100000000000',
		defaultGas: '4712388',
		gas: 4712388,
  		gasPrice: 100000000000,
		from: account
	}

	web3.eth.net.isListening()
		.then(() => {
			console.log('Connected to ' + provider + ' using account ' + account);
			let r = web3.eth.accounts.wallet.add(privateKey);

			contract = new web3.eth.Contract(contractJson.abi, null, defaults);
			lib = new web3.eth.Contract(libJson.abi, null, defaults);

			try {
				console.log('Deploying signature lib');
				lib.deploy({
					data: libJson.bytecode,
					arguments: [account]
				}).send()
				.on('error', function(error) {
					console.error(error);
					process.exit(1);
				})
				.on('receipt', function(receipt){
					console.log('Library deployed at ' + receipt.contractAddress);
					lib.options.address = receipt.contractAddress;

					console.log('Deploying new contract');
					contract.deploy({
						data: contractJson.bytecode.replace(new RegExp('__SignatureResolver_____________________', 'g'), lib.options.address.substring(2)),
						arguments: [account]
					}).send()
					.on('error', function(error) {
						console.error(error);
						process.exit(1);
					})
					.on('transactionHash', function(tx) {
						console.log('Transaction hash: ' + tx);
					})
					.on('receipt', function(receipt){
						console.log('Contract deployed at ' + receipt.contractAddress);
						contract.options.address = receipt.contractAddress;
						console.log("API ready to rock (and block)");
					});
				});
			}
			catch(e) {
				 console.error(e);
			}
		})
		.catch(function(e) {
			console.log('Unable to connect to ' + provider + ': ' + e);
			process.exit(1);
		});

	

}

exports.createAccount = async (req, res) => {
	var acc = web3.eth.accounts.create();
	var privateKey = acc.privateKey.slice(2);

	const user = crypto.createECDH('secp256k1');
	user.setPrivateKey(privateKey, 'hex');

	const publicKeyHex = user.getPublicKey('hex');
	const privateKeyHex =  user.getPrivateKey('hex');

	let data = {
		'publicKey': publicKeyHex,
		'privateKey': privateKeyHex,
		'account': acc.address
	};

	res.status(201);
	res.json(data);
}

exports.sign = async(req, res) => {
	if(!req.body.data) return res.status(401).json({error: 'Data not provided'});
	let dataHash = web3.utils.sha3(req.body.data);
	let signedObj = await web3.eth.accounts.sign(dataHash, privateKey);
	contract.methods.sign(account, dataHash, signedObj.signature).send()
		.on('receipt', receipt => {
			res.status(201).json({
				transactionHash: receipt.transactionHash
			});
		});
}

exports.getDataHash = async(req, res) => {
	res.status(201).send({
		dataHash: web3.utils.sha3(req.body.data)
	});
}

exports.getSignature = async(req, res) => {
	const signature = await contract.methods.getSignature().call();

	res.status(201).json({
		signature: signature
	});
}