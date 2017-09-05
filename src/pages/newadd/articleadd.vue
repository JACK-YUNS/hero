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
					        <quill-editor ref="newEditor" v-model="form.contents" :options="editorOption"></quill-editor>
	                <el-upload
	                  ref="upload"
	                  action="//up.qbox.me/"
	                  :on-success="handleAvatarSuccess"
	                  :on-error="handleError"
	                  :before-upload="beforeAvatarUpload"
	                  :data="postData"
	                  style="display:none">
	                  <el-button id="imgInput" type="primary">点击上传</el-button>
	                </el-upload>
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
					      <el-radio label="0">单图</el-radio>
					      <el-radio label="1">三图</el-radio>
					    </el-radio-group>
					  </el-form-item>
					   <el-form-item label="上传图片：">
					    <el-upload
					    	action="//up.qbox.me/"
					    	:on-success="handleAvatarSuccessPic"
					    	:on-error="handleError"
					    	:on-remove="handleRemove"
					    	:before-upload="beforeAvatarUpload"
					    	:data="postDatapic"
					    	:file-list="fileListpic"
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
	import Quill from 'quill'
	import ElCol from "element-ui/packages/col/src/col";
	var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button
    ['image']
  ];
  export default{
    data(){
      return {
      	content: '',
      	editorOption: {
          modules: {
            toolbar: toolbarOptions
          }

       },
      	postData: {token:''},
      	postDatapic: {token:''},
      	fileList:[],
      	fileListpic:[],
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
     this.getTokenpic()
      if(this.route_id>0){
      	this.get_form_data();
//    	console.log(this.route_id)
      }
    },
     mounted() {
      var _self =this
      var imgHandler = async function(image) {
        _self.addImgRange = _self.$refs.newEditor.quill.getSelection()
        if (image) {
          var fileInput = document.getElementById("imgInput") //隐藏的file文本ID
          fileInput.click() //加一个触发事件
        }
      }
      _self.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
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
            if(sort < myDate.getTime()){
              this.sort=0
            }else if(sort == null){
              this.sort=0
            }else{
              this.sort = sortnum
            }

            var picArr = JSON.parse(this.form.pics);
          	var arr =[];
          	var arrpic = [];
            $.each(picArr, function(index, value, array) {
						  arr.push({
			          url: value.pic,
			          status: 'finished'
			        });
						});
						$.each(picArr, function(index, value, array) {
						  arrpic.push({
			          url: value.pic,
			          status: 'finished'
			        });
						});
						this.fileList = arr;
						this.fileListpic = arrpic;
            this.load_data = false
//          console.log(this.fileList)
          })
          .catch(() => {
            this.load_data = false
          })
      },

       getToken(){
        var _self = this;
        _self.$fetch.api_qiniu.getToken({
        })
          .then(response => {
            _self.postData = {token : response.data}
            _self.load_data = false
          })
          .catch(() => {
            _self.load_data = false
          })
      },
      getTokenpic(){
        var _self = this;
        _self.$fetch.api_qiniu.getToken({
        })
          .then(response => {
            _self.postDatapic = {token : response.data}
            _self.load_data = false
          })
          .catch(() => {
            _self.load_data = false
          })
      },
      handleAvatarSuccessPic(res, file,fileListpic) {
      	this.fileListpic = fileListpic;
      	//上传成功后在图片框显示图片
      	var imageUrl ='http://resources.kangxun360.com/'+ res.key
      	console.log(imageUrl)
				var arr = []
      	var isnum = this.form.showType;
        var picArr = JSON.parse(this.form.pics)
				var arrlength = arr.length+picArr.length;
					console.log(arrlength)
					console.log('qqq')
      	if(isnum==0){
      		if(arrlength<=1){
      			$.each(this.fileListpic, function(index, value, array) {
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
      		}else{
      			return
      		}
      	}
      	if(isnum==1){
      		if(arrlength<3){
      			$.each(this.fileListpic, function(index, value, array) {
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
      		}
      		else{
      			return
      		}
      	}


//				console.info(arr[0].pic)
      	this.form.pics = JSON.stringify(arr);
      },
      handleAvatarSuccess(res, file,fileList) {
        var _self = this
        var url = ''
        if(file.url.indexOf('resources.kangxun360.com') != -1){
          url = file.url;
        }else{
          url = 'https://resources.kangxun360.com/'+ file.response.key;
        }
        if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
          var value = url
          _self.addRange = _self.$refs.newEditor.quill.getSelection()
          value = value.indexOf('http') !== -1 ? value : 'http:' + value
          _self.$refs.newEditor.quill.insertEmbed(_self.addRange !== null ? _self.addRange.index : 0, 'image', value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
        } else {
          _self.$message.warning("图片增加失败")
        }
        this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容

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

        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          var myDate=new Date('2020-01-01 00:00:00')
          this.form.sort = parseInt(this.sort)+myDate.getTime();
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
    }


  }
</script>
<style scoped="scoped">
	.note-image-input ,.form-control {
     display: block;
}
</style>
