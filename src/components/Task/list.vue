<template>
  <div>
    <div class="head-c">
      <span class="bread-item">任务列表</span>
    </div>
    <div class="content">
      <div class="panel"><!-- form重置 -->
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">任务名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.name">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">制定时间:</span>
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
                    <span class="ct">制定人:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
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
              <span @click="goToAdd">添加任务</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>任务名称</th>
                <th>积分类型</th>
                <th style="text-align: left">获取积分</th>
                <th>状态</th>
                <th>制定人</th>
                <th>制定时间</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in list" :key="item.id">
                <td>{{item.name}}</td>
                <td>{{item.rankType}}</td>
                <td style="text-align: left">{{item.rank}}</td>
                <td>
                  <span v-if="item.isEnble" style="color: #1abc9c;">使用中</span>
                  <span v-if="!item.isEnble" style="color:#f00;">已下架</span>
                </td>
                <td>{{item.username}}</td>
                <td>{{item.modifyTime}}</td>
                <td>
                  <!--<span class="operate" @click="goToAddUserTask(item)">添加用户任务</span>-->
                  <span class="operate" @click="goToUpd(item)">编辑</span>
                <!--  <span class="operate" @click="goToDel(item)">删除</span>-->

                  <span class="operate" v-if="item.isEnble" @click="goToDel(item)">禁用</span>
                  <span class="operate" v-else @click="goEnable(item)">启用</span>
                </td>
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
      searchCondition: {
        conditions: {
          username: '',
          name: '',
          rankType: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      taskid: {
        id: ''
      },
      rankTypeLst: [
        {id: '1', name: '电信积分'},
        {id: '2', name: 'INT积分'}
      ]
    }
  },
  created () {
    this.getData(1)
  },
  mounted () {
    this.setDateTimePick()
  },
  methods: {
    setConditionUser (user) {
      this.searchCondition.conditions.username = user.value
    },
    getData (val) {
      var that = this
      that.loading = true
      that.searchCondition.page.page = val
      var param = that.searchCondition
      // 添加请求头
      axios.post(api.api.task.list, param).then(response => {
        if (response.data.bresult) {
          that.list = response.data.object
          that.list.forEach(function (item) {
            item.modifyTime = util.getDateDiff(item.modifyTime);
            item.rank = util.thousand(item.rank);
            if (item.rankType === 1) {
              item.rankType = '电信积分';
            } else {
              item.rankType = 'INT积分';
            }
          })
          that.searchCondition.page.totalSize = response.data.count
          that.loading = false
        }
      })
    },
    goToAdd: function () {
      window.location.href = '/#/task/add'
    },
    goToUpd: function (param) {
      window.location.href = '/#/task/update?id=' + param.id
    },
    // goToAddUserTask: function (param) {
    //   window.location.href = '/#/task/addusertask?tid=' + param.id + "&rankType=" + param.rankType;
    // },
    goToDel: function (data) {
      if (data.isEnble) {
        var that = this;
        var param = that.taskid;
        param.id = data.id;
        util.confirmDoWithTitle('禁用', '是否禁用？', function () {
          axios.post(api.api.task.del, param).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              that.getData(that.searchCondition.page.page);
            } else {
              util.alert(response.message)
            }
          })
        })
      } else {
        util.alert('该任务已禁用，无法再次禁用');
      }
    },
    goEnable: function (data) {
      if (!data.isEnble) {
        var that = this;
        var param = that.taskid;
        param.id = data.id;
        util.confirmDoWithTitle('启用', '是否启用？', function () {
          axios.post(api.api.task.enable, param).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              that.getData(that.searchCondition.page.page);
            } else {
              util.alert(response.message)
            }
          })
        })
      } else {
        util.alert('该任务已启用');
      }
    },
    reSearch () {
      this.$refs.devListPager.init()
      this.getData(1);
    },
    reset () {
      this.searchCondition = {
        conditions: {
          username: '',
          name: '',
          rankType: '',
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
      this.$refs.userSelect.delItem()
      this.getData(1)
    },
    setDateTimePick () {
      var that = this
      $('#datetimepicker').datetimepicker({
        format: 'Y-m-d', // 格式化日期
        timepicker: false, // 关闭时间选项
        yearStart: 1990, // 设置最小年份
        yearEnd: 2050, // 设置最大年份
        todayButton: true,
        scrollMonth: false,
        scrollTime: false,
        scrollInput: false,
        closeOnInputClick: true
      }).on('change', function (picker) {
        that.searchCondition.conditions.startTime = picker.currentTarget.value
      })
      $('#datetimepicker2').datetimepicker({
        format: 'Y-m-d', // 格式化日期
        timepicker: false, // 关闭时间选项
        yearStart: 1990, // 设置最小年份
        yearEnd: 2050, // 设置最大年份
        todayButton: true
        // 关闭选择今天按钮);
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
