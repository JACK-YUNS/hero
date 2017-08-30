<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-upload
          ref="upload"
          action="//up.qbox.me/"
          :on-success="handleAvatarSuccess"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload"
          :data="postData"
          list-type="picture-card"
          multiple>
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-row>
          <el-col :span="4" v-for="(item,$index) in photoList" style='margin:10px;position: relative;width: 200px;height: 300px;' >
            <div class="" style="height: 100%;width: 100%;" @mouseenter="isShow=$index" @mouseleave="isShow=-1" >
              <el-card :body-style="{ padding: '0px' ,height:'73%' }" style="height: 100%;width: 100%;" >
                <div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow==$index">
                  <el-button type="text" icon="delete" class='centerbtn' @click="delete_data(item.id)">删除</el-button>
                </div>
                  <img :src="item.url" class="image" style="height: 100%;width: 100%;" >
                  <div style="padding: 14px;text-align: center">
                    {{item.name}}
                  </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-button @click="$router.back()">返回上一页</el-button>
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
        photoList:[],
        fileList:[],
        isShow:-1,
        indexNum:0,
        fileLength:0,
        form: {
            id:"",
            albumId:"",
            url:"",
            describe:"",
            height:"",
            width:""
        },
        albumId:this.$route.params.albumId,
        load_data: false,
        on_submit_loading: false
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
        this.$fetch.api_wisdom.photoList({
          "albumId":this.albumId
        })
          .then(response => {
            this.photoList = response.data;
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
            this.postData = {token : response.data}
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      delete_data(){
          console.log(1);
      },
      savePhoto(){
          console.log(this.fileList);
          var arr = [];
          var albumId =  this.albumId;
        $.each(this.fileList, function(index, value, array) {
            console.log(value.response.key);
          var url = "";
          if(value.url.indexOf('resources.kangxun360.com') != -1){
            url = value.url;
          }else{
            url = 'http://resources.kangxun360.com/'+ value.response.key;
          }
          var img = new Image();
          img.src = url;
          var entity = {albumId:albumId,url:url,describe:value.name,width:img.width,height:img.height};
          console.info(entity);
          arr.push(entity);
        });
        console.log(arr);

      //this.$refs.upload.clearFiles();
        this.indexNum = 0;
        this.get_form_data();
      },
      handleAvatarSuccess(res, file,fileList) {
          this.fileList = fileList;
          this.indexNum = this.indexNum + 1;
          if(this.indexNum == fileList.length){
            this.$message({
              type: 'success',
              message: '成功上传'+fileList.length+'图片'
            });
            $(".el-upload-list").find("li").remove();
            this.savePhoto();
          }else{

          }
      },
      handleError(res) {
      		//显示错误
      		//console.log(res)
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
      	//console.log(this.fileList.length)
        $.each(this.fileList, function(index, value, array) {
        	//console.log(value.url)
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
				//console.info(arr[0].pic)
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
	.el-upload__input {display: none!important;}
  .centerbtn{width: 30%;float:right;color: #fff;}
</style>
