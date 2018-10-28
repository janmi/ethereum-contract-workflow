import Web3 from 'web3';

let web3;

// 浏览器环境而已经安装了 Metamask

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	web3 = new Web3(window.web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/8d6ae3c5f791485784fa1b9e3d306440'))
}

export default web3;