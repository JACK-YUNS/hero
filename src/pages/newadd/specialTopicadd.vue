<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="16">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="专题名称:" prop="title">
              <el-input v-model="form.title" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="专题内容:" prop="info">
              <el-input v-model="form.info" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>

            <el-form-item label="选择专题类型：">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">普通专题</el-radio>
                <el-radio :label="2">倒计时专题</el-radio>

              </el-radio-group>
              <div v-if="form.type==2">
                <el-col>
                  <el-form-item style="width: 200px;">
                    <el-date-picker v-model="form.endTime" type="date" :picker-options="options" placeholder="选择日期时间"  style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </div>
            </el-form-item>
            <!--<el-form-item label="修改logo：">-->
              <!--<el-upload-->
                <!--class="avatar-uploader"-->
                <!--:show-file-list="false"-->
                <!--:on-success="handleAvatarSuccess"-->
                <!--:on-error="handleError"-->
                <!--:on-remove="handleRemove"-->
                <!--:before-upload="beforeAvatarUpload"-->
                <!--:data="postData"-->
                <!--:file-list="fileList"-->
              <!--&gt;-->
                <!--<img v-if="form.pic" :src="form.pic" class="avatar">-->
                <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <!--</el-upload>-->
            <!--</el-form-item>-->

            <el-form-item label="排序：">
              <el-input v-model="form.sort" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="on_submit_form" :loading="on_submit_loading">立即提交</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
 import {panelTitle} from 'components'
 import {port_qiniu} from 'common/port_uri'
  export default{
    data(){
      return {
      	postData: {token:''},
      	fileList:[],
        form: {
          title: '',
          info: '',
          sort:'',
          type:1,
          pic: '',
          endTime:''
        },
        options:{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        sort:'',
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false,
        rules: {
          name: [{required: true, message: '主标题不能为空', trigger: 'blur'}]
        }
      }
    },
    created(){
      this.getToken()
      if(this.route_id>0){
      	this.get_form_data();
      	console.log(this.route_id)
      }
    },
    methods: {
      //获取数据
      get_form_data(){
        this.load_data = true

        this.$fetch.api_theme.themeById({
          id: this.route_id
        })
          .then(response => {
            this.form = response.data
            var sort = this.form.sort
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      change(status){
//        var _self = this;
//        _self.type = status;
//        if(status){
//          _self.flag=1;
//        }else{
//          _self.flag = 0;
//        }
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
      handleAvatarSuccess(res, file,fileList) {
        this.fileList = fileList;
        //上传成功后在图片框显示图片
        this.form.pic ='http://resources.kangxun360.com/'+ res.key
      },
      handleRemove(file,fileList){
        this.fileList = fileList;
      },
      handleError(res) {
        //显示错误
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 3;

        if (!isLt2M) {
          this.$message.error('上传封面图片大小不能超过 3MB!');
        }
        return isLt2M;
      },
      //提交
      on_submit_form(){
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          this.$fetch.api_theme.addTheme(this.form)
            .then(({msg}) => {
              this.$message.success(msg)
              setTimeout(this.$router.back(), 500)
            })
            .catch(() => {
              this.on_submit_loading = false
            })
        })
      }
    },
    components: {
      panelTitle
    }
  }
</script>
<style scoped="scoped">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
