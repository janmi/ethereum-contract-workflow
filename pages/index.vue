<template>
  <div class="page-container">
  	<div class="page-header">项目列表</div>
  	<div class="page-content">
  		<el-row :gutter="24">
  			<el-col :span="12" v-for="project in projects" :key="project.address">
  				<el-card class="project-card">
  					<div class="clearfix" slot="header">
  						<strong>{{project.description}}</strong>
  						<el-button></el-button>
  						<nuxt-link :to="'/projects/' + project.address">查看详情</nuxt-link>
  					</div>
  					<div class="progress-container">
  						<el-progress :text-inside="true" :stroke-width="18" :percentage="project.progress"></el-progress>
  					</div>
  					<el-row :igutter="16" class="info-blocks">
  						<el-col :span="8">
  							<info-block :title="project.goal + ' ETH'" description="募资上线"></info-block>
  						</el-col>
  						<el-col :span="8">
  							<info-block :title="project.minInvest + ' ETH'" description="最小投资金额"></info-block>
  						</el-col>
  						<el-col :span="8">
  							<info-block :title="project.maxInvest + ' ETH'" description="最大投资金额"></info-block>
  						</el-col>
  						<el-col :span="8">
  							<info-block :title="project.investorCount" description="参投人数"></info-block>
  						</el-col>
  						<el-col :span="8">
  							<info-block :title="project.balance + ' ETH'" description="已募资金额"></info-block>
  						</el-col>
  					</el-row>
  				</el-card>
  			</el-col>
  		</el-row>	
  	</div>
		<nuxt-link to="/projects/create">创建项目</nuxt-link>	
		<nuxt-link to="/projects">查看项目详情</nuxt-link>
  </div>
</template>
<script>
import web3 from '../libs/web3'
import Project from '../libs/project'
import ProjectList from '../libs/ProjectList'
import InfoBlock from '../components/InfoBlock'
export default {
	components: { 'info-block': InfoBlock },
	async asyncData () {
		const addressList = await ProjectList.methods.getProject().call()
    let summaryList = []
    const ret = await Project(addressList[0]).methods.getSummary().call()

    summaryList = Object.values(ret)

		// Promise.all(addressList.map( address  => {
		// 	Project(address).methods.getSummary().call()
		// })).then(ret => {
  //     console.log(ret)
  //     summaryList.push(ret)
  //   })
    console.log(summaryList)
    // console.log(addressList)
		const projects = addressList.map((address, i) => {
			const [description, minInvest, maxInvest, goal, balance, investorCount, paymentCount, owner] = Object.values(summaryList[i])
			return {
				address,
				description,
				minInvest: web3.utils.fromWei(minInvest, 'ether'),
				maxInvest: web3.utils.fromWei(maxInvest, 'ether'),
				goal: web3.utils.fromWei(goal, 'ether'),
				balance: web3.utils.fromWei(balance, 'ether'),
				progress: Math.ceil(balance / goal * 100),
				investorCount,
				paymentCount,
				owner
			}
		}).reverse();

		// console.log(projects);
    return { projects };
	}
}
</script>

<style lang="less">
.project-card {
  margin-bottom: 24px;
  height: 388px;
}
.info-block {
  padding: 0.5em 1em;
  border: 1px dotted #aaa;
  height: 80px;
  min-height: 80px;
  margin-bottom: 16px;
  border-radius: 5px;
}
.info-block-title {
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}
.info-block-description {
  margin: 0;
  color: #666;
}
.progress-container {
  margin-bottom: 16px;
}
</style>