<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="18">
          <el-form>
            <el-form-item  >
            	<p>选择早会日期</p>
            	<el-button v-for="(item,index) in form" :key="item.id"  @click="detail(index)" :class='{active:index==isA}'>{{item.meetingDate}} </el-button>
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
              <el-form-item v-for="(item,index) in currentFlow" :key="item.id" :label="(index+1).toString()">

	              <el-input v-model="item.content" style="width: 300px;"  v-if="index < (currentFlow.length-1)" :maxlength=14></el-input>
	              <el-input v-model="item.content" style="width: 300px;"  v-if="index == (currentFlow.length-1)" :maxlength=14></el-input>
	              <el-button type="danger" size="primary" @click="delItem(index)" v-if="index < (currentFlow.length-1)">删除</el-button>
	              <el-button type="danger" size="primary" @click="delItem(index)" v-if="index == (currentFlow.length-1)">删除</el-button>
	              <el-form-item v-if="index == (currentFlow.length-1)" style="position: absolute;bottom: 4px;left: 390px;">
							   <el-button type="success" icon="plus" size="primary" @click="addItem">添加流程节点</el-button>
							  </el-form-item>
	            </el-form-item>
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
        days:[],//日期
        form:[],
        currentId:'',
        currentFlow:[],
        currentDate:'',
        load_data: false,
        on_submit_loading: false,
         isA: '0'
      }
    },
    created(){
      var _self = this;
      _self.get_form_data();

    },
    methods: {
      add_date(day){
        var date1 = new Date(),
          time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+day);
        var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
      },
      //获取数据
      get_form_data(){
        var _self = this;
        _self.load_data = true
        _self.$fetch.api_wisdom.earlyMettingList({
          add:'add'
        })
          .then(response => {
          	var list = response.data;
          	$.each(list, function(index, value, array) {
						 	list[index].flow = JSON.parse(list[index].flow)

              if(list[index].meetingDate == _self.$route.params.meetingDate ){
                _self.currentFlow = list[index].flow;
                _self.currentId=list[index].id;
                _self.currentDate=list[index].meetingDate;
                _self.isA = index;
              }
						});
            if(!_self.$route.params.meetingDate){
              _self.currentFlow = list[0].flow;
              _self.currentId=list[0].id;
              _self.currentDate=list[0].meetingDate;
            }
            if(_self.currentFlow.length == 0){
              _self.addItem();
            }
            _self.form = list;
            _self.load_data = false
          })
          .catch(() => {
            _self.load_data = false
          })
      },
      addItem(){
          var _self = this;
          _self.currentFlow.push([{content:'',index:-1}]);
      },
      delItem(item){
      	 //单个删除
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index) => {
            this.load_data = true;
            try{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.currentFlow.splice(item, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
          })
          .catch(() => {
          })
      },
      detail(index){
        var _self = this;
        _self.currentFlow = _self.form[index].flow;
      	if(_self.currentFlow.length == 0){
          _self.addItem()
        }
        _self.currentId = _self.form[index].id;
        _self.currentDate = _self.form[index].meetingDate;
        _self.isA = index;
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
						}else{
						    index = ""+index;
            }
						var flowItem = {index:index,content:value.content};
						if(value.content=='' || value.content==null || value.content == undefined){
							return ;
						}else{
							flow.push(flowItem);
						}

				});

				var params = {id:this.currentId,meetingDate:this.currentDate,flow:JSON.stringify(flow)};
				this.$fetch.api_wisdom.saveEarlyMetting(params)
            .then(({msg}) => {
              this.$message.success(msg)
              setTimeout(this.$router.back(), 500)
            })
            .catch(() => {
              this.on_submit_loading = false
            })
      }
    },
    components: {
      panelTitle
    }
  }
</script>
<style scoped="scoped">
	.rull{font-size: 12px;color: #ccc;margin-left: 5px;}
	.active {color: #fff;background-color: #20a0ff;border-color: #20a0ff;}
	.unactive{background: #fff;border: 1px solid #c4c4c4;color: #1f2d3d;}
</style>
