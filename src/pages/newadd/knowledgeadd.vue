<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="20">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					  <el-form-item label="文章标题" prop="title">
					    <el-input v-model="ruleForm.title" placeholder="请输入内容（最多30字）" style="width: 500px;" :maxlength=30></el-input>
					  </el-form-item>
					 <el-form-item label="文章类型" >
					    <el-radio-group v-model="ruleForm.type">
					      <el-radio :label="1" >案例分享</el-radio>
					      <el-radio :label="2" >话题讨论</el-radio>
					      <el-radio :label="3" >名家访谈</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="定时发布" prop="isPublish">
              <el-col :span="4"> <el-switch on-text="" off-text="" v-model="ruleForm.isPublish" @change="change" ></el-switch></el-col>
              <div v-if="isPublish">
              <el-col :span="10">
                <el-form-item  prop="publishDate">
                  <el-date-picker v-model="ruleForm.publishDate" type="datetime" :picker-options="options" placeholder="选择日期时间"  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              </div>

					  </el-form-item>


					  <!--<el-form-item prop="content" >-->
              <!--<div>-->
                <!--<quill-editor ref="newEditor" v-model="ruleForm.content" :options="editorOption">-->

                <!--</quill-editor>-->
                <!--<el-upload-->
                  <!--ref="upload"-->
                  <!--action="//up.qbox.me/"-->
                  <!--:on-success="handleAvatarSuccess"-->
                  <!--:on-error="handleError"-->
                  <!--:before-upload="beforeAvatarUpload"-->
                  <!--:data="postData"-->
                  <!--style="display:none">-->
                  <!--<el-button id="imgInput" type="primary">点击上传</el-button>-->
                <!--</el-upload>-->
              <!--</div>-->
					  <!--</el-form-item>-->

            <template>
              <div class="components-container">
                <div class="editor-container">
                  <UE :defaultMsg="ruleForm.content" :config=config ref="ue"></UE>
                </div>
              </div>
            </template>
              <el-form-item label="封面图片：" style="margin-top: 20px">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  action="//up.qbox.me/"
                  :on-success="handleAvatarSuccesspic"
                  :on-error="handleErrorpic"
                  :on-remove="handleRemovepic"
                  :before-upload="beforeAvatarUploadpic"
                  :data="postDatapic"
                  :file-list="fileList"
                  accept="image/*"
                >
                  <img v-if="ruleForm.cover" :src="ruleForm.cover" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>


					  <el-form-item>
					    <el-button type="primary" @click="submitForm()">立即创建</el-button>
					    <el-button @click="$router.back()">返回上一页</el-button>
					  </el-form-item>
					</el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
//  import Quill from 'quill'
//  import { quillEditor } from 'vue-quill-editor';
  import {panelTitle} from 'components'
  import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
  import ElCol from "element-ui/packages/col/src/col";
  import UE from '../../components/editor/ueditor.vue';

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
        postData: {token:''},
        postDatapic: {token:''},
        fileList:[],
        editorOption: {
          modules: {
            toolbar: toolbarOptions
          }

        },
        defaultMsg: '',
        editorOption: {
          modules: {
            toolbar: toolbarOptions
          }

        },
        config: {
          initialFrameWidth: '',
          initialFrameHeight: 350
        },
        options:{
          disabledDate(date) {
            return date.getTime() < Date.now() - 8.64e7;
          }
        },
        ruleForm: {
          title: '',
          type: 1,
          publishDate: '',
          content: '',
          isPublish:false,
          id:this.$route.params.id,
          flag:0,
          cover:''
        },
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'change'}
          ],
          publishDate: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          type: [
            { required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          content:[
            {required: true, message: '请输入内容', trigger: 'blur'},
          ]

        },
        isPublish:false,
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false

      }
    },
    created(){
      if (this.route_id > 0) {
        this.get_form_data();
      };
      this.getToken()
      this.getTokenpic()
    },
    mounted() {
      var _self =this
//      var imgHandler = async function(image) {
//        _self.addImgRange = _self.$refs.newEditor.quill.getSelection()
//        if (image) {
//          var fileInput = document.getElementById("imgInput") //隐藏的file文本ID
//          fileInput.click() //加一个触发事件
//        }
//      }
//      _self.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
    },
    methods: {
      //获取数据
      get_form_data(){
        var _self = this;
        _self.load_data = true
        _self.$fetch.api_knowledge.getTopic({
          id: _self.route_id
        })
          .then(response => {
            _self.ruleForm = response.data
            _self.load_data = false
            //this.$refs.ue.setUEContent(response.data.contents);
          })
          .catch(() => {
            _self.load_data = false
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
      change(status){
          var _self = this;
        _self.isPublish = status;
          if(status){
            _self.flag=1;
          }else{
              _self.flag = 0;
          }
      },
//      handleAvatarSuccess(res, file,fileList) {
//        var _self = this
//        var url = ''
//        if(file.url.indexOf('resources.kangxun360.com') != -1){
//          url = file.url;
//        }else{
//          url = 'https://resources.kangxun360.com/'+ file.response.key;
//        }
//        if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
//          var value = url
//          _self.addRange = _self.$refs.newEditor.quill.getSelection()
//          value = value.indexOf('http') !== -1 ? value : 'http:' + value
//          _self.$refs.newEditor.quill.insertEmbed(_self.addRange !== null ? _self.addRange.index : 0, 'image', value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
//        } else {
//          _self.$message.warning("图片增加失败")
//        }
//        this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
//
//      },
      handleError(res) {
        //显示错误

      },
      beforeAvatarUpload(file) {

      },
      getTokenpic(){
        this.$fetch.api_qiniu.getToken({
        })
          .then(response => {
            console.log(response)
            this.postDatapic = {token : response.data}
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      handleAvatarSuccesspic(res, file,fileList) {
        this.fileList = fileList;
        //上传成功后在图片框显示图片
        this.ruleForm.cover ='http://resources.kangxun360.com/'+ res.key
      },
      handleRemovepic(file,fileList){
        this.fileList = fileList;
      },
      handleErrorpic(res) {
        //显示错误
        console.log(res)
      },
      beforeAvatarUploadpic(file) {

      },
      submitForm() {
          var _self = this;
          var content = _self.$refs.ue.getUEContent(); // 调用子组件方法
          _self.ruleForm.content = content;
        _self.$refs.ruleForm.validate((valid) => {
          if(this.ruleForm.cover==''){
            this.$message.warning("请上传1张封面图片");
            return false;
          }
          if (valid) {
            _self.$fetch.api_knowledge.saveTopic(_self.ruleForm)
              .then(({msg}) => {
                this.$message.success(msg)
                setTimeout(this.$router.back(), 500)
              })
              .catch(() => {
                this.on_submit_loading = false
              })
          } else {
            return false;
          }
        });
      },
    },
    components: {
      ElCol,
      ElRadio,
      panelTitle,
      //quillEditor,
      UE,
    },

  }
</script>
<style scoped="scoped">
	.note-image-input ,.form-control {
     display: block;
}
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
  .ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 25em;
  }
</style>
