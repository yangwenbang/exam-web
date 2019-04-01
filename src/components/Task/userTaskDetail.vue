<template>
  <div>
    <div class="head-c">
      <span class="bread-item">UserTaskDetail</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>数据列表</span>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>用户昵称</th>
                <th>添加时间</th>
                <th>积分类型</th>
                <th>积分</th>
              </tr>
              <tr v-for="item in list" :key="item.id">
                <td>{{item.username}}</td>
                <td>{{item.addTime}}</td>
                <td>{{item.rankType}}积分</td>
                <td>
                  <span   :style="'color:'+((item.score).replace(',','')>0?'red':'green')+';'">{{item.score}}</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging :total='searchCondition.page.totalSize' v-on:change="getData(val)"></routerPaging>
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
    name: 'userTaskDetail',
    components: {
      routerPaging
    },
    data() {
      return {
        loading: true,
        list: [],
        searchCondition: {
          conditions: {
            uid:'',
            rankType:''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        getDatass: {
          id: this.$route.query.id,
         rankType: this.$route.query.rankType
        },
        rankTypeLst: [
          {id: 1, name: '电信积分类型'},
          {id: 2, name: 'INT积分类型'}
        ]
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      getData: function (val) {
        var that = this;
        var data = this.getDatass;
        that.searchCondition.conditions.uid=data.id;
        that.searchCondition.conditions.rankType=data.rankType;
        that.searchCondition.page.page = val;
        var param = that.searchCondition;
        // 添加请求头
        axios.post(api.api.score.history, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object;
            that.list.forEach(function (item) {
              item.addTime = util.getDateDiff(item.addTime);
              item.score = util.thousand(item.score);
              if((item.score).replace(',','')>0){
               item.score="+"+item.score;
              }
             if (item.rankType == 1) {
                item.rankType = "电信积分类型";
              } else {
                item.rankType = "INT积分类型";
              }
            })
            that.searchCondition.page.totalSize = response.data.count
            that.loading = false
          }
        })
      },
      reSearch: function () {
        this.getData(1);
      }, reset: function () {
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
