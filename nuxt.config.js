module.exports = {
	head: {
		title: '众筹 DApp',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{ hid: 'description', name: 'description', content: '基于以太坊智能合约开发的众筹 DApp' },
		]
	},
	css: [{ src: 'element-ui/lib/theme-chalk/index.css' }],
	plugins: [
		{
			src: '~plugins/element-ui',
			ssr: true
		}
	],
	build: {
		extractCSS: true,
		babel: {
			plugins: [
				[
					"component",
					{
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
					}
				]
			]
		},
		// vendor: ['element-ui']
	},
};