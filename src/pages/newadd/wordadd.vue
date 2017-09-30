<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="16">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="主标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入内容（最多15字）" style="width: 500px;" :maxlength=15></el-input>
            </el-form-item>
            <el-form-item label="副标题:" prop="subtitle">
              <el-input v-model="form.subtitle" placeholder="请输入内容（最多15字）" style="width: 500px;" :maxlength=15></el-input>
            </el-form-item>
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.assortmentType">
					      <el-radio label="1">保险理念</el-radio>
					      <el-radio label="2">励志成长</el-radio>
					      <el-radio label="3">生活锦囊</el-radio>
					      <el-radio label="4">轻松一刻</el-radio>
					    </el-radio-group>
					  </el-form-item>
            <el-form-item label="内容：">
					    <el-input v-model="form.contents"  type="textarea" :autosize="{ minRows: 8, maxRows: 12}"  placeholder="请输入内容（最多500字）" :maxlength=500></el-input>
					  </el-form-item>

					   <el-form-item label="上传图片：">
					    <el-upload
					    	action="//up.qbox.me/"
					    	:on-success="handleAvatarSuccess"
					    	:on-error="handleError"
					    	:on-remove="handleRemove"
					    	:before-upload="beforeAvatarUpload"
					    	:data="postData"
					    	:file-list="fileList"
					    	list-type="picture-card"
                accept="image/*">
					    	<i class="el-icon-plus"></i>
					    </el-upload>

					  </el-form-item>
            <el-form-item label="排序：">
              <el-input-number v-model="sort"  :min="0"  :maxlength=5></el-input-number>
            </el-form-item>
            <el-form-item label="是否首页展示：">
					    <el-radio-group v-model="form.isTop">
					      <el-radio label="0">是</el-radio>
					      <el-radio label="1">否</el-radio>
					    </el-radio-group>
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
          subtitle: '',
          contents: '',
          assortmentType:'1',
          isTop:'1',
          pics: [],
          sort:''
        },
        sort:'',
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false,
        rules: {
          title: [{required: true, message: '主标题不能为空', trigger: 'blur'}],
          subtitle: [{required: true, message: '副标题不能为空', trigger: 'blur'}],
          contents: [{required: true, message: '请输入内容', trigger: 'blur'}]
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

        this.$fetch.api_wechat.findImageById({
          id: this.route_id
        })
          .then(response => {
            this.form = response.data

            var sort = this.form.sort
            var myDate=new Date('2020-01-01 00:00:00')
            var sortnum = sort - myDate.getTime()
            if(sort < myDate.getTime()){
              this.sort=0
            }else if(sort == null){
              this.sort=0
            }else{
              this.sort = sortnum
            }
            var picArr = JSON.parse(this.form.pics);
          	var arr =[];
            $.each(picArr, function(index, value, array) {
						  arr.push({
			          url: value.pic,
			          status: 'finished'
			        });
						});
						this.fileList = arr;
            this.load_data = false
            console.log(this.fileList)
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

      },
      //提交
      on_submit_form(){
      	var arr =[];
        $.each(this.fileList, function(index, value, array) {
        	console.log(value.url)
        	 if(value.url.indexOf('resources.kangxun360.com') != -1 || value.url.indexOf('7mnn49.com2.z0.glb.clouddn.com')!=-1){
        	 		arr.push({
			          pic:value.url
			      	});
        	 }else{
	        	 	arr.push({
			          pic: 'http://resources.kangxun360.com/'+ value.response.key
			      	});
        	 }

				});
        var _self = this;
      	this.form.pics = JSON.stringify(arr);
        var file = this.fileList
        if(file.length<1){
          _self.$message.warning("请上传至少1张图片");
          return false;
        }
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          var myDate=new Date('2020-01-01 00:00:00')
          this.form.sort = parseInt(this.sort)+myDate.getTime();
          this.$fetch.api_wechat.saveImage(this.form)
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
