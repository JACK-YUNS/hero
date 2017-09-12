<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">

        <el-tabs>
              <el-tab-pane label="智慧营业区封面" class="area">
              	<el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="跟换封面图片：">
	               	<el-upload
	               		class="avatar-uploader"
										:show-file-list="false"
							    	action="//up.qbox.me/"
							    	:on-success="handleAvatarSuccess"
							    	:on-error="handleError"
							    	:on-remove="handleRemove"
							    	:before-upload="beforeAvatarUpload"
							    	:data="postData"
							    	:file-list="fileList"
							    	>
						    	<img v-if="form.cover" :src="form.cover" class="avatar">
  								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						    	<div class="el-upload__tip" slot="tip">上传封面图片大小不能超过 3MB!</div>
						    </el-upload>
						    <el-form-item>
			              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
                </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="欢迎信息" class="area">
              	<el-form ref="form" :model="form"  label-width="100px">
                <el-form-item label="营业区名称:" prop="areaName">
		              <el-input v-model="form.areaName" placeholder="最多10个汉字" style="width: 500px;" :maxlength=10 readonly="readonly"></el-input>
		            </el-form-item>
		            <el-form-item label="自定义标题:" prop="welcome">
		              <el-input v-model="form.chiefTitle" placeholder="最多10个汉字" style="width: 500px;" :maxlength=10 ></el-input>
		            </el-form-item>
                  <span  style="position: absolute;left: 15px;top: 120px;color: #48576a;font-size: 14px;font-weight: bold;display: inline-block;width: 80px;height:45px;overflow: hidden" v-if="this.form.chiefTitle==''|| this.form.chiefTitle==null">总监寄语：</span>
                  <span  style="position: absolute;left: 15px;top: 120px;color: #48576a;font-size: 14px;font-weight: bold;display: inline-block;width: 80px;height:45px;overflow: hidden" v-else>{{this.form.chiefTitle}}：</span>
		            <el-form-item>
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.chiefInspector" style="width: 500px;" placeholder="最多40个汉字" :maxlength=40 readonly="readonly"></el-input>
							  </el-form-item>
		            <el-form-item>
		              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
               </el-form>
              </el-tab-pane>
              <el-tab-pane label="重要通知" class="area">
                <el-form ref="form" :model="form"  label-width="100px">
		            <el-form-item label="通知内容：">
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.notice" style="width: 500px;" placeholder="暂无通知（最多60个汉字）" :maxlength=60 readonly="readonly"></el-input>
							  </el-form-item>
		            <el-form-item>
		              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
               </el-form>
              </el-tab-pane>
            </el-tabs>

      </div>
    </div>

  </el-row>
</template>
<script type="text/javascript">
  import {panelTitle, charts} from 'components'
  import {port_qiniu} from 'common/port_uri'

  export default{
    data(){
      return {
        postData: {token:''},
      	fileList:[],
        form: {
          cover: '',
          areaName: '',
          chiefTitle: '',
          chiefInspector:'',
          notice:''
        },
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
      this.get_form_data();
    },
    methods: {
    	//获取数据
      get_form_data(){
        this.load_data = true
        this.$fetch.api_wisdom.settings({
          areaName: '昆明十二区'
        })
          .then(response => {
            this.form = response.data
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
          	console.log(response)
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
      	this.form.cover ='http://resources.kangxun360.com/'+ res.key
      },
      handleRemove(file,fileList){
      	this.fileList = fileList;
      },
      handleError(res) {
      		//显示错误
      		console.log(res)
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
          this.$fetch.api_wisdom.updateSettings(this.form)
            .then(({msg}) => {
              this.$message.success(msg)
              setTimeout(this.$router(), 500)
            })
            .catch(() => {
              this.on_submit_loading = false
            })
        })
      }
    },
    components: {
      panelTitle,
      charts
    }
  }
</script>
<style scoped="scoped">
	.area{line-height: 45px;}
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
