<template>
  <div>
    <div class="head-c">
      <span class="bread-item">教师列表</span>
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
                    <span class="ct">教师姓名:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.teacherName">
                  </div>
                </div>
              </div>
              <!-- <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">教师电话:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.teacherMobile ">
                  </div>
                </div>
              </div> -->
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
            <span>教师列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" :to="editUrl">添加教师</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div>教师图片</div>
                </th>
                <th>教师</th>
                <th>学科</th>
                <th>教龄(年)</th>
                <th>教学特长</th>
                <th>学历</th>
                <th>所在城市</th>
                <th>联系方式</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in teacherList" :key="item.id">
                <td>
                  <div class="pi-c">
                    <img :src="item.headPictureUrl" class="pi">
                  </div>
                </td>
                <td>{{item.teacherName}}</td>
                <td>{{item.subjectName}}</td>
                <td>{{item.teacherLength}}</td>
                <td>{{item.teacherSpecial}}</td>
                <td>{{item.education}}</td>
                <td>{{item.cityName}}</td>
                <td>{{item.teacherMobile}}</td>
                <td>
                  <span class="operate" @click="info(item)">编辑</span>
                  <span class="operate" @click="del(item)">删除</span>
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
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{type.exerciseName}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delData">确 定</el-button>
      </span>
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
  name: "TeacherList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      editUrl: "/teacher/edit/0",
      msg: "确定删除这条题型吗?",
      exerciseEditVisable: false,
      centerDialogVisible: false,
      loading: true,
      typeOptions: [
        { id: 0, value: 0, label: "单选" },
        { id: 1, value: 1, label: "多选" },
        { id: 2, value: 2, label: "问答" }
      ],
      teacherList: [],
      type: {
        exerciseType: 0
      },
      searchData: {
        conditions: {
          teacherName: "",
          teacherMobile: "",
          order: "asc"
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
  },
  methods: {
    getData(val) {
      var that = this;
      var param = that.searchData;
      that.searchData.page.page = val;
      that.loading = true;
      axios.post(api.api.user.teacherlist, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          that.teacherList = rdata.page.list;
          that.searchData.page.listTotal = rdata.page.totalCount;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
      });
    },
    save() {
      var that = this;
      var param = that.type;
      axios.post(api.api.execrisetype.save, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.exerciseEditVisable = false;
          that.getData(1);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    delData() {
      var param = this.type;
      axios.post(api.api.execrisetype.delete, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData(1);
        } else {
          this.$message.error("删除失败" + rdata.msg);
        }
        this.centerDialogVisible = false;
      });
    },
    del(item) {
      this.type = item;
      this.centerDialogVisible = true;
    },
    info(item) {
      this.$router.push({ path: "/teacher/edit/" + item.id });
    },
    reSearch() {
      this.getData(1);
    },
    reset() {
      var resetData = {
        conditions: {
          teacherName: ""
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
    showEdit() {
      this.exerciseEditVisable = true;
      this.type = {};
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
