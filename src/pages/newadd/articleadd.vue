<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="主标题:" prop="name">
              <el-input v-model="form.name" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="副标题:" prop="subname">
              <el-input v-model="form.subname" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="分类：">
					    <el-radio-group v-model="form.resource">
					      <el-radio label="咨询-理财"></el-radio>
					      <el-radio label="咨询-生活"></el-radio>
					      <el-radio label="咨询-教育"></el-radio>
					      <el-radio label="咨询-房产"></el-radio>
					      <el-radio label="保险意识"></el-radio>
					      <el-radio label="趣味"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item >
					    <div id="summernote"></div>
					  </el-form-item>
					  
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.articletype">
					      <el-radio label="无"></el-radio>
					      <el-radio label="最新"></el-radio>
					      <el-radio label="必转"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="首页：">
					    <el-radio-group v-model="form.index">
					      <el-radio label="是"></el-radio>
					      <el-radio label="否"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="封面：">
					    <el-radio-group v-model="form.picture">
					      <el-radio label="单图"></el-radio>
					      <el-radio label="三图"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					   <el-form-item label="上传图片：">
					    <el-upload
							  action="https://jsonplaceholder.typicode.com/posts/"
							  list-type="picture-card"
							  :on-preview="handlePictureCardPreview"
							  :on-remove="handleRemove">
							  <i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog v-model="form.dialogVisible" size="tiny">
							  <img width="100%" :src="form.dialogImageUrl" alt="">
							</el-dialog>
					  </el-form-item>
					  <el-form-item label="文案：">
					    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.desc"></el-input>
					  </el-form-item>
					  <el-form-item label="排序：">
					    <el-input-number v-model="form.num" @change="handleChange" :min="1" :max="10"></el-input-number>
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
        form: {
          name: null,
          subname: '',
          age: 20,
          type: [],
          desc: '',
          resource:'',
          picture:'',
          index:'',
          num:'',
          articletype:'',
          dialogImageUrl: '',
        	dialogVisible: false,
          birthday: this.$dateFormat(new Date, "yyyy-MM-dd"),
          address: null,
          zip: 412300
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
      this.route_id && this.get_form_data()
    },
    methods: {
      //获取数据
      get_form_data(){
        this.load_data = true
        this.$fetch.api_wechat.templateList({
          id: this.route_id
        })
          .then(({data}) => {
            this.form = data
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //时间选择改变时
      on_change_birthday(val){
        this.$set(this.form, 'birthday', val)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(value) {
        console.log(value);
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