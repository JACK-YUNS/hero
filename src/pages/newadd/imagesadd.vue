<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" :rules="rules" >
					   <el-form-item >
					    <el-upload 
					    	action="//up.qbox.me/" 
					    	:on-success="handleAvatarSuccess" 
					    	:on-error="handleError" 
					    	:on-remove="handleRemove"
					    	:before-upload="beforeAvatarUpload" 
					    	:data="postData"
					    	:file-list="fileList"
					    	list-type="picture-card"> 
					    	<i class="el-icon-plus"></i>
					    </el-upload>
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

  export default{
    data(){
      return {
        postData: {token:''},
      	fileList:[],
        form: {
          titile: '',
          subtitle: '',
          contents: '',
          assortmentType:'',
          isTop:'',
          imageUrl: '',
          pics: [],
        	dialogVisible:true, 
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
            console.log(this.form)
            var picArr = JSON.parse(this.form.cover);
          	var arr =[];
            $.each(picArr, function(index, value, array) {
						  arr.push({
			          url: value.pic,
			          status: 'finished'
			        });
						});
						this.fileList = arr;
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
      	var imageUrl ='http://resources.kangxun360.com/'+ res.key 
      	console.log(imageUrl)

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
				console.info(123123121233123)
      	var arr =[];
      	console.log(this.fileList.length)
        $.each(this.fileList, function(index, value, array) {
        	console.log(value.url)
        	 if(value.url.indexOf('resources.kangxun360.com') != -1){
        	 		arr.push({
			          pic:value.url
			      	});
        	 }else{
	        	 	arr.push({
			          pic: 'http://resources.kangxun360.com/'+ value.response.key
			      	});
        	 }
					
				});
				console.info(arr[0].pic)
      	this.form.cover = JSON.stringify(arr); 
      	
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          this.$fetch.api_wisdom.updateSettings(this.form)
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
	.el-upload__input {
    display: none!important;
}

</style>
