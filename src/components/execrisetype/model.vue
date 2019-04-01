<template>
  <div>
    <div class="head-c">
      <span class="bread-item">题型模板</span>
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
                    <span class="ct">模板名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.modelName">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">项目:</span>
                  </div>
                  <div class="fca">
                    <el-select
                      v-model="searchData.conditions.projectId"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in projectList"
                        :key="item.id"
                        :label="item.projectName"
                        :value="item.id"
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
            <span>模板列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class @click="showEdit">添加数据</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">模板名称</div>
                </th>
                <th>
                  <div class="ll">项目类别</div>
                </th>
                <th>
                  <div class="ll">模板说明</div>
                </th>
                <th>
                  <div class="ll">修改时间</div>
                </th>
                <th>操作</th>
              </tr>
              <tr v-for="item in modelList" :key="item.id">
                <td>
                  <div class="ll">{{item.modelName}}</div>
                </td>
                <td>
                  <div class="ll">{{item.projectName}}</div>
                </td>
                <td>
                  <div class="ll">{{item.modelDescription}}</div>
                </td>
                <td>
                  <div class="ll">{{item.updateTime}}</div>
                </td>
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
    <el-dialog title="编辑题型模板" :visible.sync="editVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑题型模板</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>模板名称：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入模板名称" v-model="model.modelName">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>项目：</span>
            </div>
            <div class="tr">
              <el-select
                v-model="model.projectId"
                clearable
                placeholder="项目"
                id="input-exerc-typeid"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>模板说明：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入模板说明"
                v-model="model.modelDescription"
              >
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{model.modelName}}</span>
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
  name: "ExecriseModelList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      msg: "确定删除这条题型模板吗?",
      editVisable: false,
      centerDialogVisible: false,
      loading: true,
      projectList: [],
      modelList: [],
      model: {
        id: 0
      },
      searchData: {
        conditions: {
          projectId: null,
          modelName: "",
          sidx: "id",
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
    this.getProjects();
  },
  methods: {
    getData(val) {
      console.log(val);
      var that = this;
      that.searchData.page.page = val;
      var param = util.clone(that.searchData);
      if (
        param.conditions.projectId == null ||
        param.conditions.projectId.length <= 0
      ) {
        param.conditions.projectId = 0;
      }
      that.loading = true;
      axios.post(api.api.execrisetype.modellist, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          that.modelList = rdata.page.list;
          that.searchData.page.listTotal = rdata.page.totalCount;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
      });
    },
    getProjects() {
      var that = this;
      axios.post(api.api.project.listall).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectList = rdata.list;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
      });
    },
    save() {
      var that = this;
      var param = that.model;
      param.createTime=null;
      param.updateTime=null;
      axios.post(api.api.execrisetype.modelsave, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.editVisable = false;
          that.getData(1);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    delData() {
      var param = this.model;
      axios.post(api.api.execrisetype.modeldel, param).then(response => {
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
      this.model = item;
      this.centerDialogVisible = true;
    },
    info(item) {
      this.model = item;
      this.editVisable = true;
    },
    reSearch() {
      this.getData(1);
    },
    reset() {
      var resetData = {
        conditions: {
          projectId: null,
          modelName: null
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
      this.editVisable = true;
      this.model = {};
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
