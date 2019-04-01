<template>
  <div>
    <div class="head-c">
      <span class="bread-item">积分流水</span>
    </div>
    <div class="content">
      <div class="panel"><!-- form重置 -->
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 60px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">用户昵称:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect1" v-on:selUser="setConditionUser"></userSelect>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">变更时间:</span>
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
      <div class="panel" v-loading="loading">
        <div class="p-t p-t2">
          <div class="name">
            <span>数据列表</span>
          </div>
        </div>
        <div >
          <table class="comTb">
            <tr>
              <th>用户昵称</th>
              <th>用户账号</th>
              <th>积分变更方式</th>
              <th>积分变更时间</th>
              <th style="text-align:left;width:100px;">积分</th>
              <th>描述</th>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>{{item.username}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.stype}}</td>
              <td>{{item.addtime}}</td>
              <td style="text-align:left">
                <div class="red" v-if="item.check">{{item.score}}</div>
                <div class="green" v-else>+{{item.score}}</div>
              </td>
              <td>{{item.pname}}</td>
            </tr>
          </table>
        </div>
        <div class="p-f">
          <div class="page">
            <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="getData"></routerPaging>
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
  import userSelect from '@/components/child-components/selector-components/user'

  export default {
    name: 'TaskList',
    components: {
      routerPaging,
      userSelect
    },
    data() {
      return {
        loading: true,
        list: [],
        str: '-234',
        searchCondition: {
          conditions: {
            username: '',
            rankType: '',
            phone: '',
            name: '',
            startTime: '',
            endTime: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        rankTypeOptions: [
          {value: '1', label: '电信积分'},
          {value: '2', label: 'INT积分'}
        ]
      }
    },
    created (){
      this.getData(1)
    },
    mounted (){
      this.setDateTimePick()
    },
    methods: {
      setConditionUser (user) {
        this.searchCondition.conditions.username = user.value
      },
      getData (val) {
        var that = this
        that.loading = true
        var reg = /-/
        that.searchCondition.page.page = val
        var param = that.searchCondition
        // 添加请求头
        axios.post(api.api.score.water, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              item.check = reg.test(item.score);
              item.addtime = util.getDateDiff(item.addtime);
              item.score = util.thousand(item.score);
            })
            that.searchCondition.page.totalSize = response.data.count
          }
          that.loading = false;
        })
      },
      reSearch () {
        this.$refs.devListPager.init()
        this.getData(1);
      },
      reset () {
        this.searchCondition = {
          conditions: {
            username: '',
            rankType: '',
            phone:'',
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
        this.$refs.devListPager.init()
        this.$refs.userSelect1.delItem()
        this.$refs.userSelect2.delItem()
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
  .pi {
    max-height: 100px;
  }

  div.content {
    text-align: left;
  }

</style>
