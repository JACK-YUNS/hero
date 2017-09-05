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

            <el-form-item label="内容：">
					    <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.contents"></el-input>
					  </el-form-item>


					  </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="sort" style="width: 200px;"></el-input>
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
          titile: '',
          contents: '',
        	dialogVisible:true,
          sort:''
        },
        sort:'',
        route_id: this.$route.params.id,
        load_data: false,
        on_submit_loading: false,
        rules: {
          name: [{required: true, message: '主标题不能为空', trigger: 'blur'}]
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

        this.$fetch.api_wechat.findImageById({
          id: this.route_id
        })
          .then(response => {
            this.form = response.data

            var sort = this.form.sort
            var myDate=new Date('2020-01-01 00:00:00')
            var sortnum = sort - myDate.getTime()
            if(sort < myDate.getTime()){
              this.sort=0
            }else if(sort == null){
              this.sort=0
            }else{
              this.sort = sortnum
            }
            var picArr = JSON.parse(this.form.pics);
          	var arr =[];
            $.each(picArr, function(index, value, array) {
						  arr.push({
			          url: value.pic,
			          status: 'finished'
			        });
						});
						this.fileList = arr;
            this.load_data = false
            console.log(this.fileList)
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
          var myDate=new Date('2020-01-01 00:00:00')
          this.form.sort = parseInt(this.sort)+myDate.getTime();
          this.$fetch.api_wechat.saveImage(this.form)
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
