<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">
				
				<!-- Form -->
				<el-button type="success" @click="dialogFormVisible = true">新建相册</el-button>
				
				<el-dialog title="新建相册" :visible.sync="dialogFormVisible">
				  <el-form :model="form">
				    <el-form-item label="相册名称" :label-width="formLabelWidth">
				      <el-input v-model="form.name" auto-complete="off" placeholder="给相册起个名字吧~（最多输入30个字）" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength=30></el-input>
				    </el-form-item>
				    <el-form-item label="相册类型" :label-width="formLabelWidth" v-model="form.region">
				      
				      <el-button v-for="(item,$index) in items" @click="selectStyle (item, $index) " :class="{'active':item.active,'unactive':!item.active}">{{item.label}}</el-button>
              <!--<el-button>个人风采</el-button>
              <el-button>培训表彰</el-button>
              <el-button>展业活动</el-button>
              <el-button>其他</el-button>-->
				     
				    </el-form-item>
				  </el-form>
				  <div slot="footer" class="dialog-footer">
				    <el-button @click="dialogFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
				  </div>
				</el-dialog>
				
        <el-row>
				  <el-col :span="3" v-for="(item,$index) in tables" style='margin:10px;position: relative;' >
				  	<div class="" @mouseenter="isShow=$index" @mouseleave="isShow=-1" >
				  		 <router-link :to="{name: 'imagesAdd'}" tag="span">
				  		<el-card :body-style="{ padding: '0px' }" >
					    	
					    	<el-dialog title="编辑相册" :visible.sync="dialogFormVisiblecard">
								  <el-form :model="formcard">
								    <el-form-item label="相册名称" :label-width="formLabelWidth">
								      <el-input v-model="formcard.name" auto-complete="off" placeholder="看电视的弗兰克" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength=30></el-input>
								    </el-form-item>
								    <el-form-item label="相册类型" :label-width="formLabelWidth" v-model="formcard.region">
								      
								      <el-button v-for="(item,$index) in items" @click="selectStyle (item, $index) " :class="{'active':item.active,'unactive':!item.active}">{{item.label}}</el-button>
				              <!--<el-button>个人风采</el-button>
				              <el-button>培训表彰</el-button>
				              <el-button>展业活动</el-button>
				              <el-button>其他</el-button>-->
								     
								    </el-form-item>
								  </el-form>
								  <div slot="footer" class="dialog-footer">
								    <el-button @click="dialogFormVisiblecard = false">取 消</el-button>
								    <el-button type="primary" @click="dialogFormVisiblecard = false">确 定</el-button>
								  </div>
								</el-dialog>
								<div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow== $index">
					    		<el-button type="text" icon="edit" @click="dialogFormVisiblecard = true" class='centerbtn'>编辑</el-button>
					    		<el-button type="text" icon="delete" class='centerbtn' @click="delete_data()">删除</el-button>
					    	</div>
					      <img src="../../../src/assets/images/16893554.jpg" class="image" >
					      <div style="padding: 14px;">
					        <span>好吃的汉堡{{ item.currentDate }}</span>
					        <div class="bottom clearfix">
					          <el-button type="text" class="button">{{num}}</el-button>
					        </div>
					      </div>
					    </el-card>
					     </router-link>
				  	</div>
					    
				  
				  </el-col>
				</el-row>
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
        dialogFormVisiblecard: false,
        totalnum:10,
        num:22,
        isShow:-1,
        tables:[{
        	show:false
        }],
        tables:[{
        	currentDate:'1'
        },{
        	currentDate:'2'
        },{
        	currentDate:'3'
        },{
        	currentDate:'4'
        }],
        items:[{
          value: '选项1',
          isActive:false,
          label: '团队建设'
        },{
          value: '选项2',
          isActive:false,
          label: '个人风采'
        },{
          value: '选项3',
          isActive:false,
          label: '培训表彰'
        },{
          value: '选项4',
          isActive:false,
          label: '展业活动'
        },{
          value: '选项5',
          isActive:false,
          label: '其他'
        }],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formcard: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
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
        load_data: true
      };
    },
    created(){
      this.get_table_data()
    },
    methods: {
      selectStyle (item, index) {
　　　　　　this.$nextTick(function () {
　　　　　　　　this.items.forEach(function (item) {
　　　　　　　　　　Vue.set(item,'active',false);
　　　　　　　　});
　　　　　　　　Vue.set(item,'active',true);
　　　　　　});
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