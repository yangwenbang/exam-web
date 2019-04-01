<template>
  <div>
    <div class="head-c">
      <router-link tag="span" class="bread-item lk" :to="courseUrl">课程({{course.courseName}})</router-link>
      <span class="bread-item">></span>
      <router-link tag="span" class="bread-item lk" :to="chapterUrl">{{chapter.chapterName}}</router-link>
      <span class="bread-item">></span>
      <router-link tag="span" class="bread-item lk" :to="sectionUrl">{{section.sectionName}}</router-link>
      <span class="bread-item">></span>
      <span class="bread-item">题库列表</span>
      <div style="float:right;">
        <router-link tag="button" class="cb" :to="sectionUrl">返 回</router-link>
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
                    <span class="ct">题库名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.courseName">
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
            <span>题库列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" :to="addurl">单个添加</router-link>
              <span class @click="patchItems">批量导入</span>
              <span class @click="downloadMould">下载模板</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">题目内容</div>
                </th>
                <th>
                  <div class="ll">题型名称</div>
                </th>
                <th>
                  <div>题目图片</div>
                </th>
                <th>
                  <div class="ll">候选项</div>
                </th>
                <th>
                  <div class="ll">正确答案</div>
                </th>
                <th>
                  <div class="ll">分数</div>
                </th>
                <th>操作</th>
              </tr>
              <tr v-for="item in conList" :key="item.id">
                <td>
                  <div class="ll">{{item.exerciseContent}}</div>
                </td>
                <td>
                  <div class="ll">{{item.exerciseName}}</div>
                </td>
                <td>
                  <div v-if="item.exerciseContentPicture" class="pi-c">
                    <img :src="item.exerciseContentPicture" class="pi">
                  </div>
                  <div v-else>无</div>
                </td>
                <td>
                  <div class="ll">{{item.optionss}}</div>
                </td>
                <td>
                  <div class="ll">{{item.rightAnswer}}</div>
                </td>
                <td>
                  <div class="ll">{{item.score}}</div>
                </td>
                <td>
                  <router-link tag="span" class="operate" :to="item.editUrl">编辑</router-link>
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
    <el-dialog title="批量导入题库" :visible.sync="patchVisible" width="80%" center>
      <div class="cfile" v-show="file.path.length==0">
        <div :class="[ 'lb', {'lh': file.path.length!=0}]">
          <button class="lt" @click="selectFiles">请选择文件</button>
          <input
            class="sf"
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
        </div>
      </div>
      <div class="panel">
        <div class="p-c" style="margin:0;">
          <table class="comTb">
            <tr>
              <th>
                <div class="ll">题型名称</div>
              </th>
              <th>
                <div class="ll">题目内容</div>
              </th>
              <th>
                <div class="ll">可选项</div>
              </th>
              <th>
                <div class="ll">答案</div>
              </th>
              <th>
                <div class="ll">答案解析</div>
              </th>
              <th>分数</th>
              <th>
                <div class="ll">备注</div>
              </th>
            </tr>
            <tr v-for="item in importConList" :key="item.id">
              <td>
                <div class="ll">
                  <span :class="{red : item.exerciseTypeId==0}">{{item.exerciseTypeName}}</span>
                </div>
              </td>
              <td>
                <div class="ll">{{item.exerciseContent}}</div>
              </td>
              <td>
                <div class="ll">{{item.optionss}}</div>
              </td>
              <td>
                <div class="ll">{{item.rightAnswer}}</div>
              </td>
              <td>
                <div class="ll">{{item.answerAnalysis}}</div>
              </td>
              <td>{{item.score}}</td>
              <td>
                <div class="ll">{{item.remark}}</div>
              </td>
            </tr>
          </table>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="excelImport">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- <el-dialog title="编辑题库" :visible.sync="exerciseEditVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑题库</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>题目内容：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入题目内容"
                v-model="exerciseContent.exerciseContent"
              >
            </div>
          </div>
          <div class="i" style="height: 100px;">
            <div class="tl">
              <span>题目图片：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload" :imgPath="exerciseContent.exerciseContentPicture"></fileUpload>
            </div>
          </div>
          <div style="clear:both;"></div>
          <div class="i">
            <div class="tl">
              <span>题型：</span>
            </div>
            <div class="tr">
              <el-select
                id="input-exerc-typeid"
                v-model="exerciseContent.exerciseTypeId"
                clearable
                placeholder="请选择题型"
              >
                <el-option
                  v-for="item in typeAllList"
                  :key="item.id"
                  :label="item.exerciseName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>可选项：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入可选项"
                v-model="exerciseContent.optionss"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>正确答案：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入正确答案"
                v-model="exerciseContent.rightAnswer"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>分数：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="分数" v-model="exerciseContent.score">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>答案解析：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入答案解析"
                v-model="exerciseContent.answerAnalysis"
              >
            </div>
          </div>
          <div class="i" style="height: 100px;">
            <div class="tl">
              <span>答案解析图片：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload1" :imgPath="exerciseContent.exerciseAnswerPicture"></fileUpload>
            </div>
          </div>
          <div style="clear:both"></div>
          <div class="i">
            <div class="tl">
              <span>备注：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入答案解析"
                v-model="exerciseContent.remark"
              >
            </div>
          </div>

          <div class="i" style="text-align: center;">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>-->
    <el-dialog title="提示" :visible.sync="delVisable" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{exerciseContent.exerciseContentName}}</span>
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
  name: "ExecriseList",
  components: {
    routerPaging,
    userSelect,
    fileUpload
  },
  data() {
    return {
      msg: "确定删除这道题目吗?",
      editurl: "/exercisecontent/edit/" + this.$route.params.sectionId,
      addurl: "/exercisecontent/edit/" + this.$route.params.sectionId + "/0",
      courseUrl: "/course/list",
      chapterUrl: "/chapter/list/" + this.$route.params.courseId,
      sectionUrl:
        "/section/list/" +
        this.$route.params.courseId +
        "/" +
        this.$route.params.chapterId,
      sectionId: this.$route.params.sectionId,
      exerciseEditVisable: false,
      detailVisable: false,
      delVisable: false,
      loading: true,
      patchVisible: false,
      conList: [],
      course: {},
      chapter: {},
      section: {},
      exerciseContent: {
        exerciseContentPicture: null
      },
      importConList: [],
      file: {
        path: ""
      },
      typeAllList: [],
      searchData: {
        conditions: {
          sectionId: this.$route.params.sectionId,
          courseName: "",
          sidx: "",
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
    this.getTypes();
    this.getCourse();
    this.getCharpter();
    this.getSection();
  },
  methods: {
    selectFiles() {
      let that = this;
      $(".sf").trigger("click");
      $(".sf").on("click", function() {
        var file = $(".sf")[0].files[0];
        var reg = /(.*)\.(xls|xlsx|csv)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传excel文件");
        } else {
          that.file.path = file.name;
          that.uploadFile(file);
        }
      });
      $(".sf").on("change", function() {
        var file = $(".sf")[0].files[0];
        var reg = /(.*)\.(xls|xlsx|csv)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传excel文件");
        } else {
          that.file.path = file.name;
          that.uploadFile(file);
        }
      });
    },
    uploadFile(file) {
      var that = this;
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // 通过append向form对象添加数据
      param.append("chunk", "0"); // 添加form表单中其他数据
      axios.post(api.api.file.readexcel, param).then(response => {
        var rdata = response.data;
        if (rdata.code === 0) {
          var deviceData = rdata.list;
          var itemColumn = {
            exerciseTypeName: 0,
            score: 1,
            exerciseContent: 2,
            optionss: 3,
            rightAnswer: 4,
            answerAnalysis: 5,
            remark: 6
          };
          var columnNames = Object.values(deviceData[0]);
          for (var j = 0; j < columnNames.length; j++) {
            var name = columnNames[j];
            if (name == "题型名称") {
              itemColumn.exerciseTypeName = j;
            }
            if (name == "分数") {
              itemColumn.score = j;
            }
            if (name == "题目内容") {
              itemColumn.exerciseContent = j;
            }
            if (name == "可选项") {
              itemColumn.optionss = j;
            }
            if (name == "答案") {
              itemColumn.rightAnswer = j;
            }
            if (name == "答案解析") {
              itemColumn.answerAnalysis = j;
            }
            if (name == "备注") {
              itemColumn.remark = j;
            }
          }
          for (var i = 2; i < deviceData.length; i++) {
            console.log(deviceData[i]);
            var dataitem = Object.values(deviceData[i]);
            var item = {
              exerciseTypeName: dataitem[itemColumn.exerciseTypeName],
              exerciseTypeId: 0,
              score: dataitem[itemColumn.score],
              exerciseContent: dataitem[itemColumn.exerciseContent],
              optionss: dataitem[itemColumn.optionss],
              rightAnswer: dataitem[itemColumn.rightAnswer],
              answerAnalysis: dataitem[itemColumn.answerAnalysis],
              remark: dataitem[itemColumn.remark],
              sectionId: that.sectionId
            };
            console.log(item);
            that.tidy(item);
            that.importConList.push(item);
          }
        }
      });
    },
    getData(val) {
      var that = this;
      var param = that.searchData;
      that.searchData.page.page = val;
      that.loading = true;
      axios
        .post(api.api.execrisetype.conlist, param)
        .then(response => {
          that.loading = false;
          var rdata = response.data;
          if (rdata.code == 0) {
            that.conList = rdata.page.list;
            that.conList.forEach(item => {
              item.editUrl = that.editurl + "/" + item.id;
            });
            that.searchData.page.listTotal = rdata.page.totalCount;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getTypes() {
      var that = this;
      axios.post(api.api.execrisetype.listall).then(response => {
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
    getCharpter() {
      var that = this;
      var url = api.api.chapter.info + "/" + this.$route.params.chapterId;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.chapter = rdata.chapter;
        }
      });
    },
    getSection() {
      var that = this;
      var url = api.api.section.info + "/" + this.$route.params.sectionId;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.section = rdata.section;
        }
      });
    },
    getContent(item) {
      var that = this;
      var url = api.api.execrisetype.coninfo + "/" + item.id;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.exerciseContent = rdata.exerciseContent;
        }
      });
    },
    save() {
      var that = this;
      var param = that.exerciseContent;
      param.createDate = null;
      param.updateTime = null;
      param.sectionId = this.$route.params.sectionId;
      param.exerciseContentPicture = that.$refs.fileUpload.$data.img.urlPath;
      axios.post(api.api.execrisetype.consave, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.getData(1);
          that.exerciseEditVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    patchItems() {
      this.importConList = [];
      this.file.path = "";
      this.patchVisible = true;
    },
    tidy(item) {
      this.typeAllList.forEach(element => {
        if (element.exerciseName == item.exerciseTypeName) {
          item.exerciseTypeId = element.id;
        }
      });
    },
    excelImport() {
      var that = this;
      var errorparam = [];
      that.importConList.forEach(item => {
        if (item.exerciseTypeId == 0) {
          errorparam.push(item);
        }
      });
      if (errorparam.length == 0) {
        var param = that.importConList;
        axios.post(api.api.execrisetype.conpatchsave, param).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            this.$message({
              message: "导入成功",
              type: "success"
            });
            that.patchVisible = false;
            that.getData(1);
          } else {
            this.$message.error("导入失败" + rdata.msg);
          }
        });
      } else {
        this.$message.error(
          "导入失败:请输入正确的题型名称;解决方法：查询题型管理，填写正确的题型名称"
        );
      }
    },
    del(item) {
      this.exerciseContent = util.clone(item);
      this.delVisable = true;
    },
    delData() {
      var param = this.exerciseContent;
      axios.post(api.api.execrisetype.condelete, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData(1);
          this.delVisable = false;
        } else {
          this.$message.error("删除失败" + rdata.msg);
        }
        this.delVisable = false;
      });
    },
    info(item) {
      this.getContent(item);
      this.exerciseEditVisable = true;
    },
    detail(item) {
      this.exerciseContent = util.clone(item);
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
      this.getData(1);
    },
    add() {
      this.exerciseContent = {};
      this.exerciseEditVisable = true;
    },
    downloadMould() {
      window.open("../../../static/file/题库导入模板.xls");
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
  max-width: 300px;
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
