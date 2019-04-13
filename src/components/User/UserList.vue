<template>
  <div>
    <div class="head-c">
      <span class="bread-item">用户列表</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t">
          <div class="name">
            <span>筛选查询</span>
          </div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">用户名:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.userName">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">用户手机:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.phone">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">注册时间:</span>
                  </div>
                  <div class="fca">
                    <div class="f1">
                      <input
                        class="cin"
                        type="text"
                        id="datetimepicker"
                        v-model="searchData.conditions.startTime"
                      >
                    </div>
                    <div class="f2">
                      <a class="ct"></a>
                    </div>
                    <div class="f1">
                      <input
                        class="cin"
                        type="text"
                        id="datetimepicker2"
                        v-model="searchData.conditions.endTime"
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">是否启用:</span>
                  </div>
                  <div class="fca">
                    <el-select v-model="searchData.conditions.status" clearable placeholder="请选择">
                      <el-option
                        v-for="item in enableOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
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
            <span>用户列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" to="/user/edit/0">添加用户</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">用户名</div>
                </th>
                <th>用户类型</th>
                <th>账户启用状态</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in userlist" :key="item.id">
                <td class="u-info" @click="showUser(item.id)">
                  <div class="ll">
                    <span v-show="item.username">{{item.username}}</span>
                    <span v-show="item.mobile">({{item.mobile}})</span>
                  </div>
                </td>
                <td>
                  <div v-if="item.userType==0">默认用户</div>
                  <div v-else-if="item.userType==1">合作伙伴</div>
                  <div v-else-if="item.userType==2">系统用户</div>
                  <div v-else-if="item.userType==3">管理员</div>
                </td>
                <td :class="{dg : !item.status} ">{{item.status ? '正常' : '禁用'}}</td>
                <td>{{item.createTime}}</td>
                <td>
                  <span v-if="item.userType==1" class="operate" @click="qrcode(item)">查看二维码</span>
                  <span v-if="item.userType==1" class="operate" @click="updateOrgan(item)">签约机构</span>
                  <router-link tag="span" class="operate" :to="item.url">编辑</router-link>
                  <span class="operate" v-if="item.status" @click="update(item,0)">禁用</span>
                  <span class="operate" v-else @click="update(item,1)">启用</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging
                ref="devListPager"
                :total="searchData.page.listTotal"
                v-on:change="getData"
              ></routerPaging>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="合作伙伴二维码" :visible.sync="qrcodevisable" width="300px" center>
      <div style="height:250px;" v-loading="hascreate">
        <div style="margin-left:35px;" id="qrcode"></div>
      </div>
    </el-dialog>
    <el-dialog title="合作伙伴签约" :visible.sync="organvisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>机构列表</span>
          </div>
        </div>
        <div class="result-c">
          <table class="comTb">
            <tr>
              <th>
                <div>机构logo</div>
              </th>
              <th>
                <div>机构名称</div>
              </th>
              <th>
                <div>机构码</div>
              </th>
              <th>机构地址</th>
              <th>操作</th>
            </tr>
            <tr v-for="item in organDatas" :key="item.id">
              <td>
                <div class="pi-c">
                  <img :src="item.organizationPicture" class="pi">
                </div>
              </td>
              <td>
                <div>{{item.organizationName}}</div>
              </td>
              <td>
                <div>{{item.organizationCode}}</div>
              </td>
              <td>{{item.organizationAddress}}</td>
              <td>
                <span class="operate" @click="okOrgan(item)">确定签约</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="p-f">
          <div class="page">
            <routerPaging :total="orgsearchData.page.listTotal" v-on:change="getOrgData"></routerPaging>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
import userSelect from "@/components/child-components/selector-components/user";
import Utils from "@/vendor/utils.js";

