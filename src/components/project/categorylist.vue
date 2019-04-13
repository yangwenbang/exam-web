<template>
  <div>
    <div class="head-c">
      <router-link tag="span" class="bread-item lk" :to="projectUrl">项目</router-link>
      <span class="bread-item">></span>
      <span class="bread-item">类别</span>
      <div style="float:right;">
        <router-link tag="button" class="cb" :to="projectUrl">返 回</router-link>
      </div>
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
                    <span class="ct">类别名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.categoryName">
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
            <span>类别列表</span>
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
                <!-- <th>类别图片</th> -->
                <th>
                  <div class="ll">类别名称</div>
                </th>
                <th>
                  <div class="ll">描述</div>
                </th>
                <th>是否有效</th>
                <th>排序</th>
                <th style="width:300px;">操作</th>
              </tr>
              <tr v-for="item in categorylist" :key="item.id">
                <!-- <td>
                  <div class="pi-c">
                    <img :src="item.categoryPicture" class="pi">
                  </div>
                </td> -->
                <td>
                  <div class="ll">{{item.categoryName}}</div>
                </td>
                <td>
                  <div class="ll">{{item.categoryDesc}}</div>
                </td>
                <td>
                  <span class="operate" v-if="item.effective==0">无效</span>
                  <span class="operate" v-if="item.effective==1">有效</span>
                </td>
                <td>
                  <div>{{item.seq}}</div>
                </td>
                <td>
                  <router-link tag="span" class="operate" :to="item.subjectUrl">关联学科</router-link>
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

    <el-dialog title="编辑类别" :visible.sync="exerciseEditVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑类别</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>类别名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入类别名称"
                v-model="category.categoryName"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>排序：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入课章排序" v-model="category.seq">
            </div>
          </div>
          <!-- <div class="i" style="height: 120px;">
            <div class="tl">
              <span>类别图片：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload" :imgPath="category.categoryPicture"></fileUpload>
            </div>
          </div> -->
          <div class="i">
            <div class="tl">
              <span>类别描述：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入类别描述"
                v-model="category.categoryDesc"
              >
            </div>
          </div>
          <div class="pf">
            <button class="btn" @click="save">保存</button>
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
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "CategoryList",
  components: {
    routerPaging,
    userSelect,
    fileUpload
  },
  data() {
    return {
      msg: "确定删除这个类别吗?",
      exerciseEditVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      projectUrl: "/project/list",
      enableOptions: [{ id: 1, label: "是" }, { id: 0, label: "否" }],
      category: {
        categoryName: "",
        categoryPicture: "",
        categoryDesc: "",
        effective: null,
        seq: null
      },
      categorylist: [],
      searchData: {
        conditions: {
          categoryName: null,
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
      param.conditions.projectId = parseInt(this.$route.params.projectId);
      axios.post(api.api.category.list, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.categorylist = rdata.page.list;
          that.categorylist.forEach(item => {
            item.subjectUrl =
              "/subject/list/" + this.$route.params.projectId + "/" + item.id;
          });
          that.searchData.page.listTotal = rdata.page.totalCount;
        }
      });
    },
    update(item, effective) {
      item.effective = effective;
      this.project = item;
      var that = this;
      that.category.updateTime = null;
      var param = that.project;
      param.projectId = parseInt(this.$route.params.projectId);
      param.createDate = null;
      param.updateTime = null;
      axios.post(api.api.category.save, param).then(response => {
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
      var param = that.category;
      param.createDate = null;
      param.updateTime = null;
      param.projectId = parseInt(this.$route.params.projectId);
      param.categoryPicture = that.$refs.fileUpload.$data.img.urlPath;
      axios.post(api.api.category.save, param).then(response => {
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
    info(item) {
      var that = this;
      that.category = util.clone(item);
      that.exerciseEditVisable = true;
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
      this.category = {
        categoryName: "",
        categoryPicture: "",
        categoryDesc: "",
        effective: null,
        seq: null
      };
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
