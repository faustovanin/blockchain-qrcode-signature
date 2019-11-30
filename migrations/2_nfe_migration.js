const NFe = artifacts.require("NFe");
const SignatureResolver = artifacts.require("SignatureResolver.sol");

module.exports = function(deployer) {
	let account = '0x948BEBc23eB2fC86Ee8028983a97D4c951541AcB';
	deployer.deploy(SignatureResolver);
	deployer.link(SignatureResolver, NFe);
	deployer.deploy(NFe, account);
};
