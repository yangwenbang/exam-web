<template>
  <div>
    <div class="head-c">
      <span class="bread-item">面授机构</span>
    </div>
    <div class="content">
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
                    <span class="ct">机构名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.subjectName">
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
            <span>机构列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" to="/offline/organization/edit/0">添加机构</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
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
                <th>
                  <div>所属项目</div>
                </th>
                <th>城市</th>
                <th>联系人</th>
                <th>联系方式</th>
                <th>机构地址</th>
                <th>排序</th>
                <th>
                  <div>是否有效</div>
                </th>
                <th>操作</th>
              </tr>
              <tr v-for="item in offlineorganizationlist" :key="item.id">
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
                <td>
                  <span v-for="xitem in projectlist" :key="xitem.id">
                    <span v-if="item.projectId==xitem.id">{{xitem.projectName}}</span>
                  </span>
                </td>
                <td>
                  <span v-for="xitem in citys" :key="xitem.id">
                    <span v-if="item.cityId==xitem.id">{{xitem.cityName}}</span>
                  </span>
                </td>
                <td>{{item.contact}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.organizationAddress}}</td>
                <td>{{item.seq}}</td>
                <td>
                  <div>
                    <span class="operate" v-if="item.status==0">无效</span>
                    <span class="operate" v-if="item.status==1">有效</span>
                  </div>
                </td>
                <td>
                  <span class="operate" @click="qrcode(item)">查看二维码</span>
                  <router-link tag="span" class="operate" :to="item.url">编辑</router-link>
                  <span class="operate" v-if="item.status==0" @click="update(item,1)">启用</span>
                  <span class="operate" v-if="item.status==1" @click="update(item,0)">失效</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging :total="searchData.page.listTotal" v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="机构二维码" :visible.sync="qrcodevisable" width="300px" center>
      <div style="height:250px;" v-loading="hascreate">
        <div style="margin-left:35px;" id="qrcode"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import CitySelect from "@/components/child-components/city-select";
import api from "../../config/apiConfig";
import Utils from "@/vendor/utils.js";

export default {
  name: "OfflineOrganizationList",
  components: {
    routerPaging,
    CitySelect
  },
  data() {
    return {
      qrcodevisable: false,
      hascreate: false,
      exerciseEditVisable: false,
      showVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      projectlist: [],
      citys: [],
      type: {},
      offlineorganizationlist: [],
      searchData: {
        conditions: {
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
    this.loading = false;
    this.getData(1);
    this.getProjects();
    this.getCitys();
  },
  methods: {
    qrcode(item) {
      var that = this;
      that.hascreate = true;
      this.qrcodevisable = true;
      setTimeout(function() {
        var url =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx96e00748bfc14aff&redirect_uri=http://www.jxjsykt.com/exam-admin/exam/userdetail/bind/user?orcode=" +
          item.organizationCode +
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
    getData(val) {
      var that = this;
      var param = that.searchData;
      that.searchData.page.page = val;
      that.loading = true;
      axios.post(api.api.offline.organization.list, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.offlineorganizationlist = rdata.page.list;
          that.offlineorganizationlist.forEach(item => {
            item.url = "/offline/organization/edit/" + item.id;
          });
          that.searchData.page.listTotal = rdata.page.totalCount;
        }
      });
    },
    getProjects() {
      var that = this;
      axios.post(api.api.project.listall).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectlist = rdata.list;
        }
      });
    },
    getCitys() {
      var that = this;
      axios.post(api.api.city.listall).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.citys = rdata.list;
        }
      });
    },
    save() {
      var that = this;
      var param = that.organization;
      axios.post(api.api.offline.organization.save, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getData(1);
          that.showVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    update(item, status) {
      var that = this;
      var param = item;
      param.status = status;
      axios.post(api.api.offline.organization.save, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getData(1);
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
          chapterName: ""
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      };
      this.searchData = resetData;
      this.getData(1);
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
  margin: 10px;
  margin-right: 0;
  vertical-align: middle;
}

table.comTb .u-info .ii {
  margin-left: 30%;
}

table.comTb .u-info {
  cursor: pointer;
  text-align: left;
}

table.comTb th .ll {
  text-align: left;
  margin-left: 20px;
}

table.comTb td .ll {
  text-align: left;
  margin-left: 20px;
  min-width: 200px;
  max-width: 350px;
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

.panel .p-c .i .tr input.add-input {
  width: 480px;
}
.t-fl {
  z-index: 10;
  float: left;
  width: 100%;
  position: absolute;
  bottom: 0;
  background: black;
  opacity: 0.8;
  color: #fff;
  padding: 5px 0;
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
