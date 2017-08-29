<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">

				<!-- Form -->
				<el-button type="success" @click="dialogFormVisible = true,title = '新建相册',form.name='',form.type=1,form.id=''">新建相册</el-button>

				<el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form  :model="form" :rules="rules" ref="form">
				    <el-form-item label="相册名称" prop="name" :label-width="formLabelWidth">
				      <el-input v-model="form.name" auto-complete="off" placeholder="给相册起个名字吧~（最多输入30个字）" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength=30></el-input>
				    </el-form-item>
				    <el-form-item label="相册类型"  :label-width="formLabelWidth" v-model="form.type">
				      <el-button v-for="(item,$index) in items" @click="form.type=item.value " :class="{'active':item.value==form.type,'unactive':!item.value==form.type}">{{item.label}}</el-button>
				    </el-form-item>
				  </el-form>
				  <div slot="footer" class="dialog-footer">
				    <el-button @click="dialogFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="saveAlbum()">确 定</el-button>
				  </div>
				</el-dialog>

        <el-row>
<<<<<<< HEAD
				  <el-col :span="4" v-for="(item,$index) in tables" style='margin:10px;position: relative;' >
=======
				  <el-col :span="4" v-for="(item,$index) in table_data" style='margin:10px;position: relative;' >
>>>>>>> 49dfc7099c7a98a89e6d83944872cad714391079
				  	<div class="" @mouseenter="isShow=$index" @mouseleave="isShow=-1" >
				  		<el-card :body-style="{ padding: '0px' }" >
								<div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow==$index && isShow >1 ">
					    		<el-button type="text" icon="edit" @click="dialogFormVisible = true,title = '编辑相册',form.name = item.name,form.type=item.type,form.id=item.id" class='centerbtn'>编辑</el-button>
					    		<el-button type="text" icon="delete" class='centerbtn' @click="delete_data()">删除</el-button>
					    	</div>
                <router-link :to="{name: 'imagesAdd'}" tag="span">
					      <img :src="item.cover" class="image" >
					      <div style="padding: 14px;">
					        <span>{{item.name}}</span>
					        <div class="bottom clearfix">
					          <el-button type="text" class="button">{{item.photoNum}}</el-button>
					        </div>
					      </div>
                </router-link>
					    </el-card>
				  	</div>
				  </el-col>
				</el-row>
				  <bottom-tool-bar>
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
  </el-row>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import Vue from 'vue'

  export default{
    data(){
       return {
       	 currentDate: new Date(),
        dialogFormVisible: false,
        totalnum:10,
        num:22,
        isShow:-1,
        title:"",
        areaName:"宣威",
        tables:[{
        	show:false
        }],
        tables:[],
        items:[{
          value: '1',
          isActive:false,
          label: '团队建设'
        },{
          value: '2',
          isActive:false,
          label: '个人风采'
        },{
          value: '3',
          isActive:false,
          label: '培训表彰'
        },{
          value: '4',
          isActive:false,
          label: '展业活动'
        },{
          value: '5',
          isActive:false,
          label: '其他'
        }],
        form: {
          name: '',
          type:1,
          id:"",
          areaName:"宣威"
        },
        formLabelWidth: '120px',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 15,
        //请求时的loading效果
        load_data: true,
         on_submit_loading: false,
        rules: {
          name: [
              {required: true, message: '相册名称不能为空', trigger: 'blur'},
              {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
              ]
        }
      };
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
        this.$fetch.api_wisdom.albumList({
          current: this.currentPage,
          pageSize: this.length,
          areaName:this.areaName
        })
          .then(response => {
            this.table_data = response.data.records
	          this.currentPage = response.data.current
	          this.total = response.data.total
	          this.load_data = true
          })
          .catch(() => {
            this.load_data = true
          })
      },
      saveAlbum(){
        this.$refs.form.validate((valid) => {
            if (!valid) return false
          this.$fetch.api_wisdom.saveAlbum(this.form)
            .then(response => {

            })
            .catch(() => {
            });
        })
      },
      reset_form(formName){
        this.$refs.formName.resetFields()
      },
      //单个删除
      delete_data(item){
        this.$confirm('此操作将会删除相册内的所有照片，及针对相册评论，且不可恢复哦～', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index, row) => {
            this.load_data = true;
            try{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.tables.splice(index, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
//          this.$fetch.api_table.del(item)
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
//          this.table_data=[];
            if(this.batch_select){
            	console.log(this.batch_select)
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
      }
    },
    components: {
      panelTitle,
      bottomToolBar
    }
  }
</script>
<style scoped="scoped">
.active {color: #fff;background-color: #20a0ff;border-color: #20a0ff;}
.unactive{background: #fff;border: 1px solid #c4c4c4;color: #1f2d3d;}
 .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 3px 5px;
    float: right;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #000000;
    opacity: 0.6;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .centerbtn{width: 45%;text-align: center;color: #fff;}
</style>
