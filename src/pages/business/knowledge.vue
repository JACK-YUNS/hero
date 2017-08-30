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
        @selection-change="on_batch_select"
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
          prop="subtitle"
          label="副标题"
         >
        </el-table-column>
        <el-table-column
        	 prop="assortmentType"
          label="分类"
          :formatter="typeFormat"
          width="100">
        </el-table-column>
        <el-table-column
          aTime="aTime"
          :formatter="sortFormat"
          label="排序"
          width="120"
          sortable>
          <template scope="props">
	            <span class="link-type" @click="handleUpdate(props.row)">{{props.row.sort | sortFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
           prop="aTime"
          :formatter="dateFormat"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          >
          <template scope="props">
          	<el-button type="primary" size="small" >查看评论</el-button>
            <el-button type="primary" size="small" >编辑</el-button>
            <el-button type="danger" size="small" icon="delete" @click="delete_data('id'+'='+props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
       <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
	      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
	        <el-form-item label="排序">
	          <el-input ></el-input>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取 消</el-button>
	        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
	        <el-button v-else type="primary" @click="update">确 定</el-button>
	      </div>
	    </el-dialog>
				
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
        dialogPvVisible: false,
       
      	temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          subtitle:'',
          type: '',
          status: 'published'
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
      },
      sortFormat:function(sort) {
        
        var myDate=new Date('2020-01-01 00:00:00')
        if (sort < myDate.getTime()) {
          return 0;
        }
        else if(sort == null){
        	return 0;
        }
        else{
        	 return sort - myDate.getTime();
        }
       
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
    	sortFormat:function(row, column,cellValue) {
        var aSort = row[column.property];
        var aTime = row['aTime'];
        var myDate=new Date('2020-01-01 00:00:00')
        if (aSort == aTime) {
          return 0;
        }
        else if(aSort == null){
        	return 0;
        }
        else{
        	 return aSort - myDate.getTime();
        }
       
     },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        this.load_data = false
        this.$fetch.api_wechat.imageTextList({
          current: this.currentPage,
          pageSize: this.length
        })
          .then(response => {	
            this.table_data = response.data.records
            console.log(this.table_data)
	          this.currentPage = response.data.current
	          this.total = response.data.total
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
      },
      //批量选择
      on_batch_select(val){
        this.batch_select = val
      },
      //批量删除
      on_batch_del(){
        this.$confirm('此操作将批量删除选择数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index) => {
            this.load_data = true
            this.table_data=[];
            if(this.batch_select){
//          	console.log(this.batch_select)
            	this.load_data = false;
            	this.table_data.splice(index, this.batch_select.length);
            }
//          this.$fetch.api_table.batch_del(this.batch_select)
//            .then(({msg}) => {
//              this.get_table_data()
//              this.$message.success(msg)
//            })
//            .catch(() => {
//            })
          })
          .catch(() => {
          })
      },
			//删除模板
       deltemplate() {
         this.$confirm('请确定是否取消模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
			//设置模板
			addtemplate(){
				
			},
       handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      create() {
        this.temp.id = parseInt(Math.random() * 100) + 1024;
        this.temp.timestamp = +new Date();
        this.temp.author = '原创作者';
        this.list.unshift(this.temp);
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      },
      update() {
        this.temp.timestamp = +this.temp.timestamp;
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v);
            this.list.splice(index, 1, this.temp);
            break;
          }
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
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