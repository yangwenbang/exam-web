<template>
  <div>
    <div class="head-c">
      <span class="bread-item">数据字典</span>
    </div>
    <div class="content">
      <div class="panel"><!-- form重置 -->
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 100px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.wbname">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">类型:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.wbtype">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">有效值2:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.wbval2">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">下拉框参数:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.tpname">
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
            <span>数据字典列表</span>
          </div>
          <div class="tools">
            <div class="t-r">
              <router-link class="operate" tag="span" to="/wordbook/add">添加字典</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div>
            <table class="comTb">
              <tr>
              <!--  <th>编号</th>-->
                <th>名称</th>
                <th>类型</th>
                <th>下拉框参数</th>
                <th width="200px">有效值1</th>
                <th>有效值2</th>
                <!--<th>描述</th>-->
                <th>更新时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in list" :key="item.id">
               <!-- <td>{{item.id}}</td>-->
                <td>{{item.wbname}}</td>
                <td>{{item.wbtype}}</td>
                <td>{{item.tpname}}</td>
                <td width="200px">{{item.wbval1}}</td>
                <td>{{item.wbval2}}</td>
                <!--<td>{{item.remark}}</td>-->
                <td>{{item.updatetime}}</td>
                <td :class="{dg : !item.enable} ">{{item.enable ? '已启用' : '已禁用'}}</td>
                <td>
                  <router-link tag="span" class="operate" :to="item.url">编辑</router-link>
                  <span class="operate" v-if="item.enable" @click="Disable(item.id)">禁用</span>
                  <span class="operate" v-else @click="Enable(item.id)">启用</span>
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
    name: 'DictionaryList',
    components: {
      routerPaging,
      userSelect
    },
    data() {
      return {
        loading: true,
        list: [],
        enableDate: {
          id: '',
          enable: ''
        },
        searchCondition: {
          conditions: {
            wbname: '',
            wbtype: '',
            wbval1: '',
            wbval2: '',
            tpname: '',
            isEnable: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },

      }
    },
    created () {
      this.getData(1)
    },
    methods: {
      getData(val) {
        var that = this
        that.loading = true
        that.searchCondition.page.page = val
        var param = that.searchCondition
        // 添加请求头
        axios.post(api.api.wordbook.list, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.searchCondition.page.totalSize = response.data.count
            that.list.forEach(function (item) {
              item.updatetime = util.getDateDiff(item.updatetime)
              item.url = '/wordbook/upd/' + item.id;
            })
          }
          that.loading = false
        })
      },
      Enable (index) {
          var that = this;
          that.enableDate.id = index;
          that.enableDate.enable = true;
          var param = that.enableDate;
          axios.post(api.api.wordbook.edit, param).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              that.getData(that.searchCondition.page.page);
            } else {
              util.alert(response.message)
            }
          })
      },
      Disable (index) {
        var that = this;
        that.enableDate.id = index;
        that.enableDate.enable = false;
        var param = that.enableDate;
        axios.post(api.api.wordbook.edit, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.getData(that.searchCondition.page.page);
          } else {
            util.alert(response.message)
          }
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
        this.getData(1)
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
