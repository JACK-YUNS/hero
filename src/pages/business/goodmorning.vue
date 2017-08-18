<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <router-link :to="{name: 'tableAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">添加数据</el-button>
      </router-link>
    </panel-title>
    <div class="panel-body">
			<router-link :to="{name: 'meetingAdd'}" tag="span">
        <el-button type="success" icon="plus" size="primary" style="margin-bottom: 20px;">添加早会</el-button>
      </router-link>
      <el-table
        :data="table_data"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        style="width: 100%;">
        
        <el-table-column type="expand">
		      <template scope="props">
		        <el-form label-position="left" inline class="demo-table-expand">
		        	<el-steps :space="40" direction="vertical">
							  <el-step title="太平之歌"></el-step>
							  <el-step title="考勤汇报"></el-step>
							  <el-step title="储客播报"></el-step>
							  <el-step title="如何快速增员"></el-step>
							  <el-step title="政令宣导"></el-step>
							</el-steps>
							<el-button type="primary"   @click="open4" prop="do" style="float: right;margin-top: -5%;">复制添加</el-button>
		          <!--<el-form-item label="商品名称">
		            <span>{{ props.row.name }}</span>
		          </el-form-item>
		          <el-form-item label="所属店铺">
		            <span>{{ props.row.shop }}</span>
		          </el-form-item>
		          <el-form-item label="商品 ID">
		            <span>{{ props.row.id }}</span>
		          </el-form-item>
		          <el-form-item label="店铺 ID">
		            <span>{{ props.row.shopId }}</span>
		          </el-form-item>
		          <el-form-item label="商品分类">
		            <span>{{ props.row.category }}</span>
		          </el-form-item>
		          <el-form-item label="店铺地址">
		            <span>{{ props.row.address }}</span>
		          </el-form-item>
		          <el-form-item label="商品描述">
		            <span>{{ props.row.desc }}</span>
		          </el-form-item>-->
		        </el-form>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="时间"
		      prop="id">
		    </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          >
          <template scope="props">
            <el-button type="info" size="small" icon="edit" @click="open4" prop="do">编辑</el-button>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index, props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import {port_wechat} from 'common/port_uri'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){
    	 
      return {
        table_data: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
      
        length: 15,
        //请求时的loading效果
        load_data: true,
        //批量选择数组
        batch_select: [],
        
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
        this.load_data = false
//      axios.get('http://jspang.com/DemoApi/oftenGoods.php')
//		      .then(response => {
//		        console.log(response)
//		        this.table_data=response.data;
//		      })
//		      .catch(error => {
//		//          console.log(error)
//						this.load_data = false
//		        alert('网络错误，不能访问')
//		      })
        this.$fetch.api_wechat.articleList({
          pageSize: this.length
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
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },
       open4() {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '确定要取消模板吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: '更改成功'
          });
        });
      }
    },
    mounted() {
     
    }
  }
</script>
<style scoped="scoped">
 .el-select{margin-bottom: 10px;}
 .el-autocomplete{margin-bottom: 10px;}
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
    width: 50%;
  }
</style>