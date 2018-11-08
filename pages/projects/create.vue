<template>
	<div class="page-container">
		<div class="page-header">创建项目</div>
		<div class="page-content">
			<el-card>
				<el-form label-position="top" label-width="80px" :model="createForm">
					<el-form-item label="项目名称">
						<el-input v-model="createForm.description"></el-input>
					</el-form-item>	
					<el-form-item label="最小募资金额（ETH）">
						<el-input v-model="createForm.minInvest"></el-input>
					</el-form-item>	
					<el-form-item label="最大募资金额（ETH）">
						<el-input v-model="createForm.maxInvest"></el-input>
					</el-form-item>
					<el-form-item label="募资上限（ETH）">
						<el-input v-model="createForm.goal"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="createProject" :loading="createForm.loading">立即创建</el-button>
					</el-form-item>	
					<el-alert v-if="createForm.errmsg" :title="createForm.errmsg" type="error"></el-alert>	
				</el-form>	
			</el-card>	
		</div>
	</div>
</template>
<script>
import web3 from '../../libs/web3'
import Project from '../../libs/project'
import ProjectList from '../../libs/ProjectList'

export default {
  name: 'create',
  data () {
    return {
    	createForm: {
    		description: 'new project',
    		minInvest: 0,
    		maxInvest: 0,
    		goal: 0,
    		loading: false,
    		errmsg: ''
    	}
    }
  },
  async asyncData ({ params }) {
  	return {}
  },
  methods: {
  	setState (values) {
  		this.createForm = Object.assign({}, this.createForm, values || {})
  	},
  	async createProject () {
  		this.setState({errmsg: ''})

  		const { description, minInvest, maxInvest, goal } = this.createForm

  		if (!description) {
  			return this.setState({errmsg: '项目名称不能为空！'})
  		}

  		if (minInvest <= 0 ) {
  			return this.setState('项目最小投资金额必须大于0')
  		}

  		if (maxInvest <= 0) {
  			return this.setState('项目最大投资金额必须大于0')
  		}

  		if (goal <= 0) {
  			return this.setState('募资上线金额必须大于0')
  		}

  		const minInvestWei = web3.utils.toWei(minInvest, 'ether')
			const maxInvestWei = web3.utils.toWei(maxInvest, 'ether')
			const goalWei = web3.utils.toWei(goal, 'ether')

			try {
				this.setState({
					loading: true,
					errmsg: ''
				})
				const accunts = await web3.eth.getAccounts()
				const ower = accunts[0]

				const result = await ProjectList.methods.createProject(description, minInvestWei, maxInvestWei, goalWei)
																				.send({from: ower, gas: '5000000'})

				this.setState({
					errmsg: '创建项目成功'
				})

				setTimeout(() => {
					window.location.href = '/'
				}, 1000)

			} catch (err) {
				this.setState({
					errmsg: err.message || err.toString
				})
			} finally {
				this.setState({
					loading: false
				})
			}
  	}
  }
}
</script>
<style lang="less">
</style>