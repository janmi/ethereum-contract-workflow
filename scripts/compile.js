// 编译合约
const fs = require('fs-extra');
const path = require('path');
const solc = require('solc'); // 编译合约库
// 1. cleanup
const compiledDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

// 2. search all contracts
const contractFiles = fs.readdirSync(path.resolve(__dirname, '../contracts'));
console.log(contractFiles)
contractFiles.forEach(contractFile => {
	console.log('===================')
	const contractPath = path.resolve(__dirname, '../contracts/', contractFile);
	const contractsSource = fs.readFileSync(contractPath, 'utf8');
	const result = solc.compile(contractsSource);
	console.log(`file compiled: ${contractFile}`);

	if (Array.isArray(result.errors) && result.errors.length) {
		throw new Error(result.errors[0]);
	}

	Object.keys(result.contracts).forEach(name => {
		const contractName = name.replace(/^:/, '');
		const filePath = path.resolve(compiledDir, `${contractName}.json`);
		fs.outputJsonSync(filePath, result.contracts[name]);
		console.log(`save compiled contract ${contractName} to ${filePath}`);
	})

})



