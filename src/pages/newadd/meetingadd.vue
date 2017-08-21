<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body"
         v-loading="load_data"
         element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="18">
          <el-form ref="form" :model="form">
            <el-form-item  prop="name">
            	<p>选择早会日期</p>
              <el-button type="primary" :disabled="true">7月31日</el-button>
              <el-button type="primary" :disabled="true">8月1日</el-button>
              <el-button type="primary">8月2日</el-button>
              <el-button>8月3日</el-button>
              <el-button>8月4日</el-button>
              <el-button>8月5日</el-button>
              <el-button>8月6日</el-button>
            </el-form-item>
           <el-form-item  :model="form">
            	<p>添加流程<span class="rull">每个环节名称不超过14个汉字</span></p>
              <el-form-item label="1" prop="name">
	              <el-input v-model="form.name" placeholder="太平之歌" style="width: 300px;"></el-input>
	            </el-form-item>
	            <el-form-item label="2" prop="subname">
	              <el-input v-model="form.subname" placeholder="出勤通报" style="width: 300px;"></el-input>
	            </el-form-item>
	            <el-form-item label="3" prop="subname">
	              <el-input v-model="form.subname" placeholder="蓄客播报" style="width: 300px;"></el-input>
	            </el-form-item>
	            <el-form :inline="true" :model="form" class="demo-form-inline">
						  <el-form-item label="4">
						    <el-input v-model="form.user" placeholder="请输入第四个环节" style="width: 300px;"></el-input>
						  </el-form-item>
						  <el-form-item>
						   <el-button type="success" icon="plus" size="primary">添加流程节点</el-button>
						  </el-form-item>
						</el-form>
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
          user: '',
          age: 20,
          type: [],
          desc: '',
           user: '',
          resource:'',
          num: 1,
          choose:'',
          select:'',
          birthday: this.$dateFormat(new Date, "yyyy-MM-dd"),
          address: null,
          zip: 412300
        },
        formInline: {
          user: '',
          region: ''
        },
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false
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
    }
  }
</script>
<style scoped="scoped">
	.rull{font-size: 12px;color: #ccc;margin-left: 5px;}
</style>