export default {
  name: "UserList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      currentUser: {},
      organvisable: false,
      qrcodevisable: false,
      hascreate: false,
      loading: true,
      deviceLoad: true,
      cardLoad: true,
      userLoading: true,
      enableOptions: [
        { value: 0, label: "已禁用" },
        { value: 1, label: "已启用" }
      ],
      centerDialogVisible: false,
      cardVisible: false,
      msgVisible: false,
      userVisible: false,
      num: 10,
      userlist: [],
      userId: "",
      cardLst: [],
      equList: [],
      listTotal: 0,
      searchData: {
        conditions: {
          status: null,
          phone: "",
          userName: "",
          startTime: "",
          endTime: "",
          sidx: "status desc,createTime",
          order: "desc"
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      },
      organDatas: [],
      orgsearchData: {
        conditions: {
          status: null,
          phone: "",
          userName: "",
          startTime: "",
          endTime: "",
          sidx: "",
          order: "desc"
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      }
    };
  },
  created() {
    this.loading = true;
    this.getData(1);
    this.getOrgData(1);
  },
  mounted() {
    this.setDateTimePick();
  },
  methods: {
    qrcode(item) {
      var that = this;
      that.hascreate = true;
      this.qrcodevisable = true;
      setTimeout(function() {
        console.log(item);
        var url =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx96e00748bfc14aff&redirect_uri=http://www.jxjsykt.com/exam-admin/exam/userdetail/bind/user?usercode=" +
          item.userId +
          "&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect";
        $("#qrcode").html("");
        $("#qrcode").qrcode({
          render: "canvas",
          width: 180,
          height: 180,
          text: url
        });
        that.hascreate = false;
      }, 5000);
    },
    updateOrgan(item) {
      this.currentUser = util.clone(item);
      this.organvisable = true;
    },
    okOrgan(item) {
      console.log(item);
       var that = this;
      var param = {userId:this.currentUser.userId,offlineOrganizationId:item.id};
      axios.post(api.api.user.okOrgan, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getData(1);
          that.exerciseEditVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
        }
      });
    },
    getOrgData(val) {
      var that = this;
      var param = that.orgsearchData;
      that.orgsearchData.page.page = val;
      axios.post(api.api.offline.organization.list, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.organDatas = rdata.page.list;
          that.orgsearchData.page.listTotal = rdata.page.totalCount;
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    setConditionUser(user) {
      this.searchData.conditions.userId = user.key.toString();
      this.searchData.conditions.username = user.value;
    },
    getData(val) {
      var that = this;
      that.searchData.page.page = val;
      var param = util.clone(that.searchData);
      if (param.conditions.status != null) {
        if (param.conditions.status.length == 0) {
          param.conditions.status = null;
        }
      }
      if (param.conditions.endTime.length > 0) {
        param.conditions.endTime = param.conditions.endTime + "23:59:59";
      }
      that.loading = true;
      axios.post(api.api.user.list, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.userlist = rdata.page.list;
          that.userlist.forEach(item => {
            item.url = "/user/edit/" + item.userId;
          });
          that.searchData.page.listTotal = rdata.page.totalCount;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
        that.loading = false;
      });
    },
    update(item, status) {
      var that = this;
      var param = item;
      param.createTime = null;
      param.updateTime = null;
      item.status = status;
      axios.post(api.api.user.savestatus, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getData(1);
          that.exerciseEditVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    reSearch() {
      this.getData(1);
    },
    reset() {
      var resetData = {
        conditions: {
          status: null,
          phone: "",
          username: "",
          startTime: "",
          endTime: "",
          sidx: "createTime",
          order: "desc"
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      };
      this.searchData = resetData;
      this.getData(1);
    },
    setDateTimePick() {
      var that = this;
      $("#datetimepicker")
        .datetimepicker({
          format: "Y-m-d", // 格式化日期
          timepicker: false, // 关闭时间选项
          yearStart: 1990, // 设置最小年份
          yearEnd: 2050, // 设置最大年份
          todayButton: true,
          scrollMonth: false,
          scrollTime: false,
          scrollInput: false,
          closeOnInputClick: true
        })
        .on("change", function(picker) {
          that.searchData.conditions.startTime = picker.currentTarget.value;
        });
      $("#datetimepicker2")
        .datetimepicker({
          format: "Y-m-d", // 格式化日期
          timepicker: false, // 关闭时间选项
          yearStart: 1990, // 设置最小年份
          yearEnd: 2050, // 设置最大年份
          todayButton: true
          // 关闭选择今天按钮);
        })
        .on("change", function(picker) {
          that.searchData.conditions.endTime = picker.currentTarget.value;
        });
      $.datetimepicker.setLocale("ch");
    },
    showUser(item) {
      var that = this;
      var param = { id: item };
      that.userVisible = true;
      that.userLoading = true;
      axios
        .post(api.api.user.queryuserinfo, param)
        .then(response => {
          if (response.data.bresult) {
            that.userLoading = false;
            that.uInfo = response.data.object;
            that.uInfo.email = that.uInfo.email ? that.uInfo.email : "未设置";
            that.uInfo.intAccount = that.uInfo.intAccount
              ? that.uInfo.intAccount
              : "无";
            that.uInfo.birthday = that.uInfo.birthday
              ? moment(that.uInfo.birthday).format("YYYY-MM-DD")
              : "未设置";
            that.uInfo.lastLoginTime = that.uInfo.lastLoginTime
              ? util.getDateDiff(that.uInfo.lastLoginTime)
              : "尚未登录";
            that.uInfo.lastUpdateTime = moment(
              that.uInfo.lastUpdateTime
            ).format("YYYY-MM-DD");
          } else {
            util.alertdo(response.data.message, function() {
              that.userVisible = false;
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
div.content {
  text-align: left;
}

table.comTb .u-info .i {
  display: inline-block;
  vertical-align: middle;
}

table.comTb .u-info .ii {
  margin-left: 30%;
}

table.comTb .u-info {
  cursor: pointer;
  text-align: left;
}

table.comTb .u-info .i img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

table.comTb .u-info .i span {
  line-height: 25px;
  color: #1abc9c;
}

table.comTb .u-info:hover .i span {
  text-decoration: underline;
}

.u-c {
  text-align: center;
}

.u-c .u {
  width: 100%;
  margin: 10px;
}

.u-c .u .u-i {
  float: left;
  text-align: right;
  width: 47%;
}

.u-c .u .u-ii {
  float: left;
  text-align: left;
  width: 39%;
  margin-left: 20px;
  word-break: break-all;
}

.u-c .u-img img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.u-c .u > div {
  display: inline-block;
  width: 49%;
}

@media screen and (max-width: 1400px) {
  table.comTb .u-info .i img {
    width: 35px;
    height: 35px;
  }

  table.comTb .u-info .i {
    display: block;
    margin: 0;
    text-align: center;
  }

  table.comTb .u-info .i > div {
    margin-bottom: 10px;
  }

  table.comTb .u-info .ii {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
