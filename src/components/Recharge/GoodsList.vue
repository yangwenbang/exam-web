<template>
  <div>
    <div class="head-c">
      <span class="bread-item">商品列表</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">商品编号:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.id">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">商品名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.name">
                  </div>
                </div>
              </div>

              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">添加时间:</span>
                  </div>
                  <div class="fca">
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker" v-model="searchCondition.conditions.startTime">
                    </div>
                    <div class="f2">
                      <a class="ct"></a>
                    </div>
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker2" v-model="searchCondition.conditions.endTime">
                    </div>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">商品状态:</span>
                  </div>
                  <div class="fca">
                  <!--  <input class="cin" type="text" v-model="searchCondition.conditions.enable">-->
                    <el-select v-model="searchCondition.conditions.enable" clearable placeholder="请选择">
                      <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="b">
                <input type="button" class="btn btn-primary" value="查询" @click="reSearch">
                <input type="button" class="btn btn-primary" value="重置" @click="reset">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>数据列表</span>
          </div>
          <div class="tools">
            <div class="t-r">
              <span @click="goToAdd">添加商品</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
               <!-- <th>编号</th>-->
                <th>商品图片</th>
                <th>商品名称</th>
                <th>添加时间</th>
                <th>积分类型</th>
                <th>积分价格</th>
                <th>RMB</th>
                <th>状态</th>
                <th>库存</th>
                <th>销量</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in list" :key="item.id">
              <!--  <td>{{item.id}}</td>-->
                <td>
                  <div class="pi-c">
                    <img class="pi" :src="item.imgPath"/>
                  </div>
                </td>
                <td>{{item.name}}</td>
                <td>{{item.modifyTime}}</td>
                <td>{{item.rankType}}</td>
                <td>{{item.score}}</td>
                <td>{{item.rmb}}</td>
                <td>
                  <span v-if="item.enable" style="color: #1abc9c;">使用中</span>
                  <span v-if="!item.enable" style="color:#f00;">已下架</span>
                </td>
                <td>{{item.stock}}</td>
                <td>{{item.volume}}</td>
                <td>
                  <span class="operate" v-if="item.enable" @click="enableProduct(item.id,item.enable)">下架</span>
                  <span class="operate" v-if="!item.enable" @click="enableProduct(item.id,item.enable)"> 上架</span>
                  <!--<span class="operate" @click="exchange(item)">兑换</span>-->
                  <span class="operate" @click="goToUpd(item.id)">编辑</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging :total='searchCondition.page.totalSize' v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import routerPaging from '@/components/child-components/page-components/paging'
  import api from '../../config/apiConfig'

  export default {
    name: 'GoodsList',
    components: {
      routerPaging
    },
    data() {
      return {
        loading: true,
        list: [],
        searchCondition: {
          conditions: {
            enable: '',
            id: '',
            name: '',
            startTime: '',
            endTime: '',
            flag:true
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        product: {
          id: '',
          enable: ''
        } ,enableOptions: [
          {value: '1', label: '使用中'},
          {value: '0', label: '已下架'}
        ]
      }
    },
    created() {
      this.getData(1)
    },
    mounted (){
      this.setDateTimePick()
    },
    methods: {
      getData: function (val) {
        var that = this
        that.loading = true
        that.searchCondition.page.page = val
        var param = that.searchCondition
        axios.post(api.api.product.list, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              item.score = util.thousand(item.score);
              item.modifyTime = util.getDateDiff(item.modifyTime);
              if (item.rankType == "1") {
                item.rankType = "电信积分类型";
              } else {
                item.rankType = "int积分类型";
              }
            })
            that.searchCondition.page.totalSize = response.data.count
            that.loading = false;
          }
        })
      },
      goToAdd: function () {
        window.location.href = '/#/recharge/addgoods'
      },
      goToUpd: function (id) {
        window.location.href = '/#/recharge/updgoods?id=' + id
      },
      enableProduct: function (id, state) {
        var that = this;
        var param = that.product;
        param.id = id;
        param.enable = state;
        if (param.enable) {
          util.confirmDoWithTitle("下架", "是否下架？",()=>{
            aPost()
          })
        } else {
          util.confirmDoWithTitle("上架", "是否上架？",()=>{
            aPost()
          })
        }
        function aPost() {
          axios.post(api.api.product.enable, param).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              that.getData(that.searchCondition.page.page);
            } else {
              util.alert(response.message)
            }
          })
        }
      },
      reSearch() {
        this.getData(1)
      },
      reset() {
        this.searchCondition = {
          conditions: {
            enable: '',
            id: '',
            name: '',
            startTime: '',
            endTime: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        };
        this.getData(1)
      },
      setDateTimePick () {
        var that = this
        $('#datetimepicker').datetimepicker({
          format: 'Y-m-d', //格式化日期
          timepicker: false, //关闭时间选项
          yearStart: 1990, //设置最小年份
          yearEnd: 2050, //设置最大年份
          todayButton: true,
          scrollMonth: false,
          scrollTime: false,
          scrollInput: false,
          closeOnInputClick: true
        }).on('change', function (picker) {
          that.searchCondition.conditions.startTime = picker.currentTarget.value
        })
        $('#datetimepicker2').datetimepicker({
          format: 'Y-m-d', //格式化日期
          timepicker: false, //关闭时间选项
          yearStart: 1990, //设置最小年份
          yearEnd: 2050, //设置最大年份
          todayButton: true
          //关闭选择今天按钮);
        }).on('change', function (picker) {
          that.searchCondition.conditions.endTime = picker.currentTarget.value
        })
        $.datetimepicker.setLocale('ch')
      }
    }
  }
</script>

<style scoped>
  .pi-c {
    margin: 10px;
  }

  .pi {
    width: 100px;
    height: 50px;
  }

  div.content {
    text-align: left;
  }

</style>
