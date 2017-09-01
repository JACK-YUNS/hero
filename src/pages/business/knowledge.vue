<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <!--<router-link :to="{name: 'tableAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">添加数据</el-button>
      </router-link>-->
    </panel-title>
    <div class="panel-body">
    	<el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-form-item>
			    <el-input v-model="formInline.user" placeholder="请输入标题查询"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>
			    <router-link :to="{name: 'knowledgeAdd',params: {id: ''}}" tag="span">
		        <el-button type="success">发布新见识</el-button>
		      </router-link>
			  </el-form-item>
			</el-form>
		</div>

      <el-table
        :data="table_data"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        border
        style="width: 100%;">
        <!--<el-table-column
          type="selection"
          width="55">
        </el-table-column>-->
        <el-table-column
          type="index"
          label="序号"
          width="80"
          >
        </el-table-column>
        <el-table-column
          label="主标题"
          >
           <template scope="props">
           	<router-link :to="{name: 'knowledgeAdd',params: {id: props.row.id}}" tag="span">
			        <span class="link-type">{{props.row.title}}</span>
			      </router-link>
	        </template>
        </el-table-column>
        <el-table-column
        	 prop="assortmentType"
          label="类型"
          :formatter="typeFormat"
          width="100">
        </el-table-column>
        <el-table-column
           prop="aTime"
          :formatter="dateFormat"
          label="时间"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          >
          <template scope="props">
          	<el-button type="primary" size="small" >查看评论</el-button>
            <el-button type="primary" size="small" >编辑</el-button>
            <el-button type="danger" size="small" icon="delete" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>



      <bottom-tool-bar>
        <!--<el-button
          type="danger"
          icon="delete"
          size="small"
          :disabled="batch_select.length === 0"
          @click="on_batch_del"
          slot="handler">
          <span>批量删除</span>
        </el-button>-->
        <div slot="page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size=length
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </bottom-tool-bar>
    </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){

      return {
      	formInline: {
          user: '',
          region: '',
          assortmentType: '',
          template: ''
       },
       on_submit_loading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        formLabelWidth: '120px',
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 15,
        //请求时的loading效果
        load_data: true,
        //批量选择数组
        batch_select: []

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
     filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    methods: {
    	//时间格式化
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
      typeFormat:function(row, column) {
        var aType = row[column.property];
        if (aType == undefined) {
          return "";
        }
        var arr = ['','保险理念 ','励志成长 ','生活锦囊 ','增员攻略'];
        return arr[aType];
      },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        this.load_data = false
        this.$fetch.api_knowledge.topicList({
          current: this.currentPage,
          pageSize: this.length
        })
          .then(response => {
            this.table_data = response.data.records
	          this.currentPage = response.data.current
	          this.total = response.data.total
            console.log(response)
	          this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //提交
	 			 onSubmit() {
	        console.log('1')
	      },
      //单个删除
      delete_data(item){
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((id) => {
            this.load_data = true;
            console.log(item)
            try{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.table_data.splice(index, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
            this.$fetch.api_wechat.delImage(item)
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
 .link-type{color: #007ACC;}
</style>
