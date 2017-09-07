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
			    <el-input v-model="formInline.title" @change="onSubmit" placeholder="请输入标题查询"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <!--<el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>-->
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
          show-overflow-tooltip="true"
          >
           <template scope="props">
			        <span class="link-type">{{props.row.title}}</span>
	        </template>
        </el-table-column>
        <el-table-column
        	 prop="type"
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
            <router-link :to="{name: 'knowledgeAdd',params: {id: props.row.id}}" tag="span">
              <el-button type="primary" size="small" >编辑</el-button>
            </router-link>
            <el-button type="danger" size="small" @click="delete_data(props.row.id)" icon="delete" >删除</el-button>
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
          current:1,
          pageSize:15,
          title: '',
          type: ''
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
        var arr = ['','案例分享 ','话题讨论 ','名家访谈 '];
        return arr[aType];
      },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
          var _self = this;
        _self.load_data = true;
        _self.$fetch.api_knowledge.topicList(_self.formInline)
          .then(response => {
            _self.table_data = response.data.records
            _self.currentPage = response.data.current
            _self.total = response.data.total
            _self.load_data = false
          })
          .catch(() => {
            _self.load_data = false
          })
      },
      //提交
	 			 onSubmit() {
	        var _self = this;
	        _self.get_table_data();
	      },
      //单个删除
      delete_data(id){
          var _self = this;
        this.$confirm('此操作将删除文章及其被赞与评论记录，且不可恢复 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            _self.load_date = true;
            var entity = {id:id,flag:-1};
            _self.$fetch.api_knowledge.saveTopic(entity)
              .then(response =>{
                try{
                  _self.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  _self.load_data = false;
                  _self.get_table_data();
                }catch(err){
                  _self.$message({
                    type: 'error',
                    message: err.message
                  });
                }
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
