<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改充值卡</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>数据列表</span>
          </div>
        </div>
        <div class="result-c">
          <table class="comTb">
            <tr>
              <th>图片</th>
              <th>卡号</th>
              <th>卡密</th>
              <th>名称</th>
              <th>积分</th>
              <th>是否使用</th>
              <!-- <th>操作</th>-->
            </tr>
            <tr v-for="item in cardLst" :key="item.id">
              <td>
                <div class="pi-c">
                  <img :src="item.imgPath" class="pi">
                </div>
              </td>
              <td>{{item.code}}</td>
              <td>{{item.password}}</td>
              <td>{{item.name}}</td>
              <td>{{item.score}}</td>
              <td>
                <span v-if="item.hasUsed">是</span>
                <span v-if="!item.hasUsed">否</span>
              </td>

              <!--<td>
                <span class="operate" @click="goToUpd(item)">编辑</span>
              </td>-->
            </tr>
          </table>
        </div>
        <div class="p-f">
          <div class="page">
            <routerPaging :total="searchCondition.page.totalSize" v-on:change="getCards"></routerPaging>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";

export default {
  components: {
    routerPaging
  },
  name: "UserCard",
  data() {
    return {
      massage: 12345678,
      cardLst: [],
      searchCondition: {
        conditions: {
          userId: this.$route.query.id
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      data: {}
    };
  },
  created() {
    this.getCards(1);
  },
  methods: {
    getCards(val) {
      var that = this;
      that.searchCondition.page.page = val;
      var param = that.searchCondition;
      axios.post(api.api.card.userList, param).then(response => {
        if (response.data.bresult) {
          that.cardLst = response.data.object;
          that.searchCondition.page.totalSize = response.data.count;
        }
      });
    },
    goToImportCard: function() {
      window.location.href = "/#/recharge/addrechargecard";
    },
    /*  goToUpd: function (data) {
            var that = this;
            var param = this.taskid;
            param.id = data.id;
            axios.post(api.api.task.del, param).then(response => {
              if (response.data.bresult) {
                util.alert(response.data.message);
                this.getData(1);
              } else {
                util.alert(response.message)
              }
            })
        },*/
    reSearch() {
      this.getCards(1);
    }
  }
};
</script>

<style scoped>
</style>
