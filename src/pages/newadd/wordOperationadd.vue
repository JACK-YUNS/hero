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
              <el-input v-model="form.title" placeholder="请输入内容（最多30字）" style="width: 500px;" :maxlength=30></el-input>
            </el-form-item>

            <el-form-item label="内容："  prop="content">
              <el-input type="textarea"  v-model="form.content" placeholder="请输入内容（最多500字）" :autosize="{ minRows: 8, maxRows: 12}" :maxlength=500></el-input>
            </el-form-item>

            <el-form-item label="排序：">
              <el-input-number v-model="form.sort"  :min="0"  :maxlength=5 ></el-input-number>
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
  import {port_qiniu} from 'common/port_uri'
  export default{
    data(){
      return {
        form: {
          content: '',
          sort:'',
          flag:''
        },
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false,
        rules: {
          title: [{required: true, message: '主标题不能为空', trigger: 'blur'}],
          content: [{required: true, message: '内容不能为空', trigger: 'blur'}]
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
        this.$fetch.api_verbal.details({
          id: this.route_id
        })
          .then(response => {
          this.form = response.data
        this.load_data = false
      })
      .catch(() => {
          this.load_data = false
      })
      },

      //提交
      on_submit_form(){

        this.$refs.form.validate((valid) => {
          if (!valid) return false
        this.on_submit_loading = true
        this.form.flag=0
        this.$fetch.api_verbal.saveVerbal(this.form)
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
  .el-upload__input {
    display: none!important;
  }

</style>
