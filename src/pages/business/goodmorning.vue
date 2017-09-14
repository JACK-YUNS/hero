<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <!--<el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <router-link :to="{name: 'tableAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">添加数据</el-button>
      </router-link>-->
    </panel-title>
    <div class="panel-body">
			<router-link :to="{name: 'meetingAdd'}" tag="span">
        <el-button type="success" icon="plus" size="primary" style="margin-bottom: 20px;">添加早会</el-button>
      </router-link>
      <el-table
        :data="table_data"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        style="width: 100%;">

        <el-table-column type="expand">
		      <template scope="props">
		        <el-form label-position="left" inline class="demo-table-expand">
		        	<el-steps :space="40" direction="vertical">
							  <el-step v-for="item in props.row.flow" :title="item.content" :key="item.id"></el-step>
							</el-steps>
		        </el-form>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="时间"
		      prop="meetingDate">
		    </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          >
          <template scope="props">
          	<router-link :to="{name: 'meetingAdd',params: {meetingDate: props.row.meetingDate},}" tag="span">
            	<el-button type="info" size="small" icon="edit">编辑</el-button>
            </router-link>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import {port_wechat} from 'common/port_uri'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){

      return {
        table_data: [],
        currentId:'',
        currentFlow:[],
        currentDate:'',
        length: 7,
        //请求时的loading效果
        load_data: true
      }
    },
    components: {
      panelTitle,
      bottomToolBar
    },
     computed: {

  },
    created(){
      this.get_table_data()
    },
    methods: {
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        this.load_data = false
        this.$fetch.api_wisdom.earlyMettingList({
          areaName: '宣威'
        })
          .then(response => {
          	var list = response.data.reverse();
          	$.each(list, function(index, value, array) {
						 	list[index].flow = JSON.parse(list[index].flow)
						});

            this.table_data = list;
	          this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },

      //单个删除
      delete_data(item){
      	console.log(item)
      	this.currentId = this.table_data[item].id;
      	this.index = item;
      	console.log(this.index)
      	console.log(this.currentId)
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
                        this.table_data.splice(item, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
                var data = {"id":this.currentId,"flag":-1}
            this.$fetch.api_wisdom.saveEarlyMetting(data)
              .then(({msg}) => {
                this.get_table_data()
                this.$message.success(msg)
              })
              .catch(() => {
              })
          })
          .catch(() => {
          })
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      }
    },
    mounted() {

    }
  }
</script>
<style scoped="scoped">
 .el-select{margin-bottom: 10px;}
 .el-autocomplete{margin-bottom: 10px;}
 .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
