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
            <el-form-item label="副标题:" prop="subtitle">
              <el-input v-model="form.subTitle" placeholder="请输入内容" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.type">
					      <el-radio :label="1">金句</el-radio>
					      <el-radio :label="2">海报</el-radio>
					      <el-radio :label="3">文章</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="排序：">
					    <el-input-number v-model="form.sort" :min="1" :max="10"></el-input-number>
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
          title: null,
          subtitle: '',
          contents: '',
          type:1,
          assortmentType:1,
          isTop:'',
          imageUrl: '',
          pics: [],
          sort: '',
        	dialogVisible:true,
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
        this.$fetch.api_wechat.findTemplateById({
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
        var _self = this;
        _self.$refs.form.validate((valid) => {
          if (!valid) return false
          _self.on_submit_loading = true
          _self.$fetch.api_wechat.saveTemplate(_self.form)
            .then(({msg}) => {
              _self.$message.success(msg)
              setTimeout(_self.$router.back(), 500)
            })
            .catch(() => {
              _self.on_submit_loading = false
            })
        })
      }
    },
    components: {
      panelTitle
    }
  }
</script>
