<template>
  <div>
    <div class="head-c">
      <router-link tag="span" class="bread-item lk" :to="courseUrl">{{course.courseName}}</router-link>
      <span class="bread-item">></span>
      <router-link tag="span" class="bread-item lk" :to="chapterUrl">{{chapter.chapterName}}</router-link>
      <span class="bread-item">></span>
      <span class="bread-item">节列表</span>
      <div style="float:right;">
        <router-link tag="button" class="cb" :to="chapterUrl">返 回</router-link>
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
                    <span class="ct">节名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.find">
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
            <span>节列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class @click="add">添加数据</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">节名称</div>
                </th>
                <th v-if="course.courseType!=2">节长度</th>
                <th>课件类型</th>
                <th v-if="course.courseType==2||course.courseType==4">题库抬头</th>
                <!-- <th v-if="course.courseType==2||course.courseType==4">题型模板</th> -->
                <th v-if="course.courseType==2||course.courseType==4">题目数</th>
                <th v-if="course.courseType!=2&&course.courseType!=4">内容地址</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in sectionlist" :key="item.id">
                <td>
                  <div class="ll">{{item.sectionName}}</div>
                </td>
                <td v-if="course.courseType!=2">{{item.timeLength}}</td>
                <td>
                  <span v-for="xitem in pOptions" :key="xitem.id">
                    <span v-if="item.sectionType==xitem.id">{{xitem.label}}</span>
                  </span>
                </td>
                <td v-if="course.courseType==2||course.courseType==4">{{item.examTitle}}</td>
                <!-- <td v-if="course.courseType==2||course.courseType==4">
                  <span v-for="xitem in typeAllList" :key="xitem.id">
                    <span v-if="xitem.id==item.exerciseModelId">{{xitem.modelName}}</span>
                  </span>
                </td>-->
                <td v-if="course.courseType==2||course.courseType==4">{{item.exerciseCount}}</td>
                <td v-if="course.courseType!=2&&course.courseType!=4">{{item.sectionUrl}}</td>
                <td>{{item.remark}}</td>
                <td>
                  <router-link
                    v-if="course.courseType==2||course.courseType==4"
                    tag="span"
                    class="operate"
                    :to="item.exercontentUrl"
                  >关联题库</router-link>
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
    <el-dialog title="编辑课节" :visible.sync="exerciseEditVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑课节</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>课节名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入课节名称"
                v-model="section.sectionName"
              >
            </div>
          </div>
          <div class="i" v-if="course.courseType==2||course.courseType==4">
            <div class="tl">
              <span>题库抬头：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入题库抬头"
                v-model="section.examTitle"
              >
            </div>
          </div>
          <!-- <div class="i" v-if="course.courseType==2||course.courseType==4">
            <div class="tl">
              <span>题型模板：</span>
            </div>
            <div class="tr">
              <el-select
                id="input-exerc-typeid"
                v-model="section.exerciseModelId"
                clearable
                placeholder="题型模板"
              >
                <el-option
                  v-for="item in typeAllList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>-->
          <div class="i" v-if="course.courseType!=2">
            <div class="tl">
              <span>节长度：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入节长度"
                v-model="section.timeLength"
              >
            </div>
          </div>
          <div class="i" v-if="course.courseType!=2">
            <div class="tl">
              <span>课件内容网址：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入课件内容网址"
                v-model="section.sectionUrl"
              >
            </div>
          </div>
          <!-- <div class="i" v-if="course.courseType!=2">
            <div class="tl">
              <span>资料内容：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入资料内容"
                v-model="section.sectionContent"
              >
            </div>
          </div>-->
          <div class="i">
            <div class="tl">
              <span>备注：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入备注" v-model="section.remark">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>排序(小号排前)：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入课节排序" v-model="section.seq">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>是否免费：</span>
            </div>
            <div class="tr">
              <el-select
                id="input-exerc-typeid"
                v-model="section.free"
                clearable
                placeholder="是否免费"
              >
                <el-option
                  v-for="item in enableOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>

          <!-- <div class="i">
            <div class="tl">
              <span>讲义：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入课节讲义" v-model="section.handout">
            </div>
          </div>-->
          <div class="pf">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="delVisable" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{section.sectionName}}</span>
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
  name: "SectionList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      courseUrl: "/course/list",
      courseId: this.$route.params.courseId,
      chapterId: this.$route.params.chapterId,
      chapterUrl: "/chapter/list/" + this.$route.params.courseId,
      msg: "确定删除这个节(删除节将同时删除该节下的所有题目)吗?",
      exerciseEditVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      enableOptions: [{ id: 1, label: "免费" }, { id: 0, label: "不免费" }],
      pOptions: [
        { id: 0, label: "资料" },
        { id: 1, label: "视频" },
        { id: 2, label: "题库" },
        { id: 3, label: "公开课" },
        { id: 4, label: "每日一练" }
      ],
      typeAllList: [],
      section: {},
      sectionlist: [],
      course: {},
      chapter: {},
      searchData: {
        conditions: {
          chapterId: this.$route.params.chapterId,
          find: null,
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
    this.getTypes();
    this.getData(1);
    this.getCourse();
    this.getChapter();
  },
  methods: {
    getData(val) {
      var that = this;
      var param = that.searchData;
      that.searchData.page.page = val;
      that.loading = true;
      axios.post(api.api.course.sectionlist, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.sectionlist = rdata.page.list;
          that.sectionlist.forEach(item => {
            item.exercontentUrl =
              "/execrise/list/" +
              that.courseId +
              "/" +
              that.chapterId +
              "/" +
              item.id;
          });
          that.searchData.page.listTotal = rdata.page.totalCount;
        }
      });
    },
    getTypes() {
      var that = this;
      axios.post(api.api.execrisetype.modelall).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.typeAllList = rdata.list;
        }
      });
    },
    getCourse() {
      var that = this;
      var url = api.api.course.info + "/" + this.$route.params.courseId;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.course = rdata.course;
        }
      });
    },
    getChapter() {
      var that = this;
      var url = api.api.chapter.info + "/" + this.$route.params.chapterId;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.chapter = rdata.chapter;
        }
      });
    },
    save() {
      var that = this;
      that.section.chapterId = that.chapterId;
      that.section.createTime = null;
      that.section.updateTime = null;
      var param = that.section;
      axios.post(api.api.section.save, param).then(response => {
        that.loading = false;
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
      this.section = item;
      this.delVisable = true;
    },
    delData() {
      var param = this.section;
      axios.post(api.api.section.delete, param).then(response => {
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
    add() {
      this.section = {
        free: 1
      };
      this.section.sectionType = this.course.courseType;
      this.exerciseEditVisable = true;
    },
    info(item) {
      this.section = util.clone(item);
      if (this.section.exerciseModelId == 0) {
        this.section.exerciseModelId = null;
      }
      this.exerciseEditVisable = true;
    },
    detail(item) {
      this.course = item;
      this.detailVisable = true;
    },
    reSearch() {
      this.getData(1);
    },
    reset() {
      var resetData = {
        conditions: {
          isEnable: null,
          phone: "",
          username: "",
          startTime: "",
          endTime: ""
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      };
      this.searchData = resetData;
      this.$refs.devListPager.init();
      this.$refs.userSelect.delItem();
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
