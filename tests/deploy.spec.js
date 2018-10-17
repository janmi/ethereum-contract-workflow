const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// 1. 拿到 bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const { interface, bytecode } = require(contractPath)

// 2. 配置 provider
const web3 = new Web3(ganache.provider())

let accounts;
let contract;

describe('Car contract', () => {
	beforeEach(async () => {
		accounts = await web3.eth.getAccounts()
		console.log('合约部署账户：', accounts[0]);

		contract = await new web3.eth.Contract(JSON.parse(interface))
														 .deploy({ data: bytecode, arguments: ['AUDI']})
														 .send({ from: accounts[0], gas: '1000000'})
		console.log('合约部署成功：', contract.options.address);
	})

	// 编写单元测试
	it('get accounts', () => {
		assert.ok(accounts[0])
	}) 

	it ('contract deploy success', () => {
		assert.ok(contract.options.address)
	}) 
}) 