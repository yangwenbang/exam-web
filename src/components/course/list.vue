<template>
  <div>
    <div class="head-c">
      <span class="bread-item">课程列表</span>
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
                    <span class="ct">课程名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.courseName">
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
                      @change="projectChange"
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
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">分类:</span>
                  </div>
                  <div class="fca">
                    <el-select
                      v-model="searchData.conditions.categoryId"
                      clearable
                      placeholder="请选择"
                      @change="categoryChange"
                    >
                      <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">学科:</span>
                  </div>
                  <div class="fca">
                    <el-select
                      v-model="searchData.conditions.subjectId"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in subjectList"
                        :key="item.id"
                        :label="item.subjectName"
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
            <span>课程列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" :to="editUrl">添加课程</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>课程图片</th>
                <th>
                  <div class="ll">课程名称</div>
                </th>
                <th>项目名称</th>
                <th>分类名称</th>
                <th>学科名称</th>
                <th>课时数</th>
                <th>课程类型</th>
                <th>价格</th>
                <th>教师</th>
                <th>发布时间</th>
                <th>排序</th>
                <th>是否有效</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in courseList" :key="item.id">
                <td>
                  <div class="pi-c">
                    <img :src="item.pictureUrl" class="pi">
                  </div>
                </td>
                <td>
                  <div class="ll">{{item.courseName}}</div>
                </td>
                <td>{{item.projectName}}</td>
                <td>{{item.categoryName}}</td>
                <td>{{item.subjectName}}</td>
                <td>{{item.courseCount}}</td>
                <td>
                  <span v-for="xitem in pOptions" :key="xitem.id">
                    <span v-if="xitem.id==item.courseType">{{xitem.label}}</span>
                  </span>
                  <a class="operate" target="blank" :href="item.courseUrl" v-if="item.courseType==1&&item.courseUrl">(点击查看)</a>
                </td>
                <td>{{item.price}}</td>
                <td>{{item.teacherName}}</td>
                <td>{{item.replayDate}}</td>
                <td>{{item.seq}}</td>
                <td>
                  <div>
                    <span class="operate" v-if="item.effective==0">无效</span>
                    <span class="operate" v-if="item.effective==1">有效</span>
                  </div>
                </td>
                <td>
                  <router-link tag="span" class="operate" :to="item.chapterUrl">关联课章</router-link>
                  <span class="operate" @click="detail(item)">详情</span>
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
    <el-dialog title="课程详情" :visible.sync="detailVisable" width="50%" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>课程详情</span>
          </div>
        </div>
        <div style="height:500px;overflow-y:auto;">
          <div class="p-c">
            <div class="is">
              <div class="tls">
                <span>课程名称：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.courseName}}</span>
                </div>
              </div>
            </div>
            <!-- <div class="i">
            <div class="tls">
              <span>课程类型：</span>
            </div>
            <div class="tc">
              <div>{{course.courseName}}</div>
            </div>
            </div>-->
            <div class="is">
              <div class="tls">
                <span>项目：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.projectName}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>分类：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.categoryName}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>学科：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.subjectName}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>教师：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.teacherName}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>折扣：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.discount}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>精品课程：</span>
              </div>
              <div class="tc">
                <div v-if="course.isFamous==1">是</div>
                <div v-else>否</div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>一句话简介：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.oneWord}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>课时：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.courseCount}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>价格：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.price}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>发布时间：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.createDate}}</span>
                </div>
              </div>
            </div>
            <div class="is">
              <div class="tls">
                <span>课程介绍：</span>
              </div>
              <div class="tc">
                <div>
                  <span>{{course.introduce}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delVisable" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{course.courseName}}</span>
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

export default {
  name: "CourseList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      editUrl: "/course/edit/0",
      msg: "确定删除这个课程吗?",
      exerciseEditVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      projectList: [],
      subjectList: [],
      categoryList: [],
      teacherList: [],
      enableOptions: [{ id: 1, label: "是" }, { id: 0, label: "否" }],
      pOptions: [
        { id: 1, label: "视频" },
        { id: 2, label: "题库" },
        { id: 3, label: "公开课" },
        { id: 4, label: "每日一练" }
      ],
      courseList: [],
      course: {},
      searchData: {
        conditions: {
          exerciseType: "",
          projectId: null,
          categoryId: null,
          subjectId: null,
          courseName: "",
          sidx: "effective desc,seq",
          order: "esc"
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
    this.addload();
  },
  methods: {
    getData(val) {
      var that = this;
      var param = util.clone(that.searchData);
      param.page.page = val;
      that.loading = true;
      if (param.conditions.projectId != null) {
        param.conditions.projectId += "";
      }
      if (param.conditions.categoryId != null) {
        param.conditions.categoryId += "";
      }
      if (param.conditions.subjectId != null) {
        param.conditions.subjectId += "";
      }
      axios.post(api.api.course.list, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          that.courseList = rdata.page.list;
          that.searchData.page.listTotal = rdata.page.totalCount;
          that.courseList.forEach(function(value) {
            value.chapterUrl = "/chapter/list/" + value.id;
          });
        }
      });
    },
    projectChange() {
      this.searchData.conditions.categoryId = null;
      this.categoryList = [];
      this.searchData.conditions.subjectId = null;
      this.subjectList = [];
      if (this.searchData.conditions.projectId != null) {
        if (this.searchData.conditions.projectId !== "") {
          var that = this;
          var url =
            api.api.category.listByProject +
            "/" +
            this.searchData.conditions.projectId;
          axios.post(url).then(response => {
            that.loading = false;
            var rdata = response.data;
            if (rdata.code == 0) {
              that.categoryList = rdata.list;
            }
          });
        }
      }
    },
    categoryChange() {
      this.searchData.conditions.subjectId = null;
      this.subjectList = [];
      if (this.searchData.conditions.categoryId != null) {
        if (this.searchData.conditions.categoryId !== "") {
          var that = this;
          var url =
            api.api.subject.listByCategory +
            "/" +
            this.searchData.conditions.categoryId;
          axios.post(url).then(response => {
            that.loading = false;
            var rdata = response.data;
            if (rdata.code == 0) {
              that.subjectList = rdata.list;
            }
          });
        }
      }
    },
    addload() {
      var that = this;
      axios.post(api.api.course.addload).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectList = rdata.course.projectList;
          that.teacherList = rdata.course.teacherList;
        }
      });
    },
    save() {
      var that = this;
      var param = that.type;
      axios.post(api.api.course.save, param).then(response => {
        that.loading = false;

        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.exerciseEditVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    del(item) {
      this.course = item;
      this.delVisable = true;
    },
    delData() {
      var param = this.course;
      axios.post(api.api.course.delete, param).then(response => {
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
      this.$router.push({ path: "/course/edit/" + item.id });
    },
    detail(item) {
      this.course = item;
      this.detailVisable = true;
    },
    detailSection(item) {
      console.log(item.id);
    },
    update(item, effective) {
      item.effective = effective;
      axios.post(api.api.course.updateEffective, item).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: rdata.msg,
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
          exerciseType: null,
          courseName: "",
          sidx: "seq",
          order: "asc"
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
