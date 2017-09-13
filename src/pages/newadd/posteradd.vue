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
              <el-input v-model="form.title" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.assortmentType">
					      <el-radio label="1">理念</el-radio>
					      <el-radio label="2">问候</el-radio>
					      <el-radio label="3">励志</el-radio>
					    </el-radio-group>
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
					    	list-type="picture-card">
					    	<i class="el-icon-plus"></i>
					    </el-upload>
					  </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="sort" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="是否首页展示：">
					    <el-radio-group v-model="form.isTop">
					      <el-radio label="1">是</el-radio>
					      <el-radio label="2">否</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="是否推荐展示：">
					    <el-radio-group v-model="form.isRecommend">
					      <el-radio label="0">不推荐</el-radio>
					      <el-radio label="1">推荐</el-radio>
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
      	    id:'',
          title: '',
          assortmentType:'1',
          isTop:'1',
          isRecommend:'0',
          imageUrl: '',
          pics: [],
        	dialogVisible:true,
          sort:''
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
        this.$fetch.api_wechat.findPosterById({
          id: this.route_id
        })
          .then(response => {
            this.form = response.data
            this.load_data = false

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

          	var arr =[];
					  arr.push({
		          url: this.form.pics,
		          status: 'finished'
		        });
						this.fileList = arr;
						console.log("filelist-size:"+this.fileList.length)
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
      	if(this.fileList[0].url.indexOf('resources.kangxun360.com') != -1 || this.fileList[0].url.indexOf('7mnn49.com2.z0.glb.clouddn.com') != -1){
      		this.form.pics = this.fileList[0].url;
      	}else{
      		this.form.pics = 'http://resources.kangxun360.com/' + this.fileList[0].response.key;
      	}

        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          var myDate=new Date('2020-01-01 00:00:00')
          this.form.sort = parseInt(this.sort)+myDate.getTime();
          console.info(this.form.sort);
          this.$fetch.api_wechat.savePoster(this.form)
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
