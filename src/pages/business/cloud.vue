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
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-upload
            ref="upload"
            action="//up.qbox.me/"
            :on-success="handleAvatarSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
            :data="postData"
            accept="*/*"
            multiple
            style="float: left">
            <el-button type="primary">上传资料</el-button>
          </el-upload>

          <div style="float: left;font-size: 14px;color: #666666;margin-left: 10px">单份资料不超过20M，支持上传格式：doc(.docx)、ppt(.pptx)、xls(.xlsx)、pdf、txt、png、jpeg、jpg、bmp、gif、tiff</div>
          <!--<router-link :to="{name: 'wordOperationAdd',params: {id: ''}}" tag="span">-->
            <!--<el-button type="success">新建</el-button>-->
          <!--</router-link>-->
        </el-form-item>
      </el-form>


    <el-table
      :data="table_data"
      v-loading="load_data"
      element-loading-text="拼命加载中"
      v-loading.fullscreen.lock="fullscreenLoading"
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
        label="资料标题"
        :show-overflow-tooltip=true
      >
        <template scope="props">
            <span class="link-type">{{props.row.fileName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="文件大小"
      >
        <template scope="props">
          <span class="link-type">{{props.row.fileSize}} KB</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="aTime"
        :formatter="dateFormat"
        label="时间">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >

        <template scope="props">
          <el-button type="primary" size="small" >下载</el-button>
          <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){

      return {
        postData: {token:''},
        fileList:[],
        on_submit_loading: false,
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
        batch_select: [],
        fullscreenLoading: false
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
      _self.getToken()
      _self.get_table_data();
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
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = true
        _self.$fetch.api_cloudDisk.cloudList({
          current: _self.currentPage,
          pageSize: _self.length
        })
          .then(response => {
            this.table_data =response.data.records;
            this.currentPage = response.data.current
            this.total = response.data.total
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      getToken(){
        this.$fetch.api_qiniu.getToken({
        })
          .then(response => {
          this.postData = {token : response.data}
        this.load_data = false
      })
      .catch(() => {
          this.load_data = false
      })
      },
      //提交
      onSubmit() {
        this.load_data = true
        this.get_table_data();
      },
      //单个删除
      delete_data(item,id){
        //当前点击的文章id
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
            this.$fetch.api_cloudDisk.delFile(data)
              .then(({msg}) => {
                this.get_table_data()
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
      savePhoto(){

        var arr = [];
        $.each(this.fileList, function(index, value, array) {

          var url = "";
          if(value.url.indexOf('resources.kangxun360.com') != -1){
            url = value.url;
          }else{
            url = 'https://resources.kangxun360.com/'+ value.response.key;
          }
          var fileSize = value.response.fsize/1024
          var entity = {fileType:value.response.type,path:value.response.key,fileSize:fileSize,fileName:value.name,width:value.response.w,height:value.response.h,flag:0};

          arr.push(entity);

        });
        this.fileList = [];
        //去保存
        this.$fetch.api_cloudDisk.addFile(arr);
        setTimeout(()=>{
            this.get_table_data();
          },1000);
      },
      handleAvatarSuccess(res, file,fileList) {
        this.fileList.push(file);
        $(".el-upload-list").find("li").remove();
        this.savePhoto();
        this.get_table_data();
      },
      handleError(res) {
        //显示错误

      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 20;

        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 20MB!');
        }
        return isLt2M;
      },
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
