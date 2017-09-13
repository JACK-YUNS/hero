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
      <div><span>案例分析</span><span>家庭健康托管计划提高效率  助您批量销售家庭保单 </span><span>发表于2017-08-28 12:45:00</span></div>
      <div>
        <img>
        <div>
          设想一下自己签过的保单，当没有家庭健康保障理念时，签了家里的第一张保单，再收第二张就非常难。但当与客户沟通了家庭健康保单理念后，哪怕一张一张签，再收单也非常容易，再收第三张就更容易。所以要把家庭健康托管理念植入客户心里，不管客户要给谁买，都要讲家庭健康托管的理念。
        </div>
      </div>
    </div>
    <div class="panel-body">
      <el-table
        :data="table_data"
        height="250"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        style="width: 100%;">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          label="内容"
          prop="title"
          >
        </el-table-column>
        <el-table-column
          prop="aTime"
          :formatter="dateFormat"
          label="时间"
          width="120">
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
          >
          <template scope="props">
            <el-button type="text" size="small"  @click="delete_data(props.$index,props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle} from 'components'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){
      return {
        title: '',
        type:'',
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //请求时的loading效果
        load_data: true,
        currentId:''
      }
    },
    components: {
      panelTitle
    },
     computed: {

  },
    created(){
      this.get_table_data()
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

      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = false
        _self.$fetch.api_wechat.templateList({
          title: _self.title,
          type : _self.type
        })
           .then(response => {
	          this.table_data = response.data.records
	          this.load_data = false
	        })
          .catch(() => {
            this.load_data = false
          })
      },

      //单个删除
      delete_data(item,id){
          var _self = this;
          _self.currentId = id;
          _self.$confirm('此操作将删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then((id) => {
            _self.load_data = true;
            try{
                  _self.$fetch.api_wechat
                    .delTemplate({id: _self.currentId})
                    .then(response => {
                    if(response.code == 200){
                      _self.$message({
                        type: 'success',
                        message: '删除成功'
                      });
                      _self.table_data.splice(item, 1);
                      _self.load_data = false;
                    }
                  })
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
          })
          .catch(() => {
          })
      }
    }
  }
</script>
<style scoped="scoped">
 .el-select{margin-bottom: 10px;}
 .el-autocomplete{margin-bottom: 10px;}
  .link-type{color: #007ACC;}
</style>
