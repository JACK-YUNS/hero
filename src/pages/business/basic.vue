<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">

        <el-tabs @tab-click="changeTab">
              <el-tab-pane label="智慧营业区封面" class="area">
              	<el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="修改封面：">
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
                    accept="image/*"
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
		            <!--<el-form-item label="自定义标题:">-->
                  <!--<el-input v-model="form.chiefTitle" placeholder="最多10个汉字" style="width: 500px;" :maxlength=10 ></el-input>-->
                <!--</el-form-item>-->
                  <!--<span  style="position: absolute;left: 15px;top: 120px;color: #48576a;font-size: 14px;font-weight: bold;display: inline-block;width: 80px;height:45px;overflow: hidden" v-if="this.form.chiefTitle==''|| this.form.chiefTitle==null">总监寄语：</span>-->
                  <el-input  style="position: absolute;left: 15px;top: 60px;color: #48576a;font-size: 14px;font-weight: bold;display: inline-block;width: 80px;height:45px;overflow: hidden" v-model="form.chiefTitle" :maxlength=10 :show-overflow-tooltip=true></el-input>
		            <el-form-item>
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.chiefInspector" style="width: 500px;" placeholder="最多40个汉字" :maxlength=40 ></el-input>
							  </el-form-item>
		            <el-form-item>
		              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
               </el-form>
              </el-tab-pane>
              <el-tab-pane label="重要通知" class="area">
                <el-form ref="form" :model="form"  label-width="100px">
		            <el-form-item label="通知内容：">
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.notice" style="width: 500px;" placeholder="暂无通知（最多60个汉字）" :maxlength=60></el-input>
							  </el-form-item>
		            <el-form-item>
		              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
               </el-form>
              </el-tab-pane>
              <el-tab-pane label="设置权限" name="permission" class="area">
                <template>
                  <el-row style="height: 450px;">
                    <el-col :span="6">
                      <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="12">
                      <el-transfer
                        v-model="userData2"
                        filterable
                        :titles="['人员列表', '已有权限']"
                        @change="handleChange"
                        style="margin:0 auto;height: 400px;"
                        :data="userData1">
                      </el-transfer>
                    </el-col>
                  </el-row>

                </template>
              </el-tab-pane>
            </el-tabs>

      </div>
    </div>

  </el-row>
</template>
<script type="text/javascript">
  import {panelTitle, charts} from 'components'
  import {port_qiniu} from 'common/port_uri'
  import ElCol from "element-ui/packages/col/src/col";

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
          notice:'',
          id:''
        },

        load_data: false,
        on_submit_loading: false,
        rules: {
          name: [{required: true, message: '主标题不能为空', trigger: 'blur'}]
        },
        userData1:[],
        userData2:[]

      }
    },
    created(){
      this.getToken()
      this.get_form_data();
      this.getUserData();
    },
    methods: {
    	//获取数据
      get_form_data(){
          var _self = this;
        _self.load_data = true
        _self.$fetch.api_wisdom.settings({
          areaName: ''
        })
          .then(response => {
            _self.form = response.data
            var per = response.data.permissionUsers;
            if(per != null && per != ""){
                var temp = per.split(",");
                temp.forEach((per,index)=>{
                    _self.userData2.push(Number.parseInt(per));
                })
            }
            _self.load_data = false
          })
          .catch(() => {
            _self.load_data = false
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
      },
      beforeAvatarUpload(file                                                                                                                                                                      ) {
        const isLt2M = file.size / 1024 / 1024 < 3;

        if (!isLt2M) {
          this.$message.error('上传封面图片大小不能超过 3MB!');
        }
        return isLt2M;
      },
      //提交
      on_submit_form(){
        this.$refs.form.validate((valid) => {
          if(this.form.cover==''){
            this.$message.warning("请上传1张封面图片");
            return false;
          }
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
      },
      getUserData(){
          var _self = this;
          _self.$fetch.api_wisdom.selectPermission({})
            .then(response => {
                response.data.forEach((user,index)=>{
                  _self.userData1.push({
                    label:user.userName,
                    key:user.id
                  })
                })
            })
            .catch(() => {

            })

      },
      changeTab(tab,event){
      },
      handleChange(value, direction, movedKeys) {
        //保存
        var _self = this;
        var per = value.join(",");
        _self.on_submit_loading = true
        _self.$fetch.api_wisdom.updateSettings(
          {id:_self.form.id,permissionUsers:per}
        )
          .then(({msg}) => {
            this.$message.success(msg)
          })
          .catch(() => {
            this.on_submit_loading = false
          })

      }

    },
    components: {
      ElCol,
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
