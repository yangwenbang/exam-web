<template>
  <div>
    <div class="head-c">
      <span class="bread-item">问题类型列表</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2 clearfix">
          <div class="name">
            <span>问题类型列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" to="/addType">添加问题类型</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
          <!--      <th>序号</th>-->
                <th>问题类型</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in typeList" :key="item.id">
               <!-- <td>{{item.id}}</td>-->
                <td>{{item.modelName}}</td>
                <td>{{item.modelDesc}}</td>
                <td>
                  <span class="operate" @click="delType(item.id)">删除</span>
                  <router-link tag="span" class="operate" :to="item.url">修改</router-link>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f clearfix">
            <div class="page clearfix">
              <routerPaging :total='typeObj.page.total' v-on:change="getType"></routerPaging>
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
  name: 'FeedbackType',
  components: {
    routerPaging
  },
  data() {
    return {
      loading: true,
      show: '收起筛选',
      hide: '显示筛选',
      isShow: true,
      typeList: [],
      typeObj: {
        conditions: {},
        page: {
          page: 1,
          num: 10,
          total: 0
        }

      }
    }
  },
  created() {
    this.getType(1)
  },
  methods: {
    getType(val) {
      var that = this;
      var data = that.typeObj;
      that.loading = true
      that.typeObj.page.page = val;
      axios.post(api.api.question.list, data).then(response => {
        if (response.data.bresult) {
          that.typeList = response.data.object;
          that.typeList.forEach(function (item) {
            item.url = '/modify/' + item.id;
          });
          that.loading = false
        }
      })
    },
    delType (index) {
      let that = this;
      util.confirmDoWithTitle('删除', '是否删除？', function () {
        var data = {
          id: +index
        };
        axios.post(api.api.question.del, data).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.getType();
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  div.content {
    text-align: left;
  }

</style>
