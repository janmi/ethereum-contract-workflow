const path = require('path');
const Web3 = require('web3');
const fs = require('fs-extra');
const HDWalletProvider = require('truffle-hdwallet-provider');

// 1. 拿到 bytecode
// const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const contractPath = path.resolve(__dirname, '../compiled/ProjectList.json');
const { interface, bytecode } = require(contractPath);

// 2. 配置 provider
const provider = new HDWalletProvider(
	'exact worry once frog husband flavor silent cave alcohol innocent arrow purity',
  'https://rinkeby.infura.io/v3/8d6ae3c5f791485784fa1b9e3d306440');

// 3. 初始化 web3 实例
const web3 = new Web3(provider);

(async () => {
	// 4. 获取钱包里面的账户
	const accounts = await web3.eth.getAccounts()
	console.log('合约部署账户:', accounts[0]);

	// 5. 创建合约实例并且部署
	console.time('合约部署耗时:');
	const result = await new web3.eth.Contract(JSON.parse(interface)) // 合约初始化
															 .deploy({ data: bytecode }) // 交易初始化
															 .send({ from: accounts[0], gas: '2000000' }) // 交易发送
	console.timeEnd('合约部署耗时:');

	const contratAddress = result.options.address;

	console.log('合约部署成功:', contratAddress);
	console.log('合约查看地址:', `https://rinkeby.etherscan.io/address/${contratAddress}`);
	const addressFile = path.resolve(__dirname, '../address.json');
	fs.writeFileSync(addressFile, JSON.stringify(contratAddress));
	console.log('地址写入成功：', addressFile);

	process.exit();

})();