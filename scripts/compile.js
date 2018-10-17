// 编译合约
const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

const compiledDir = path.resolve(__dirname, '../compiled')
fs.removeSync(compiledDir)
fs.ensureDirSync(compiledDir)

const contractPath = path.resolve(__dirname, '../contracts', 'car.sol');
const contractsSource = fs.readFileSync(contractPath, 'utf8');

const result = solc.compile(contractsSource);

Object.keys(result.contracts).forEach((name) => {
	const contractName = name.replace(/^:/, '')
	// const filePath = path.resolve(__dirname, '../compiled', `${contractName}.json`)
	const filePath = path.resolve(compiledDir, `${contractName}.json`)
	fs.outputJsonSync(filePath, result.contracts[name])
	console.log(`save compiled contract ${contractName} to ${filePath}`);
})
