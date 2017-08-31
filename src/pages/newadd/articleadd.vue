<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="主标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="副标题:" prop="subtitle">
              <el-input v-model="form.subtitle" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="分类：">
					    <el-radio-group v-model="form.assortmentType">
					      <el-radio label="1">咨询-理财</el-radio>
					      <el-radio label="2">咨询-生活</el-radio>
					      <el-radio label="3">咨询-教育</el-radio>
					      <el-radio label="4">咨询-房产</el-radio>
					      <el-radio label="5">保险意识</el-radio>
					      <el-radio label="6">趣味</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item >
					    <div>
					        <quill-editor ref="myTextEditor" v-model="form.contents" :config="editorOption"></quill-editor>
					    </div>
					  </el-form-item>
					  
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.specialType">
					      <el-radio label="0">无</el-radio>
					      <el-radio label="1">最新</el-radio>
					      <el-radio label="2">必转</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="首页：">
					    <el-radio-group v-model="form.isTop">
					      <el-radio label="0">是</el-radio>
					      <el-radio label="1">否</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="封面：">
					    <el-radio-group v-model="form.showType">
					      <el-radio label="1">单图</el-radio>
					      <el-radio label="0">三图</el-radio>
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
					  <el-form-item label="文案：">
					    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.articleCopy"></el-input>
					  </el-form-item>
					  <el-form-item label="排序：">
					    <el-input v-model="sort" style="width: 200px;"></el-input>
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
	import {quillEditor} from 'vue-quill-editor';
  export default{
    data(){
      return {
      	content: '',
        editorOption: {},
      	postData: {token:''},
      	fileList:[],
        form: {
          title: null,
          subtitle: '',
          assortmentType: '',
          specialType:'',
          isTop:'',
          showType:'',
          articleCopy:'',
          imageUrl: '',
          pics: [],
          contents:'',
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
//    	console.log(this.route_id)
      }
    },
    methods: {
      //获取数据
      get_form_data(){
        this.load_data = true
        this.$fetch.api_wechat.findArticleById({
          id: this.route_id
        })
          .then(response => {	
          	this.form = response.data
          	
          	var sort = this.form.sort
          	var myDate=new Date('2020-01-01 00:00:00')
        		var sortnum = sort - myDate.getTime()
        		this.sort = sortnum
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
//          console.log(this.fileList)
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
      	var arr = []
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
//				console.info(arr[0].pic)
      	this.form.pics = JSON.stringify(arr); 
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          this.$fetch.api_wechat.saveArticle(this.form)
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
      quillEditor
    },
    mounted(){
    	$('#summernote').summernote({
    		lang: 'zh-CN',
    		placeholder: '请输入内容...',
    		height: 300,
    		minHeight: null,
    		maxHeight: null,
    		focus: true,
//  		toolbar: [
//  		  ['style',['bold','italic','clear']],
//  		  ['fontsize',['fontsize']],
//  		  ['para',['ul','ol','paragraph']],
//  		  ['insert',['picture','link']]
//  		],
    		callback: {
    			onImageUpload : function(files){
                QiniuUploadUtil.uploadFile(files[0], uptoken, function(data){
                    // 插入到summernote
                    $this.summernote('insertImage', qiniuDomain + data['key'], function($image) {
                        // todo，后续可以对image对象增加新的css式样等等，这里默认
                        $image.css({
                            display: '',
                            width: '100%'
                        });
                    });
                }, function(){
                    alert("上传失败");
                });                 
            }
    		}
    	}),
    	function sendFile(file){
    	API.getImageToken().then(response => {
    		console.log('富文本编辑器--getImageToken==Success>>>token='+response.token)
    		var data = new FormData()
    		data.append('file',file)
    		data.append('token',response.token)
    		API.unloadImage(data).then(response => {
    			var imageQiNiuUrl = API.QiNiu_HOST + response.key
    			$('#summernote').summernote('editor.insertImage',imageQiNiuUrl)
    		})
    	})
    }
    }
    
  }
</script>
<style scoped="scoped">
	.note-image-input ,.form-control {
     display: block; 
}
</style>