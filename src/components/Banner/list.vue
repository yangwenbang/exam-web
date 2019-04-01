<template>
  <div>
    <div class="head-c">
      <span class="bread-item">Banner维护</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2 clearfix">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">标题:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.title">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">状态:</span>
                  </div>
                  <div class="fca">
                    <el-select v-model="searchCondition.conditions.isenable" clearable placeholder="请选择">
                      <el-option v-for="item in enableOptions" :key="item.value" :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">添加人:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
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
        <div class="p-t p-t2 clearfix">
          <div class="name"><span>数据列表</span></div>
          <div class="tools">
            <div class="t-r">
              <span @click="goToAddCard">添加Banner</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th style="text-align: left;"><span style="margin-left: 20px;">图片</span></th>
                <th>更新时间</th>
                <th>添加人员</th>
                <th>Banner状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in Lst" :key="item.id">
                <td style="text-align: left;height: 100px;">
                  <div class="pc">
                    <div class="c">
                      <img class="pi" :src="item.imgpath">
                      <div class="t"><span>{{item.title}}</span></div>
                    </div>
                  </div>
                </td>
                <td><span>{{item.lastupdatetime}}</span></td>
                <td><span>{{item.username}}</span></td>
                <td :class="{dg : !item.isenable} ">{{item.isenable ? '已启用' : '已禁用'}}</td>
                <td>
                  <span v-if="!item.istop" class="operate" @click="setTop(item)">去置顶</span>
                  <span v-if="item.istop" class="operate" @click="notTop(item)">取消置顶</span>
                  <router-link tag="span" class="operate" :to="item.url">修改</router-link>
                  <span class="operate" v-if="item.isenable" @click="Bdisable(item.id)">禁用</span>
                  <span class="operate" v-else @click="Benable(item.id)">启用</span>
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
    components: {
      routerPaging,
      userSelect
    },
    name: 'BannerLst',
    data () {
      return {
        loading: true,
        Lst: [],
        searchCondition: {
          conditions: {
            title: '',
            username: '',
            isenable: '',
            startTime: '',
            endTime: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        enableOptions: [
          {value: '1', label: '启用'},
          {value: '0', label: '禁用'}
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
      getData: function (val) {
        var that = this
        that.loading = true
        that.searchCondition.page.page = val
        var param = that.searchCondition
        // 添加请求头
        axios.post(api.api.banner.list, param).then(response => {
          if (response.data.bresult) {
            that.Lst = response.data.object
            that.Lst.forEach(function (item) {
              item.lastupdatetime = util.getDateDiff(item.lastupdatetime)
              item.url = '/banner/modify/' + item.id
            })
            that.searchCondition.page.totalSize = response.data.count
          }
          that.loading = false;
        })
      },
      goToAddCard: function () {
        window.location.href = '/#/banner/add'
      },
      setTop: function (item) {
        var param = {id: item.id}
        var that = this
        // 添加请求头
        axios.post(api.api.banner.setTop, param).then(response => {
          if (response.data.bresult) {
            that.getData(1)
          } else {
            util.alert(response.data.message)
          }
        })
      },
      notTop (item) {
        var param = {id: item.id}
        var that = this
        // 添加请求头
        axios.post(api.api.banner.notTop, param).then(response => {
          if (response.data.bresult) {
            that.getData(1)
          }
        })
      },
      Bdisable (index) {
        var that = this
        var param = {id: +index}
        util.confirmDoWithTitle('禁用', '是否禁用？', function () {
          axios.post(api.api.banner.disable, param).then(response => {
            var data = response.data
            if (data.bresult) {
              util.alertdo('禁用成功！', function () {
                that.getData(that.searchCondition.page.page)
              })
            } else {
              util.alert(data.object)
            }
          })
        })
      },
      Benable (index) {
        var that = this
        var param = {id: +index}
        util.confirmDoWithTitle('启用', '是否启用？', function () {
          axios.post(api.api.banner.enable, param).then(response => {
            var data = response.data
            if (data.bresult) {
              util.alertdo('启用成功！', function () {
                that.getData(that.searchCondition.page.page)
              })
            } else {
              util.alert(data.object)
            }
          })
        })
      },
      reSearch () {
        this.$refs.devListPager.init()
        this.getData(1)
      },
      reset () {
        this.searchCondition = {
          conditions: {
            title: '',
            startTime: '',
            endTime: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        }
        this.$refs.userSelect.delItem()
        this.$refs.devListPager.init()
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
      },
      setConditionUser (user) {
        this.searchCondition.conditions.username = user.value
      }

    }
  }
</script>


<style scoped>
  .pc {
    margin: 10px;
  }

  .pc .c {
    position: relative;
    width: 300px;
    height: 100px;
  }

  .pc .c .pi {
    width: 300px;
    height: 100px;
  }

  .pc .c .t {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    background: #000;
    opacity: 0.6;
  }

  .pc .c .t span {
    line-height: 30px;
    color: #fff;
    margin-left: 10px;
  }

</style>
