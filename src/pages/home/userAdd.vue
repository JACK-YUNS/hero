<template>
  <imp-panel :title="form.id ? '编辑':'新增用户'">
    <el-form ref="form" :rules="rules" :model="form" label-width="180px">
      <el-form-item label="登录用户名" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pswd">
        <el-input  v-model="form.pswd"></el-input>
      </el-form-item>
      <!--<el-form-item label="状态">-->
        <!--<el-radio-group v-model="form.status">-->
          <!--<el-radio :label="0">未激活</el-radio>-->
          <!--<el-radio :label="1">已激活</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item prop="areaName">
        <el-select v-model="form.areaName"  placeholder="请选择所属区">
          <el-option
            v-for="item in areas"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onSubmit" v-if="form.id">保存</el-button>
        <el-button type="primary" @click="onSubmit" v-else>立即创建</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

  export default {
    components: {
      ElFormItem,
      'imp-panel': panel
    },
    data(){
      var validateName=(rule, value, callback)=>{
          var _self = this;
        if (!value) {
          return callback(new Error('姓名不能为空'));
        }
          if (value.length<3 || value.length>15) {
            callback(new Error('长度在 3 到 15'));
          } else {
            var flag = false;
            if(_self.userName == value){
              callback();
            }else{
              this.$fetch.api_system.checkUUser({"nickName": value})
                .then(response => {
                  flag = response.data;
                })
                .catch(() => {

                })
              setTimeout(() => {
                if (flag) {
                  callback(new Error('用户已存在'));
                } else {
                  callback();
                }
              },1000);
            }

          }
      };
      return {
        route_id:this.$route.query.id,
        form: {
          id: null,
          nickname: '',
          pswd:'',
          email: '',
          status: 1,
          areaName:''
        },
        userName:'',
        areas:[],
        rules:{
          nickname:[
              {validator:validateName,trigger:'blur'}
            ],
          pswd:[
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
          ],
          areaName: [
            { required: true, message: '请选择所属区域', trigger: 'change' }
          ]

        }
      }
    },
    created(){
      var _self = this;
      if(_self.route_id > 0){
        _self.form.id = _self.route_id;
        _self.get_form_data();
      }
      _self.get_area_data();
    },
    methods: {
      get_form_data(){
          var _self = this;
        _self.$fetch.api_system.queryUUserById({id:_self.form.id})
          .then(response => {
              _self.form.nickname = response.data.nickname;
              _self.form.id = response.data.id;
              _self.form.pswd = response.data.pswd;
              _self.form.areaName = response.data.areaName;
              _self.userName = response.data.nickname;
          })
          .catch(() => {

          })
      },
      get_area_data(){
          var _self = this;
        _self.$fetch.api_system.selectArea({})
          .then(response => {
              _self.areas.push({value:"管理员",label:"管理员"});
              for(var i = 0;i<response.data.length;i++){
                _self.areas.push({value:response.data[i],label:response.data[i]})
              }
          })
          .catch(() => {
          })
      },
      onSubmit(){
          var _self = this;
        _self.$refs.form.validate((valid) => {
          if (!valid)return false;
          _self.$fetch.api_system.addUUser(_self.form)
            .then(({msg}) => {
              this.$confirm('操作成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.go(-1);
            })
            })
            .catch(() => {

            })
        });
      }
    }
  }
</script>
