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
			    <el-input v-model="formInline.title" placeholder="请输入标题查询"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-select v-model="formInline.assortmentType" placeholder="分类" @change="handleSelect">
			    	<el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>
			    </el-select>
			  </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.isTop" placeholder="首页" @change="handleSelect">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
			  <el-form-item>
			    <el-select v-model="formInline.templateId"  placeholder="模板" @change="handleSelect">
			      <el-option label="全部" value="">全部</el-option>
			      <el-option v-for="item in template_type" :label="item.title" :value="item.id" :key="item.id"></el-option>
			    </el-select>
			  </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.themeId"  placeholder="专题">
            <el-option label="全部" value="">全部</el-option>
            <el-option v-for="item in theme_type" :label="item.title" :value="item.id" :key="item.id"></el-option>
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
          :show-overflow-tooltip=true
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
          :show-overflow-tooltip=true
         >
        </el-table-column>
        <el-table-column
          prop="assortmentType"
          label="分类"
          :formatter="typeFormat"
          width="100">
        </el-table-column>
        <el-table-column
          prop="isTop"
          label="是否首页"
          :formatter="topFormat"
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
          :show-overflow-tooltip=true>
          <template scope="props">
	            <span class="link-type" @click="handleUpdate(props.row)">{{props.row.sort | sortFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="340"
          >
          <template scope="props">
            <el-button type="primary" size="small"   prop="template"  v-if="props.row.templateId" @click="deltemplate(props.row.id)">
	            <span>取消模板</span>
	          </el-button>
	          <el-button type="primary" size="small"  prop="template"  v-else  @click="get_template_type(props.row.id,props.$index)">
	            <span>设置模板</span>
	          </el-button>
            <el-button type="primary" size="small"   prop="theme" v-if="props.row.themeId" @click="deltheme(props.row.id)">
              <span>取消专题</span>
            </el-button>
            <el-button type="primary" size="small"  prop="theme" v-else  @click="get_theme_type(props.row.id,props.$index)">
              <span>设置专题</span>
            </el-button>
            <!--<el-button type="primary" size="small"  prop="theme" :disabled="true" v-else >-->
              <!--<span>设置专题</span>-->
            <!--</el-button>-->
            <router-link :to="{name: 'articleAdd',params: {id: props.row.id}}" tag="span">
              <el-button type="primary" size="small" icon="edit">编辑</el-button>
            </router-link>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="" :visible.sync="dialogTableVisible">
			  <el-table :data="template_type" border>
			    <!--<el-table-column property="index" label="序号" width="150"></el-table-column>-->
			    <el-table-column property="title" label="主标题"></el-table-column>
			    <!--<el-table-column property="type" label="类型"></el-table-column>-->
			    <el-table-column label="操作"  width="200">
			    	<template scope="props">
	            <el-button type="info" size="small" icon="edit"   @click="addTemplate(props.row.id)">设置</el-button>
	          </template>
			    </el-table-column>
			  </el-table>
			</el-dialog>
      <el-dialog title="" :visible.sync="dialogTableVisibletheme">
        <el-table :data="theme_type" border>
          <!--<el-table-column property="index" label="序号" width="150"></el-table-column>-->
          <el-table-column property="title" label="专题标题"></el-table-column>
          <!--<el-table-column property="type" label="类型"></el-table-column>-->
          <el-table-column label="操作"  width="200">
            <template scope="props">
              <el-button type="info" size="small" icon="edit"   @click="addTheme(props.row.id)">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
			<el-dialog title="编辑排序" :visible.sync="dialogFormVisible">
	      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
	        <el-form-item label="排序">
            <el-input-number v-model="sort"  :min="0"  :maxlength=5></el-input-number>
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
          title: '',
          isTop: '',
          assortmentType: '',
          templateId: '',
          themeId:''
       },
        options:[{
        value: '',
        label: '全部'
        }, {
          value: '1',
          label: '资讯'
        }, {
          value: '2',
          label: '保险意识'
        }, {
          value: '3',
          label: '趣闻'
        }, {
          value: '4',
          label: '推荐'
        }, {
          value: '5',
          label: '理财'
        },{
          value: '6',
          label: '生活'
        }, {
          value: '7',
          label: '教育'
        }, {
          value: '8',
          label: '房产'
        }],
       temp:[],
       on_submit_loading: false,
       dialogTableVisible:false,
       dialogFormVisible: false,
       dialogTableVisibletheme : false,
       type:3,
       sort:'',
       currentId:'',
       template_type: [],
        theme_type: [],
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
      var _self = this;
      _self.get_table_data();
      _self.get_template_list();
      _self.get_theme_id();
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
        if (!aType) {
          return "";
        }
        return this.options[aType].label;
      },
      topFormat:function(row, column) {
        var isTop = row[column.property];
        return isTop == 0 ? '是':'否';
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
        var _self = this;
        _self.load_data = true
        _self.$fetch.api_wechat.articleList({
          current: _self.currentPage,
          pageSize: _self.length,
          title:_self.formInline.title,
          assortmentType:_self.formInline.assortmentType,
          templateId:_self.formInline.templateId,
          isTop:_self.formInline.isTop,
          themeId:_self.formInline.themeId
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
        var _self = this;
        _self.dialogTableVisible = true;
        _self.currentId = id;
        _self.get_template_list();
      },
      //获取专题类型
      get_theme_type(id){
        var _self = this;
        _self.dialogTableVisibletheme = true;
        _self.currentId = id;
      },
      get_template_list(){
        this.$fetch.api_wechat.templateList({
          current: 1,
          pageSize: 50,
          type:this.type
        })
          .then(response => {
            this.template_type = response.data.records
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //搜索专题ID
      get_theme_id(){
        this.$fetch.api_theme.queryAll({

        })
          .then(response => {
          var list = response.data;

          $.each(list, function(index, value, array) {
            this.themeId = list[index].id
            console.log(this.themeId)
          });
          this.theme_type = list
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
//                this.$message.success(msg)
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
      handleSelect() {
        this.get_table_data();
      },
      //查询
      onSubmit(){
        this.get_table_data();
      },
      //删除模板
       deltemplate(id) {
          var _self = this;
          var type = _self.type;
           _self.currentId = id;
           _self.templateId=-1;
           _self.load_data = false
           _self.$confirm('请确定是否取消模板?', '提示', {
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
        var _self = this;
        _self.templateId=id;
				var type = this.type;
        _self.dialogTableVisible = false;
        _self.load_data = false
        _self.$fetch.api_wechat.setTemplate({
        	id:_self.currentId,
        	templateId:this.templateId,
          type:_self.type
        })
          .then(response => {
            _self.get_table_data()
          })
          .catch(() => {
            _self.load_data = false
          })
			},
      //设置专题
      addTheme(id){
        var _self = this;
        _self.themeId=id;
        var type = this.type;
        _self.dialogTableVisibletheme = false;
        _self.load_data = false
        _self.$fetch.api_wechat.setTheme({
          id:_self.currentId,
          themeId:this.themeId
        })
          .then(response => {
          _self.get_table_data()
      })
      .catch(() => {
          _self.load_data = false
      })
      },
      //删除专题
      deltheme(id) {
        var _self = this;
        var type = _self.type;
        _self.currentId = id;
        _self.themeId=-1;
        _self.load_data = false
        _self.$confirm('请确定是否取消专题?', '提示', {
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
          console.log('取消失败')
        }
        this.$fetch.api_wechat.setTheme({
          id:this.currentId,
          themeId:this.themeId
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
      	var myDate=new Date('2020-01-01 00:00:00')
         this.table_data.sort = parseInt(this.sort)+myDate.getTime();
         console.log(this.table_data.sort )
      	 this.$fetch.api_wechat.articleSort({
					sort:this.table_data.sort,
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
