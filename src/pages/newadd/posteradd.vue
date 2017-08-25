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
            <el-form-item label="类型：">
					    <el-radio-group v-model="form.resource">
					      <el-radio label="理念"></el-radio>
					      <el-radio label="问候"></el-radio>
					      <el-radio label="励志"></el-radio>
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
            <el-form-item label="是否首页展示：">
					    <el-radio-group v-model="form.choose">
					      <el-radio label="">是</el-radio>
					      <el-radio label="否"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item label="是否首页展示：">
					    <el-radio-group v-model="form.select">
					      <el-radio label="1">不推荐</el-radio>
					      <el-radio label="2">推荐</el-radio>
					    </el-radio-group>
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
          subhead: '',
          age: 20,
          type: [],
          desc: '',
          resource:'',
          choose:'',
          select:'',
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
      this.route_id 
      console.log(this.route_id)
      if(this.route_id>0){
      	this.get_form_data();
      	console.log(this.route_id)
      }
    },
    methods: {
      //获取数据
      get_form_data(){
        this.load_data = true
        this.$fetch.api_wechat.findPosterById({
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
    }
  }
</script>
