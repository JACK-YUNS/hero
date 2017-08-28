<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="18">
          <el-form ref="form" >
            <el-form-item  >
            	<p>选择早会日期</p>
            	<el-button v-for="(item,index) in form" :data-index="index.toString()"   @click="detail">{{item.meetingDate}} </el-button>
              <!--<el-button type="primary" :disabled="true">7月31日</el-button>
              <el-button type="primary" :disabled="true">8月1日</el-button>
              <el-button type="primary">8月2日</el-button>
              <el-button>8月3日</el-button>
              <el-button>8月4日</el-button>
              <el-button>8月5日</el-button>
              <el-button>8月6日</el-button>-->
            </el-form-item>
           <el-form-item>
            	<p>添加流程<span class="rull">每个环节名称不超过14个汉字</span></p>
              <el-form-item v-for="(item,index) in currentFlow"  :label="(parseInt(index.toString())+1)">
              	
	              <el-input v-model="item.content" style="width: 300px;"  v-if="index < (currentFlow.length-1)"></el-input>
	              <el-input v-model="item.content" style="width: 300px;"  v-if="index == (currentFlow.length-1)"></el-input>
	              <el-button type="success" size="primary" @click="addItem">删除</el-button>
	              <el-form-item v-if="index == (currentFlow.length-1)" style="position: absolute;bottom: 4px;left: 350px;">
							   <el-button type="success" icon="plus" size="primary" @click="addItem">添加流程节点</el-button>
							  </el-form-item>
	            </el-form-item>
	          
	          
	            <!--<el-form :inline="true"  class="demo-form-inline">
							  <el-form-item :label="currentFlow.length">
							    <el-input v-model="currentFlow[currentFlow.length-1].content" placeholder="" style="width: 300px;" ></el-input>
							  </el-form-item>
							  <el-form-item>
							   <el-button type="success" icon="plus" size="primary">添加流程节点</el-button>
							  </el-form-item>
							</el-form>-->
	          </el-form-item>
	           
            <el-form-item>
              <el-button type="primary" @click="on_submit_form" :loading="on_submit_loading">立即提交</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle} from 'components'

  export default{
    data(){
      return {
        form:[],
        currentFlow:[],
        currentDate:'',
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false
      }
    },
    created(){
      this.get_form_data()
    },
    methods: {
      //获取数据
      get_form_data(){
        this.load_data = true
        this.$fetch.api_wisdom.earlyMettingList({
          areaName: '宣威'
        })
          .then(response => {
          	var list = response.data.reverse();

          	$.each(list, function(index, value, array) {
						 	list[index].flow = JSON.parse(list[index].flow)
						});
          	
          	this.currentFlow = list[0].flow;

            this.form = list;

	          this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      addItem(){
      	this.currentFlow.push([{content:'',index:-1}]);
      },
      detail(e){
      	var index = $(e.target).attr('data-index');
      	this.currentFlow = this.form[index].flow;
      },
      //时间选择改变时
      on_change_birthday(val){
        this.$set(this.form, 'birthday', val)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(value) {
        console.log(value);
      },
      //提交
      on_submit_form(){
      	var currentDate = this.currentDate;
      	var flow = [];
				console.log(this.currentFlow.length)
      	$.each(this.currentFlow, function(index, value, array){
 						console.log(value.content)
//	    		flow[index].index = index;
//	    		flow[index].content = value.content;
						index += 1;
						if(parseInt(index) < 10){
							index = "0"+index;
						}
						var flowItem = {index:index,content:value.content};
						flow.push(flowItem);
				});
				
				var params = {meetingDate:currentDate,flow:JSON.stringify(flow)};
//      this.$refs.form.validate((valid) => {
//        if (!valid) return false
//        this.on_submit_loading = true
//        this.$fetch.api_wisdom.saveEarlyMetting(this.form)
//          .then(({msg}) => {
//            this.$message.success(msg)
//            setTimeout(this.$router.back(), 500)
//          })
//          .catch(() => {
//            this.on_submit_loading = false
//          })
//      })
      }
    },
    components: {
      panelTitle
    }
  }
</script>
<style scoped="scoped">
	.rull{font-size: 12px;color: #ccc;margin-left: 5px;}
</style>