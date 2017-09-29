<template>
    <el-upload
      action="//up.qbox.me/"
      :on-success="handleAvatarSuccessPic"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :data="postDatapic"
      :file-list="fileListpic"
      accept="image/*"
      list-type="picture-card">
      <i class="el-icon-plus"></i>
    </el-upload>
</template>
<script>
  // import { getToken } from 'api/qiniu'

  export default {
    name: 'upload',
    props: {
      content: {
        type: Array
      }
    },
    data() {
      return {
        fileListpic: [],
        postDatapic: {token:''},
        form: {
          pics: []
        }
      }
    },
    created(){
      this.getTokenpic()
    },
    methods: {
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
        var _self=this;
        _self.fileListpic = fileListpic;
        //上传成功后在图片框显示图片
        var imageUrl ='http://resources.kangxun360.com/'+ res.key
        console.log(_self.fileListpic)
        var arr = []
        console.log('qqq')
        $.each(_self.fileListpic, function(index, value, array) {
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
//				console.info(arr[0].pic)
        _self.form.pics = JSON.stringify(arr);
      },
      handleRemove(file,fileList){
        var _self = this;
        _self.fileListpic = fileList;
        var arr = []
        $.each(_self.fileListpic, function(index, value, array) {
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
        _self.form.pics = JSON.stringify(arr);
      },
      handleError(res) {
        //显示错误
        console.log(res)
      },
      beforeAvatarUpload(file) {
//        let _self = this;
//        let curr = moment().format('YYYYMMDD').toString()
//        let prefix = moment(file.lastModified).format('HHmmss').toString()
//        let suffix = file.name
//        let key = encodeURI(`${prefix}_${suffix}`)
//        _self.$fetch.api_qiniu.getToken({key:key
//        })
//          .then(response => {
//            _self.postDatapic ={token:response.data}
//            console.info(_self.postDatapic)
//            _self.load_data = false
//          })
//          .catch(() => {
//            _self.load_data = false
//          })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
