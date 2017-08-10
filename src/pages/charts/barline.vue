<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">
        <charts :options="optionA" style="height: 400px;width: 50%;float: left;margin: -40px 0 40px;"></charts>
        <charts :options="optionC" style="height: 400px;width: 50%;float: right;margin: -40px 0 40px;"></charts>
      </div>
    </div>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">
        <charts :options="optionB" style="height: 400px;width: 50%;margin: 0 auto;" ref="chartsB" ></charts>
      </div>
    </div>
    <!--<el-col :span="12">
      <div class="panel" style="margin-right: 10px">
        <panel-title :title="$route.meta.title"></panel-title>
        <div class="panel-body">
          <charts :options="optionB" style="height: 400px;width: 60%;margin: 0 auto;" ref="chartsB" ></charts>
        </div>
      </div>
    </el-col>-->
    <!--<el-col :span="12">
      <div class="panel" style="margin-left: 10px">
        <panel-title :title="$route.meta.title"></panel-title>
        <div class="panel-body">
          <charts :options="optionC" style="height: 400px"></charts>
        </div>
      </div>
    </el-col>-->
  </el-row>
</template>
<script type="text/javascript">
  import {panelTitle, charts} from 'components'

  export default{
    data(){
      return {
        optionA: null,
        optionC: null,
        optionB: null
        
      }
    },
    created(){
      this.create_all_charts()
    },
    methods: {
      create_all_charts(){
        setTimeout(this.create_chartsA, 500)
        setTimeout(this.create_chartsB, 500)
        setTimeout(this.create_chartsC, 500)
      },
      create_chartsA(){
        		this.optionA = {
											   title : {
											        text: '总体职级分布',
											        x:'center',
											        y:'bottom'
											    },
											    tooltip : {
											        trigger: 'item',
											        formatter: "{a} <br/>{b} : {c} ({d}%)"
											    },
											    
											    series : [
											        {
											            name: '职级分布 ',
											            type: 'pie',
											            radius : '55%',
											            center: ['50%', '60%'],
											            data:[
											                {value:523, name:'试用业务员',itemStyle:{ normal:{color:'#ee8944'} }},
											                {value:453, name:'正式业务员',itemStyle:{ normal:{color:'#9ac77c'} }},
											                {value:315, name:'管理人员',itemStyle:{ normal:{color:'#94bde3'} }}
											               
											            ],
											            itemStyle: {
											                emphasis: {
											                    shadowBlur: 10,
											                    shadowOffsetX: 0,
											                    shadowColor: 'rgba(0, 0, 0, 0.5)'
											                }
											            }
											        }
											    ]
											};
      },
      create_chartsB(){
      	this.optionB = {
         						legend: {
											        data:['入职系数','转正系数','留存系数','晋升系数']
											    },
											    tooltip : {
											        trigger: 'axis'
											    },
											    grid: {
											        left: '3%',
											        right: '4%',
											        bottom: '3%',
											        containLabel: true
											    },
											    xAxis : [
											        {
											            type : 'category',
											            boundaryGap : false,
											            data : ['01-10','01-15','01-20','01-29','02-05','02-12','02-26']
											        }
											    ],
											    yAxis : [
											        {
											            type : 'value'
											        }
											    ],
											    series : [
											        {
											            name:'入职系数',
											            type:'line',
											            stack: '总量',
											            areaStyle: {normal: {}},
											            data:[0.1, 0.5, 0.4, 0.6, 0.9, 1.1, 1.5]
											        },
											        {
											            name:'转正系数',
											            type:'line',
											            stack: '总量',
											            areaStyle: {normal: {}},
											            data:[0.8, 0.6, 0.7, 1.0, 1.1, 1.2, 1.5]
											        },
											        {
											            name:'留存系数',
											            type:'line',
											            stack: '总量',
											            areaStyle: {normal: {}},
											            data:[1.2, 1.0, 1.6, 1.5, 0.6, 0.9, 0.8]
											        },
											        {
											            name:'晋升系数',
											            type:'line',
											            stack: '总量',
											            label: {
											                normal: {
											                    show: true,
											                    position: 'top'
											                }
											            },
											            areaStyle: {normal: {}},
											            data:[0.6, 0.8, 1.0, 1.2, 1, 0.2, 0.8]
											        }
											    ]
        		}
      },
      create_chartsC(){
        this.optionC = {
          title : {
												        text: '管理层职级分布',
												        x:'center',
												        y:'bottom'
												    },
												    tooltip : {
												        trigger: 'item',
												        formatter: "{a} <br/>{b} : {c} ({d}%)"
												    },
												    series : [
												        {
												            name: '职级分布',
												            type: 'pie',
												            radius : '55%',
												            center: ['50%', '60%'],
												            data:[
												                {value:335, name:'业务经理',itemStyle:{ normal:{color:'#b6b6b6'} }},
												                {value:310, name:'高级经理',itemStyle:{ normal:{color:'#ffcc35'} }},
												                {value:234, name:'区域总经理',itemStyle:{ normal:{color:'#578787'} }},
												                {value:234, name:'区域总监',itemStyle:{ normal:{color:'#87a5d9'} }}
												               
												            ],
												            itemStyle: {
												                emphasis: {
												                    shadowBlur: 10,
												                    shadowOffsetX: 0,
												                    shadowColor: 'rgba(0, 0, 0, 0.5)'
												                }
												            }
												        }
												    ]
        }
      },
      //单击chartsB的回调
//    onClickChartsB(params){
//      var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
//      var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
//      const zoomSize = 6
//      this.$refs.chartsB.dispatchAction({
//        type: 'dataZoom',
//        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
//        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
//      })
//    }
    },
    components: {
      panelTitle,
      charts
    }
  }
</script>
