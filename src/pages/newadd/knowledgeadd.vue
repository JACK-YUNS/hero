<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					  <el-form-item label="文章标题" prop="name">
					    <el-input v-model="ruleForm.name"></el-input>
					  </el-form-item>
					 <el-form-item label="文章类型" prop="type">
					    <el-checkbox-group v-model="ruleForm.type">
					      <el-checkbox label="1" name="type">案例分享</el-checkbox>
					      <el-checkbox label="2" name="type">话题讨论</el-checkbox>
					      <el-checkbox label="3" name="type">名家访谈</el-checkbox>
					    </el-checkbox-group>
					  </el-form-item>
					  <el-form-item label="定时发布" prop="delivery">
					    <el-switch on-text="" off-text="" v-model="ruleForm.delivery"></el-switch>
					  </el-form-item>
					  
					  <el-form-item label="活动时间" required>
					    <el-col :span="11">
					      <el-form-item prop="date1">
					        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
					      </el-form-item>
					    </el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
					      <el-form-item prop="date2">
					        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
					      </el-form-item>
					    </el-col>
					  </el-form-item>
					  <el-form-item v-model="ruleForm.resource">
					    <div id="summernote"></div>
					  </el-form-item>
					  
					  <el-form-item>
					    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
      	  ruleForm: {
	          name: '',
	          region: '',
	          date1: '',
	          date2: '',
	          delivery: false,
	          type: [],
	          resource: '',
	          desc: ''
	        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
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
      if(this.route_id>0){
      	this.get_form_data();
      	console.log(this.route_id)
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
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
      	this.form.pics = JSON.stringify(arr); 
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
      panelTitle
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