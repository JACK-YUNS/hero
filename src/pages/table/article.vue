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
    	<el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-form-item>
			    <el-input v-model="formInline.user" placeholder="请输入标题查询"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-select v-model="formInline.assortmentType" placeholder="分类">
			    	<el-option label="资讯 - 理财" value="quanbu">资讯 - 理财</el-option>
			      <el-option label="资讯 - 生活" value="baoxianlinian">资讯 - 生活</el-option>
			      <el-option label="资讯 - 教育" value="lizhichengzhang">资讯 - 教育</el-option>
			      <el-option label="资讯 - 房产" value="shenghuojinnang">资讯 - 房产</el-option>
			      <el-option label="保险意识" value="shenghuojinnang">保险意识</el-option>
			      <el-option label="趣闻" value="shenghuojinnang">趣闻</el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item>
			    <el-select v-model="formInline.template" placeholder="模板">
			      <el-option label="全部" value="quanbu">全部</el-option>
			      <el-option label="是" value="shi">是</el-option>
			      <el-option label="否" value="fou">否</el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>
			    <router-link :to="{name: 'articleAdd',params: {id: ''}}" tag="span">
		        <el-button type="success">新建</el-button>
		      </router-link>
			  </el-form-item>
			</el-form>
    	
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
          width="80">
        </el-table-column>
        <el-table-column
          label="主标题"
          >
          <template scope="props">
           	<router-link :to="{name: 'articleAdd',params: {id: props.row.id}}" tag="span">
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
          prop="aTime"
          :formatter="dateFormat"
          label="创建时间"
          width="120">
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
          label="操作"
          width="200"
          >
          <template scope="props">
            <el-button type="info" size="small" icon="edit"  prop="template" v-if="props.row.templateId == 1" @click="deltemplate(props.row.id,props.$index)">
	            <span>取消模板</span>
	          </el-button>
	          <el-button type="info" size="small" icon="edit"  prop="template" v-else  @click="get_template_type(props.row.id,props.$index)">
	            <span>设置模板</span>
	          </el-button>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="" :visible.sync="dialogTableVisible">
			  <el-table :data="template_type" border>
			    <!--<el-table-column property="index" label="序号" width="150"></el-table-column>-->
			    <el-table-column property="title" label="主标题" width="200"></el-table-column>
			    <el-table-column property="type" label="类型"></el-table-column>
			    <el-table-column label="操作">
			    	<template scope="props">
	            <el-button type="info" size="small" icon="edit"  :data-id="props.row.id" @click="addTemplate(props.$index)">设置</el-button>
	          </template>
			    </el-table-column>
			  </el-table>
			</el-dialog>
			<el-dialog title="编辑排序" :visible.sync="dialogFormVisible">
	      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
	        <el-form-item label="排序">
	          <el-input v-model="sort" @change="inputsort"></el-input>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取 消</el-button>
	        <el-button type="primary" @click="create(temp.id)">确 定</el-button>
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
  import {port_wechat} from 'common/port_uri'
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
       temp:[],
       on_submit_loading: false,
       dialogTableVisible:false,
       dialogFormVisible: false,
       type:3,
       sort:'',
       currentId:'',
       template_type: [],
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 15,
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
    filters: {
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
        var arr = ['','咨询 - 理财 ','咨询 - 生活 ','咨询 - 教育 ','咨询 - 房产','保险意识','趣味'];
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
        this.$fetch.api_wechat.articleList({
          current: this.currentPage,
          pageSize: this.length
        })
          .then(response => {
          	var list = response.data.records;
            $.each(list, function(index, value, array) {
//						 console.log(list[index].id)
						});				
						this.table_data =list
	          this.currentPage = response.data.current
	          this.total = response.data.total
	          this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //获取模板类型
      get_template_type(id){
      	this.dialogTableVisible = true;
      	this.currentId = id;
          console.log(this.currentId)     
        this.$fetch.api_wechat.templateList({
					current: this.currentPage,
          pageSize: this.length,
          type:this.type
        })
          .then(response => {	
            this.template_type = response.data.records
          })
          .catch(() => {
            this.load_data = false
          })
      },
  
      //单个删除
      delete_data(item){
      	this.currentId = this.table_data[item].id;
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((id) => {
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
            this.$fetch.api_wechat.delArticle(data)
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
      //查询
      onSubmit(){
      	
      },
      //删除模板
       deltemplate(id) {
       	var type = this.type;
       	this.currentId = id;
       	this.templateId=-1;
       	this.load_data = false
         this.$confirm('请确定是否取消模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
         .then(() => {
         	try{
                        this.$message({
                            type: 'success',
                            message: '取消成功'
                        });
                        
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: '已取消'
                    });
                    console.log('删除失败')
                }
             this.$fetch.api_wechat.setTemplate({
			        	id:this.currentId,
			        	templateId:this.templateId,
			          type:this.type
			        })
			          .then(response => {	
			           this.get_table_data()
			          })
			          .catch(() => {
			            this.load_data = false
			          })
			          })
			          .catch(() => {
			          })
      },
			//设置模板
			addTemplate(id){
				this.templateId=1;
				var type = this.type;
				this.dialogTableVisible = false;
				this.load_data = false
        this.$fetch.api_wechat.setTemplate({
        	id:this.currentId,
        	templateId:this.templateId,
          type:this.type
        })
          .then(response => {	
           this.get_table_data()
          })
          .catch(() => {
            this.load_data = false
          })
			},
			//跟换排序里面的值
			inputsort(){
				
			},
			
       handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        var sort = this.temp.sort;
        var myDate=new Date('2020-01-01 00:00:00')
        var sortnum = sort - myDate.getTime()
        console.log(sortnum)
        this.sort =sortnum;
        if (sort < myDate.getTime()) {
          return 0;
        }
        else if(sort == null){
        	return 0;
        }
        else{
        	 return sort - myDate.getTime();
        }
        
      },
      create() {
      	this.dialogFormVisible = false
      	console.log(this.temp.id)
      	 this.$fetch.api_wechat.saveArticle({
					sort:this.sort,
					id:this.temp.id
        })
          .then(response => {	
            this.get_table_data()
          })
          .catch(() => {
            this.load_data = false
          })
      	
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