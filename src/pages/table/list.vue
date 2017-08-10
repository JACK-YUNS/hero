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
    <div class="panel-body" >
    	<div style="margin-bottom: 20px;">
    		<el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="请输入姓名查询"
				  @select="handleSelect"
				></el-autocomplete>
		    <el-date-picker
		      v-model="value1"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions0">
		    </el-date-picker>
				<el-date-picker
		      v-model="value2"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions1">
		    </el-date-picker>
				<el-button type="success">确定</el-button>
    	</div>
    	<div>
    		<div class="title">活动开展次数前五排行榜</div>
	      <el-table
	        :data="table_data"
	        v-loading="load_data"
	        element-loading-text="拼命加载中"
	        border
	        @selection-change="on_batch_select"
	        style="width: 100%;">
	        <!--<el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>-->
	        <el-table-column
	          prop="name"
	          label="名次"
	           width="80"
	          >
	        </el-table-column>
	        <el-table-column
	          prop="goodsId"
	          label="地区名称"
	         >
	          <!--<template scope="props">
	            <span v-text="props.row.sex == 1 ? '男' : '女'"></span>
	          </template>-->
	        </el-table-column>
	        <el-table-column
	          prop="goodsName"
	          label="开展次数"
	          width="200">
	        </el-table-column>
	      </el-table>
    	</div>
    	
    	<div>
    		<div class="title">签单数前五排行榜</div>
	      <el-table
	        :data="table_data"
	        v-loading="load_data"
	        element-loading-text="拼命加载中"
	        border
	        @selection-change="on_batch_select"
	        style="width: 100%;">
	        <!--<el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>-->
	        <el-table-column
	          prop="name"
	          label="名次"
	           width="80"
	          >
	        </el-table-column>
	        <el-table-column
	          prop="goodsId"
	          label="地区名称"
	         >
	          <!--<template scope="props">
	            <span v-text="props.row.sex == 1 ? '男' : '女'"></span>
	          </template>-->
	        </el-table-column>
	        <el-table-column
	          prop="goodsName"
	          label="签单数"
	          width="200">
	        </el-table-column>
	      </el-table>
    	</div>
    	
    	<div>
    		<div class="title">到场率前五排行榜</div>
	      <el-table
	        :data="table_data"
	        v-loading="load_data"
	        element-loading-text="拼命加载中"
	        border
	        @selection-change="on_batch_select"
	        style="width: 100%;">
	        <!--<el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>-->
	        <el-table-column
	          prop="name"
	          label="名次"
	           width="80"
	          >
	        </el-table-column>
	        <el-table-column
	          prop="goodsId"
	          label="地区名称"
	         >
	          <!--<template scope="props">
	            <span v-text="props.row.sex == 1 ? '男' : '女'"></span>
	          </template>-->
	        </el-table-column>
	        <el-table-column
	          prop="goodsName"
	          label="到场率"
	          width="200">
	        </el-table-column>
	      </el-table>
    	</div>
    	
    	<div>
    		<div class="title">签单率前五排行榜</div>
	      <el-table
	        :data="table_data"
	        v-loading="load_data"
	        element-loading-text="拼命加载中"
	        border
	        @selection-change="on_batch_select"
	        style="width: 100%;">
	        <!--<el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>-->
	        <el-table-column
	          prop="name"
	          label="名次"
	           width="80"
	          >
	        </el-table-column>
	        <el-table-column
	          prop="goodsId"
	          label="地区名称"
	         >
	          <!--<template scope="props">
	            <span v-text="props.row.sex == 1 ? '男' : '女'"></span>
	          </template>-->
	        </el-table-column>
	        <el-table-column
	          prop="goodsName"
	          label="签单率"
	          width="200">
	        </el-table-column>
	      </el-table>
    	</div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import axios from 'axios';

  export default{
    data(){
    	 
      return {
      	restaurants: [],
        state4: '',
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //每页显示多少条数据
        length: 15,
        //请求时的loading效果
        load_data: true,
        //批量选择数组
        batch_select: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
         value1: '',
          pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
         value2: ''
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
    	
            loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
          { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
          { "value": "钱记", "address": "上海市长宁区天山西路" },
          { "value": "壹杯加", "address": "上海市长宁区通协路" },
          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
          { "value": "浏阳蒸菜", "address": "天山西路430号" },
          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
          { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
          { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
          { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
          { "value": "阳阳麻辣烫", "address": "天山西路389号" },
          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
        ];
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
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
        this.load_data = false
        axios.get('http://jspang.com/DemoApi/oftenGoods.php')
		      .then(response => {
		        console.log(response)
		        this.table_data=response.data;
		      })
		      .catch(error => {
		//          console.log(error)
						this.load_data = false
		        alert('网络错误，不能访问')
		      })
//      this.$fetch.api_table.list({
//        page: this.currentPage,
//        length: this.length
//      })
//        .then(({data: {result, page, total}}) => {
//          this.table_data = result
//          this.currentPage = page
//          this.total = total
//          this.load_data = false
//        })
//        .catch(() => {
//          this.load_data = false
//        })
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
      //批量选择
      on_batch_select(val){
        this.batch_select = val
      },
      //批量删除
      on_batch_del(){
        this.$confirm('此操作将批量删除选择数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index) => {
            this.load_data = true
//          this.table_data=[];
            if(this.batch_select){
            	console.log(this.batch_select)
            	this.load_data = false;
            	this.table_data.splice(index, this.batch_select.length);
            }
//          this.$fetch.api_table.batch_del(this.batch_select)
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
       open4() {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '内容可以是 '),
            h('i', { style: 'color: teal' }, 'VNode')
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
    beforeMount: function () {
            this.updateCity();
            this.updateDistrict();
        },
        watch: {
            prov: function () {
                this.updateCity();
                this.updateDistrict();
            },
            city: function () {
                this.updateDistrict();
            }
        },
    mounted() {
      this.restaurants = this.loadAll();
    }
  }
</script>
<style scoped="scoped">
	.title{width: 100%;height: 60px;line-height: 60px;text-align: center;font-size: 18px;}
</style>