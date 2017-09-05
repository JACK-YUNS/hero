<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <!--<el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <router-link :to="{name: 'tableAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">添加数据</el-button>
      </router-link>-->
    </panel-title>
    <div class="panel-body">
    	<el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item>
          <el-select v-model="formInline.isTop" placeholder="首页">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-select v-model="formInline.areaName" placeholder="筛选 — 区">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.deptName" placeholder="筛选 — 部">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.groupName" placeholder="筛选 — 组">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.gradeLevel" placeholder="筛选 — 职级">
            <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.userName" placeholder="请输入姓名查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.mobile" placeholder="请输入手机号查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.agentCode" placeholder="请输入工号查询"></el-input>
        </el-form-item>
        <el-form-item>
					<el-col>
						<el-date-picker type="date" placeholder="入职开始时间" v-model="formInline.companyDate" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-col>
						<el-date-picker type="date" placeholder="入职结束时间" v-model="formInline.date2" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit" :loading="on_submit_loading">确定</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="table_data"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        border
        style="width: 100%;">
        <!--<el-table-column
          type="selection"
          width="55">
        </el-table-column>-->
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          label="姓名"
          width="100"
          >
          <template scope="props">
           	<router-link :to="{name: 'personlist',params: {id: props.row.id,userName:props.row.userName,agentCode:props.row.agentCode,gradeLevel:props.row.gradeLevel}}" tag="span">
			        <span class="link-type">{{props.row.userName}}</span>
			      </router-link>
	        </template>
        </el-table-column>
        <el-table-column
          prop="agentCode"
          label="工号"
          width="130"
         >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="130">
        </el-table-column>
        <el-table-column
          prop="area.areaName"
          label="所在区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="area.deptName"
          label="所在部"
          width="120">
        </el-table-column>
        <el-table-column
          prop="area.groupName"
          label="所在组">
        </el-table-column>
        <el-table-column
          prop="gradeLevel"
          label="职级">
          <template scope="props">
            <span v-text="props.row.gradeLevel == 01 ? '降级试用业务员代表' : props.row.gradeLevel == 02 ?'试用业务员':props.row.gradeLevel == 03 ?'正式业务员':props.row.gradeLevel == 04 ?'业务主任':props.row.gradeLevel == 05 ?'业务经理一级':props.row.gradeLevel == 06 ?'业务经理二级':props.row.gradeLevel == 07 ?'高级经理一级':'区域总监'"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyDate"
          :formatter="dateFormat"
          label="入职时间">
        </el-table-column>
        <el-table-column
          label="密码重置"
          width="130"
          >
          <template scope="props">
            <el-button type="info" size="small" icon="edit" @click="">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <bottom-tool-bar>
        <div slot="page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="length"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </bottom-tool-bar>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import axios from 'axios';
  import {port_user, port_code} from 'common/port_uri'
  import moment from "moment"


  export default{
    data(){

      return {
      	formInline: {
          areaName: '',
          deptName: '',
          groupName: '',
          gradeLevel: '',
          userName:'',
          mobile:'',
          agentCode:'',
          companyDate:'',
          date2:''
        },
        options:[
          {
            value: '',
            label: '全部'
          }, {
            value: '1',
            label: '保险理念'
          }, {
            value: '2',
            label: '励志成长'
          }, {
            value: '3',
            label: '生活锦囊'
          }, {
            value: '4',
            label: '轻松一刻'
          }
        ],
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 20,
        //请求时的loading效果
        load_data: true,
        on_submit_loading:false,
        //批量选择数组
        batch_select: [],
        value: ''
      }
    },
    components: {
      panelTitle,
      bottomToolBar
    },
     computed: {

  },
    created(){
    	var _self = this;
      _self.get_table_data()
    },
    methods: {
      //时间格式化
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
      handleSelect(item) {
        console.log(item);
      },

      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
      	 var _self = this;
        _self.load_data = false
     	  _self.$fetch.api_table.list({
	        current: _self.currentPage,
	        pageSize: _self.length,
	        title:_self.formInline.title,
	        assortmentType:_self.formInline.assortmentType,
	        templateId:_self.formInline.templateId,
	        isTop:_self.formInline.isTop
	      })
	        .then(response => {

	          this.table_data = response.data.records
	          this.currentPage = response.data.current
	          this.total = response.data.total
	          this.load_data = false

	        })
	        .catch(() => {
	          this.load_data = false
	        })
      },

      //单个删除
      delete_data(item){
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index, row) => {
            this.load_data = true;
            try{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.table_data.splice(index, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
//          this.$fetch.api_table.del(item)
//            .then(({msg}) => {
//              this.get_table_data()
//              this.$message.success(msg)
//            })
//            .catch(() => {
//            })
          })
          .catch(() => {
          })
      },
      onSubmit(){
      	this.get_table_data();
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      }
    },

    mounted() {
    }
  }
</script>
<style scoped="scoped">
 .el-select{margin-bottom: 10px;}
 .el-autocomplete{margin-bottom: 10px;}
 .link-type{color: #007ACC;}
</style>
