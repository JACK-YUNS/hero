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
    <div class="panel-body" :data="entity_data">
      <div style="padding-bottom: 10px;"><span class="case" v-text="this.entity_data.type == 1 ? '案例分享':this.entity_data.type == 2 ?'话题讨论':'名家访谈' "></span><span class="caseword">{{this.entity_data.title}}</span><span class="casetime">发表于{{this.entity_data.aTime  | dateFormat}}</span></div>
      <div class="content">
        <template>
          <div class="components-container">
            <div class="editor-container">
              <UE :defaultMsg="this.entity_data.content"  :config=config ref="ue" aria-readonly="true"></UE>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="replay"><i class="el-icon-circle-check"></i><span>点赞 ({{this.entity_data.zanNum}})</span></div>
    <div class="panel-body">
      <div><span v-for="item in this.zanList_data">{{item.userName}}，&nbsp;&nbsp;</span></div>
    </div>
    <div class="replay"><i class="el-icon-star-off "></i><span>评论 ({{this.entity_data.commentNum}})</span></div>
    <div class="panel-body" style="height: 400px;overflow: auto">
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
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle} from 'components'
  import moment from "moment"
  import axios from 'axios';
  import ElCol from "element-ui/packages/col/src/col";
  import UE from '../../components/editor/ueditor.vue';


  export default{
    data(){
      return {
        defaultMsg: '这里是UE测试',
        config: {
          toolbars: [

          ],
          readonly:true,
          initialFrameWidth: '',
          initialFrameHeight: 350
        },

        title: '',
        type:'',
        timeout:  null,
//    	el: '#test',
        table_data: [],
        entity_data:[],
        zanList_data:[],
        //请求时的loading效果
        load_data: true,
        currentId:'',
        route_id: this.$route.params.id,
      }
    },
    components: {
      panelTitle,
      UE
    },
     computed: {

  },
    created(){
      this.get_table_data()
    },
    filters: {
      dateFormat:function(value) {
        return new Date(parseInt(value)).toLocaleString().replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, " ");
      }
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
        _self.$fetch.api_knowledge.getTopicComment({
          id: _self.route_id
        })
           .then(response => {
	          this.table_data = response.data.commentsList
            this.entity_data = response.data.entity
            this.zanList_data = response.data.zanList
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
      }
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
  .case{color: #007ACC;padding: 6px;background-color:#E8F2FF;font-size: 12px;}
  .caseword{font-size: 16px;font-weight: 500;color: #666666;margin-left: 10px}
  .casetime{font-size: 12px;color: #999999;float: right}
  .content{height:500px;overflow: auto;width: 98%}
  .replay{font-size: 16px; font-weight: 500;color: #666666;padding: 10px 0 10px 15px;border-bottom: 1px dotted #ccc;border-top: 15px solid #eff0f4}
  .replay span{margin-left: 10px}
</style>
