<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    action="//up.qbox.me/"
    :on-success="handleAvatarSuccess"
    :on-error="handleError"
    :on-remove="handleRemove"
    :before-upload="beforeAvatarUpload"
    :data="postData"
    :file-list="fileList"
    accept="image/*"
  >
    <img v-if="form.cover" :src="form.cover" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <div class="el-upload__tip" slot="tip">上传封面图片大小不能超过 3MB!</div>
  </el-upload>
</template>
<script>
//   import { getToken } from 'api/qiniu'

  export default {
    name: 'upload',
    props: {
      content: {
        type: String
      }
    },
    data() {
      return {
        fileList: [],
        postData: {token:''},
        form: {
          cover: ''
        }
      }
    },
    methods: {
      handleAvatarSuccess(res, file,fileList) {
        this.fileList = fileList;
        //上传成功后在图片框显示图片
        this.form.cover ='http://resources.kangxun360.com/'+ res.key
      },
      handleRemove(file,fileList){
        this.fileList = fileList;
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
      }
    }
  }
</script>

<style scoped="scoped">

  .area{line-height: 45px;}
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
</style>
