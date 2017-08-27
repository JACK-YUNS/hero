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
								  action="https://jsonplaceholder.typicode.com/posts/"
								  :show-file-list="false"
								  :on-success="handleAvatarSuccess"
								  :before-upload="beforeAvatarUpload">
								  <img v-if="imageUrl" :src="imageUrl" class="avatar">
								  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
								  <div class="el-upload__tip" slot="tip">上传封面图片大小不能超过 3MB!</div>
								</el-upload>
                </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="欢迎信息" class="area">
              	<el-form ref="form" :model="form"  label-width="100px">
                <el-form-item label="营业区名称:" prop="name">
		              <el-input v-model="form.name" placeholder="最多10个汉字" style="width: 500px;" :maxlength=10></el-input>
		            </el-form-item>
		            <el-form-item label="欢迎词:" prop="word">
		              <el-input v-model="form.subname" placeholder="最多15个汉字" style="width: 500px;" :maxlength=15></el-input>
		            </el-form-item>
		            <el-form-item label="文案：">
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.desc" style="width: 500px;" placeholder="最多50个汉字" :maxlength=50></el-input>
							  </el-form-item>
		            <el-form-item>
		              <el-button type="success" @click="on_submit_form" :loading="on_submit_loading">保存</el-button>
		            </el-form-item>
               </el-form>
              </el-tab-pane>
              <el-tab-pane label="重要通知" class="area">
                <el-form ref="form" :model="form"  label-width="100px">
		            <el-form-item label="通知内容：">
							    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.desc" style="width: 500px;" placeholder="暂无通知（最多60个汉字）" :maxlength=60></el-input>
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

  export default{
    data(){
      return {
         imageUrl: '',
         form: {
          name:'',
          word:'',
          desc: ''
        },
        table_data:[],
         route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false,
        rules: {
          name: [{required: true, message: '主标题不能为空', trigger: 'blur'}]
        }
      }
    },
    created(){
      this.get_table_data()
      console.log('1')
    },
    methods: {
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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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
          this.$fetch.api_table.save(this.form)
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
      panelTitle,
      charts
    }
  }
</script>
<style scoped="scoped">
	.area{width: 188px;line-height: 45px;}
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