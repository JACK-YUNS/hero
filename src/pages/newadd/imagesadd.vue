<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         v-loading.fullscreen.lock="fullscreenLoading"
         element-loading-text="拼命加载中">
      <el-dialog  :visible.sync="dialogFormVisible">
            <el-input v-model="descName" auto-complete="off" placeholder="给相片起个名字吧~（最多输入20个字）" type="text"  :maxlength=20></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDesc()">确 定</el-button>
        </div>
      </el-dialog>
      <el-row>
        <el-row>

          <el-col :span="3">
            <el-upload
              ref="upload"
              action="//up.qbox.me/"
              :on-success="handleAvatarSuccess"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
              :data="postData"
              multiple>
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">批量管理</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" v-for="(item,$index) in photoList" style='margin:10px;position: relative;width: 200px;height: 300px;' >
            <div class="" style="height: 100%;width: 100%;" @mouseenter="isShow=$index" @mouseleave="isShow=-1" >
              <el-card :body-style="{ padding: '0px' ,height:'73%' }" style="height: 100%;width: 100%;" >
                  <div class="new-item-badge" v-show="coverId == item.id">封面</div>

                <div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow==$index && coverId!= item.id">
                  <el-button type="text" icon="star-on" @click="setCover(item.id),coverId=item.id" class='centerbtn'>设为封面</el-button>
                  <el-button type="text" icon="delete" class='centerbtn' @click="delete_data(item.id,$index)">删除</el-button>
                </div>
                <div style="width: 100%; background-color: rgba(0, 0, 0, 0.7);position: absolute;left: 0;right: 0;" v-show="isShow==$index && coverId== item.id">
                  <el-button type="text" icon="delete" class='centerbtns' @click="delete_data(item.id,$index)">删除</el-button>
                </div>

                  <img :src="item.url" class="image" style="height: 100%;width: 100%;" >
                  <div style="padding: 14px;text-align: center" @click="dialogFormVisible=true,descName=item.describe,descId=item.id,descIndex=$index" >
                    {{item.describe}}
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
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default{
    data(){
      return {
        postData: {token:''},
        photoList:[],
        fileList:[],
        isShow:-1,
        indexNum:0,
        fileLength:0,
        coverId:"",
        dialogFormVisible:false,
        descName:"",
        descId:"",
        descIndex:"",
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
        fullscreenLoading: false
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
            for(var item in this.photoList){
                if(item.cover == 1){
                    this.coverId = item.id;
                    break;
                }
            }
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
      setCover(id){
        var entity = {id:id,albumId:this.albumId};
        this.$fetch.api_wisdom.setCover(entity);
//        this.get_form_data();
      },
      saveDesc(){
        var listEntity = [{id:this.descId,albumId:this.albumId,describe:this.descName}];
        this.$fetch.api_wisdom.savePhoto(listEntity);
        this.dialogFormVisible = false;
        this.photoList[this.descIndex].describe = this.descName;
      },
      delete_data(id,index){
          this.$confirm('删除后不可恢复哦，确定要删除吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            var listEntity = [{id:id,albumId:this.albumId,flag:-1}];
            this.$fetch.api_wisdom.savePhoto(listEntity);
            this.photoList.splice(index,1);
          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      },
      savePhoto(){

          var arr = [];
          var albumId =  this.albumId;
        $.each(this.fileList, function(index, value, array) {

          var url = "";
          if(value.url.indexOf('resources.kangxun360.com') != -1){
            url = value.url;
          }else{
            url = 'https://resources.kangxun360.com/'+ value.response.key;
          }


          var entity = {albumId:albumId,url:url,describe:value.name,width:value.response.w,height:value.response.h};

          arr.push(entity);

        });
        this.fileList = [];
        //去保存
       this.$fetch.api_wisdom.savePhoto(arr);

        this.fullscreenLoading = true;
       setTimeout(()=>{
            this.fullscreenLoading = false;
            this.get_form_data();
       },3000);
      },
      handleAvatarSuccess(res, file,fileList) {

          this.indexNum = this.indexNum + 1;
          this.fileList.push(file);

          if(this.indexNum == fileList.length){
            this.$message({
              type: 'success',
              message: '成功上传'+this.fileList.length+'图片'
            });
            $(".el-upload-list").find("li").remove();
            this.savePhoto();
          }else{

          }
      },
      handleError(res) {
      		//显示错误

      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 3;

        if (!isLt2M) {
          this.$message.error('上传封面图片大小不能超过 3MB!');
        }
        return isLt2M;
      },
    },
    components: {
      ElCol,
      ElRow,
      panelTitle
    }
  }
</script>
<style scoped="scoped">
	.el-upload__input {display: none!important;}
  .centerbtn{width: 45%;text-align: center;color: #fff;}
  .centerbtns{width: 45%;float:right;text-align: center;color: #fff;}
  .new-item-badge {
    position: absolute;
    background: #92b7bd;
    z-index: 999;
    border-radius: 3px;
    color: #fff;
    font-size: 70%;
    padding: 2px 4px 0;
    top: -5px;
    left: -10px;
    line-height: 1.4;
    -ms-transform: rotate(-8deg);
    -webkit-transform: rotate(-8deg);
    transform: rotate(-8deg);
    transition: transform 0.1s ease-in;
    /* Most of this code is necessary to style and position the badge. */
  }



</style>
