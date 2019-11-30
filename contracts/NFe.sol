pragma solidity ^0.5.0;

import "./SignatureResolver.sol";

contract NFe {
	bytes32 data;
	bytes signature;
	address signer;

	bytes constant ETH_PREFIX = "\x19Ethereum Signed Message:\n32";

	using SignatureResolver for bytes32;
	event NFeSigned(bytes32 data, bytes signature, address indexed signer);

	modifier onlySigner(address a) {
		require(a == signer, "Address is not an authorized signer");
		_;
	}

	constructor(address a) public {
		signer = a;
	}

	function sign(address a, bytes32 d, bytes memory s) 
		public
		onlySigner(a)
	{
		bytes32 dd = keccak256(abi.encodePacked(ETH_PREFIX, d));
		require(dd.recover(s) == signer, "Message signer different from authorized signer");

		data = d;
		signature = s;

		emit NFeSigned(data, signature, signer);
	}

	function getSigner() public view returns(address) {
		return signer;
	}

	function getData() public view returns(bytes32) {
		return data;
	}

	function getSignature() public view returns(bytes memory) {
		return signature;
	}
}