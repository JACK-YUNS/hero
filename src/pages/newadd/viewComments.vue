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
        <el-table
          :data="table_data"
          v-loading="load_data"
          element-loading-text="拼命加载中"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item v-for="(item,index) in  props.row.replyList">
                  <span v-show="item.replyType == '1'"><span class="wordtitle">{{item.fromUname}}</span> : {{item.content}} </span>
                  <span v-show="item.replyType == '2'"><span class="wordtitle">{{item.fromUname}}</span> 回复 <span class="spanword"> {{item.toUname}} </span> ： {{item.content}}</span>
                  <button class="elbtndel"  @click="delete_datareplyList(index,item.id)">删除</button>
                </el-form-item>

              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            prop="aTime"
            :formatter="dateFormat"
            width="120px"
            >
          </el-table-column>
          <el-table-column
            label="评论内容"
            prop="content">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120px"
           >
            <template scope="props">
              <el-button type="primary" size="small"  @click="delete_data(props.$index,props.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <bottom-tool-bar>
        <div slot="page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size=length
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
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){
      return {
        table_data: [],
        title: '',
        type:'',
        timeout:  null,
//    	el: '#test',
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 15,
        //请求时的loading效果
        load_data: true,
        route_id: this.$route.params.id,
        currentId:''
      }
    },
    components: {
      panelTitle,
      bottomToolBar
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
        _self.$fetch.api_knowledge.replayList({
          current: _self.currentPage,
          pageSize: _self.length,
          id: this.route_id
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

      //评论外部单个删除
      delete_data(item,id){
          var _self = this;
          _self.currentId = id;
          console.log(_self.currentId)
          _self.$confirm('此操作将删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then((id) => {
            _self.load_data = true;
            try{
                  _self.$fetch.api_knowledge.delComment ({id: _self.currentId})
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
      },
      //评论内部单个删除
      delete_datareplyList(item,id){
        var _self = this;
        _self.Id = id
        _self.item = item
        console.log(_self.replyList)
        _self.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((id) => {
          _self.load_data = true;
        try{
          _self.$fetch.api_knowledge.delReply({id: _self.Id})
            .then(response => {
            if(response.code == 200){
            _self.$message({
              type: 'success',
              message: '删除成功'
            });
           this.get_table_data()
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
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },
    }
  }
</script>
<style scoped="scoped">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 95%;
    position: relative;
  }
  .spanword{
    font-size: 14px;
    color: #999999;
  }
  .wordtitle{
    font-size: 14px;
    color: #5c7acd;
  }
  .elbtndel{
    padding: 7px 9px;
    font-size: 12px;
    border-radius: 4px;
    position: absolute;
    right: -4.8%;
    bottom: 0px;
    color: #fff;
    background: #ff6d6d;
    border-color: #ff6d6d;
    box-sizing: border-box;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    outline: 0;
    text-align: center;
    text-transform: none;
  }
  .el-form--inline .el-form-item__content{
    position: inherit;
  }
</style>
