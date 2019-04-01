<template>
  <div>
    <div class="head-c">
      <span class="bread-item">项目</span>
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
                    <span class="ct">项目名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.projectName">
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
            <span>项目列表</span>
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
                <th>项目图片</th>
                <th>
                  <div class="ll">项目名称</div>
                </th>
                <th>是否有效</th>
                <th>
                  <div class="ll">描述</div>
                </th>
                <th>排序</th>
                <th style="width:300px;">操作</th>
              </tr>
              <tr v-for="item in projectlist" :key="item.id">
                <td>
                  <div class="pi-c">
                    <img :src="item.projectPicture" class="pi">
                  </div>
                </td>
                <td>
                  <div class="ll">{{item.projectName}}</div>
                </td>
                <td>
                  <div>
                    <span class="operate" v-if="item.effective==0">无效</span>
                    <span class="operate" v-if="item.effective==1">有效</span>
                  </div>
                </td>
                <td>
                  <div class="ll">{{item.projectDesc}}</div>
                </td>
                <td>
                  <div>{{item.seq}}</div>
                </td>
                <td>
                  <router-link tag="span" class="operate" :to="item.curl">关联分类</router-link>
                  <span class="operate" @click="info(item)">编辑</span>
                  <span class="operate" v-if="item.effective==0" @click="update(item,1)">启用</span>
                  <span class="operate" v-if="item.effective==1" @click="update(item,0)">禁用</span>
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

    <el-dialog title="编辑项目" :visible.sync="exerciseEditVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑项目</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>项目名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入项目名称"
                v-model="project.projectName"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>排序：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入课章排序" v-model="project.seq">
            </div>
          </div>
          <div class="i" style="height: 120px;">
            <div class="tl">
              <span>项目图片：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload" :imgPath="project.projectPicture"></fileUpload>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>项目描述：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入项目描述"
                v-model="project.projectDesc"
              >
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delVisable" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{project.chapterName}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisable = false">取 消</el-button>
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
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "ProjectList",
  components: {
    routerPaging,
    userSelect,
    fileUpload
  },
  data() {
    return {
      msg: "确定删除这个项目吗?",
      exerciseEditVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      enableOptions: [{ id: 1, label: "是" }, { id: 0, label: "否" }],
      project: {
        projectName: "",
        projectPicture: "",
        projectDesc: "",
        effective: 1,
        seq: null
      },
      projectlist: [],
      searchData: {
        conditions: {
          projectName: null,
          sidx: "seq",
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
      axios.post(api.api.project.list, param).then(response => {
        that.loading = false;
        
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectlist = rdata.page.list;
          that.projectlist.forEach(item => {
            item.curl = "/category/list/" + item.id;
          });
          that.searchData.page.listTotal = rdata.page.totalCount;
        }
      });
    },
    update(item, effective) {
      item.effective = effective;
      this.project = item;
      var that = this;
      that.project.updateTime = null;
      var param = that.project;
      param.createDate = null;
      param.updateTime = null;
      axios.post(api.api.project.save, param).then(response => {
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
    save() {
      var that = this;
      that.project.updateTime = null;
      var param = that.project;
      param.createDate = null;
      param.updateTime = null;
      param.projectPicture = that.$refs.fileUpload.$data.img.urlPath;
      axios.post(api.api.project.save, param).then(response => {
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
    del(item) {
      this.chapter = item;
      this.delVisable = true;
    },
    delData() {
      var param = this.chapter;
      axios.post(api.api.project.delete, param).then(response => {
        
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
        this.delVisable = false;
      });
    },
    info(item) {
      var that = this;
      that.project = util.clone(item);
      that.exerciseEditVisable = true;
    },
    detail(item) {
      this.chapter = item;
      this.detailVisable = true;
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
    },
    showEdit() {
      this.project = {
        projectName: "",
        projectPicture: "",
        projectDesc: "",
        effective: 1,
        seq: null
      };
      this.$refs.fileUpload.urlPath = null;
      this.exerciseEditVisable = true;
    }
  }
};
</script>
<style scoped>
.pi-c {
  margin: 10px;
}

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
