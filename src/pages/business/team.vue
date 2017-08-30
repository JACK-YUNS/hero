<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">

				<!-- Form -->
				<el-button type="success" @click="newAblum(),indexNum = -1">新建相册</el-button>

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
				  <el-col :span="4" v-for="(item,$index) in table_data" style='margin:10px;position: relative;width: 200px;height: 300px;' >
				  	<div class="" style="height: 100%;width: 100%;" @mouseenter="isShow=$index" @mouseleave="isShow=-1" >
				  		<el-card :body-style="{ padding: '0px' ,height:'73%' }" style="height: 100%;width: 100%;" >
								<div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow==$index && isShow >1 ">
					    		<el-button type="text" icon="edit" @click="editAlbum(item),indexNum =$index" class='centerbtn'>编辑</el-button>
					    		<el-button type="text" icon="delete" class='centerbtn' @click="delete_data(item.id)">删除</el-button>
					    	</div>
                <router-link :to="{name: 'imagesAdd',params:{albumId:item.id}}" tag="span">
					      <img :src="item.cover" class="image" style="height: 100%;width: 100%;" >
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
        dialogFormVisible: false,
        totalnum:10,
        isShow:-1,
        title:"",
        indexNum:-1,
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
          isSys:1,
          photoNum:0,
          cover:'https://resources.kangxun360.com/nophoto.png',
          height:"",
          width:""
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
              {required: true, message: '相册名称不能为空', trigger: 'change'},
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
      newAblum(){
        this.dialogFormVisible = true;
        this.title = "新建相册";
        this.form.name="";
        this.form.photoNum = 0;
        this.form.type = 1;
        this.form.isSys = 1;
        this.form.id = "";
        this.form.width = 570;
        this.form.height = 570;
        this.form.cover = "https://resources.kangxun360.com/nophoto.png";
      },
      editAlbum(item){
          this.dialogFormVisible = true;
          this.title = "编辑相册";
          this.form.name=item.name;
          this.form.photoNum = item.photoNum;
          this.form.type = item.type;
          this.form.isSys = item.isSys;
          this.form.id = item.id;
          this.form.cover = item.cover;
      },
      saveAlbum(){
        this.$refs.form.validate((valid) => {
            if (!valid) return false;
          this.$fetch.api_wisdom.saveAlbum(this.form)
            .then(response => {
              this.dialogFormVisible = false;
              if(this.indexNum == -1){
                this.$message.success("添加成功");
                this.get_table_data();
              }else{
                this.$message.success("修改成功");
                this.table_data[this.indexNum].name = this.form.name;
                this.table_data[this.indexNum].type = this.form.type;
              }
            })
            .catch(() => {
            });
        })
      },
      //单个删除
      delete_data(item){
        this.$confirm('此操作将会删除相册内的所有照片，及针对相册评论，且不可恢复哦～', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.load_data = true;
            var delData = {"id":item};
            this.$fetch.api_wisdom.delAlbum(delData)
              .then(response => {
                try{
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  this.load_data = false;
                  this.get_table_data();
                }catch(err){
                  this.$message({
                    type: 'error',
                    message: err.message
                  });
                }
              })
              .catch(() => {
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
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
