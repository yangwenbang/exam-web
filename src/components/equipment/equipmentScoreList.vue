<template>
  <div>
    <div class="head-c">
      <span class="bread-item">设备积分列表</span>
    </div>
    <div class="content">
      <div id="equipmentList">
        <!--<routerPaging :total = 100 v-on:change="pageChange"></routerPaging>-->
        <div class="panel">
          <div class="p-t">
            <div class="name">
              <span>筛选查询</span>
            </div>
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
                      <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">设备ID:</span>
                    </div>
                    <div class="fca">
                      <input class="cin" type="text" v-model="searchCondition.conditions.deviceId">
                    </div>
                  </div>
                </div>
                <!-- <div class="fh">
                   <div class="fcl">
                     <div class="fci">
                       <span class="ct">积分类型:</span>
                     </div>
                     <div class="fca">
                       <el-select v-model="searchCondition.conditions.rankType" clearable placeholder="请选择">
                         <el-option v-for="item in rankTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                         </el-option>
                       </el-select>
                     </div>
                   </div>
                 </div>-->
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
            <div class="name">数据列表</div>
          </div>
          <div v-loading="loading">
            <div class="result-c">
              <table class="comTb">
                <tr>
                  <th>用户昵称</th>
                  <th>用户账号</th>
                  <th>设备ID</th>
                  <th>设备名称</th>
                  <!-- <th>设备添加时间</th> -->
                  <th>获取积分时间</th>
                  <!-- <th>积分类型</th>-->
                  <th style="text-align:left">获得积分</th>
                </tr>
                <tr v-for="item in list" :key="item.did">
                  <td>{{item.username}}</td>
                  <td>{{item.phone}}</td>
                  <td>{{item.deviceid}}</td>
                  <td>{{item.devicename}}</td>
                  <td>{{item.addtime}}</td>
                  <td style="text-align:left"><div class="green">+{{item.score}}</div></td>
                </tr>
              </table>
            </div>
            <div class="p-f">
              <div class="page">
                <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="pageChange"></routerPaging>
              </div>
            </div>
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
import userSelect from "@/components/child-components/selector-components/user";

export default {
  name: "equipmentList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      loading: true,
      list: [],
      ischecked: false,
      searchCondition: {
        conditions: {
          deviceId: this.$route.query.did,
          userId: this.$route.query.uid,
          flag: this.$route.query.flag,
          rankType: "",
          username: ""
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      rankTypeOptions: [
        { value: "1", label: "电信积分" },
        { value: "2", label: "INT积分" }
      ]
    };
  },
  created() {
    this.pageChange(1);
  },
  methods: {
    setConditionUser(user) {
      this.searchCondition.conditions.userId = user.key.toString();
      this.searchCondition.conditions.username = user.value;
    },
    pageChange(val) {
      let that = this;
      that.loading = true
      that.searchCondition.page.page = val;
      var param = this.searchCondition;
      axios.post(api.api.device.scoreList, param).then(response => {
        if (response.data.bresult) {
          that.list = response.data.object;
          that.list.forEach(function(item) {
            item.score = util.thousand(item.score);
            item.daddtime = util.getDateDiff(item.daddtime);
            item.addtime = util.getDateDiff(item.addtime);
            if (item.ranktype == 1) {
              item.ranktype = "电信积分";
            } else {
              item.ranktype = "INT积分";
            }
          });
          that.searchCondition.page.totalSize = response.data.count;
        }
        that.loading = false;
      });
    },
    reSearch() {
      this.$refs.devListPager.init();
      this.pageChange(1);
    },
    reset() {
      this.searchCondition = {
        conditions: {
          deviceId: this.$route.query.did,
          userId: this.$route.query.uid,
          flag: this.$route.query.flag,
          rankType: "",
          username: ""
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      };
      this.$refs.devListPager.init();
      this.$refs.userSelect.delItem();
      this.pageChange(1);
    }
  }
};
</script>
<style scoped>
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.user-search {
  margin-top: 20px;
  border: 1px solid #e4e4e4;
  text-align: left;
  font-size: 14px;
}

.user-search .search-t {
  height: 50px;
  padding: 0 20px;
  background-color: #f3f3f3;
  line-height: 50px;
}

.search-t .s-t-left {
  float: left;
  height: 50px;
}

.search-t .s-t-right {
  float: right;
  height: 50px;
}

.s-t-right .s-t-r-hide,
.s-t-r-btn {
  display: inline-block;
}

.s-t-right .s-t-r-hide {
  margin-right: 10px;
  color: #aaa;
  cursor: pointer;
}

.s-t-right .s-t-r-btn span {
  display: inline-block;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  line-height: 20px;
  cursor: pointer;
}

.s-t-right .s-t-r-btn span:first-of-type {
  border-right: 0;
}

.s-t-right .s-t-r-btn span:hover {
  background-color: #f2f2f2;
}

.user-search .search-c {
  padding: 0 20px;
  line-height: 80px;
  font-size: 16px;
  border-top: 1px solid #e4e4e4;
}

.search-c .user-input {
  display: inline-block;
  margin-right: 50px;
}

.search-c .user-input input {
  width: 180px;
  height: 35px;
  padding-left: 10px;
  border: 1px solid #e4e4e4;
  border-radius: 3px;
  font-size: 16px;
  outline: none;
}

.search-c .user-input .search-btn {
  width: 80px;
  height: 35px;
  border: 0;
  border-radius: 3px;
  font-size: 16px;
  color: #fff;
  background-color: #1abc9c;
  outline: none;
}

.search-c .user-input input::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #ddd;
}

.search-c .user-input input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ddd;
}

.search-c .user-input input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ddd;
}

.search-c .user-input input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ddd;
}

.user-result {
  font-size: 14px;
}

.user-result .result-t {
  height: 50px;
  margin-top: 20px;
  padding: 0 20px;
  background-color: #f3f3f3;
  line-height: 50px;
  border: 1px solid #e4e4e4;
  border-bottom: 0;
  text-align: left;
}

.user-result .result-t > div {
  float: left;
}

.user-result .result-t .data-show {
  float: right;
}

.result-t .data-send {
  margin-left: 380px;
}

.result-t .span {
  display: inline-block;
  padding: 5px;
  margin: 0 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  line-height: 20px;
  cursor: pointer;
}

.result-t .span:hover {
  background-color: #f2f2f2;
}

.result-t .data-show > div {
  float: left;
}

.result-c .user-detail {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e4e4e4;
}

.user-detail th {
  height: 45px;
  background-color: #f9f9f9;
}

.user-detail td {
  height: 50px;
}

.user-detail td > a {
  color: #1abc9c;
  margin: 0 3px;
}

.user-detail td > a:hover {
  text-decoration: underline;
}

.user-result .result-f {
  height: 50px;
  padding: 0 20px;
  background-color: #f9f9f9;
  line-height: 50px;
  border: 1px solid #e4e4e4;
  border-top: 0;
  text-align: left;
}

.result-f .result-f-left {
  float: left;
}

.result-f .result-f-right {
  float: right;
}

.result-f .result-f-right .count {
  float: left;
  margin-right: 20px;
}

.result-f-right .count .count-num {
  color: #f00;
  margin: 0 3px;
}
</style>
