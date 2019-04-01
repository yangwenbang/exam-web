<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑课程</span>
      <div style="float:right;">
        <router-link tag="button" class="cb" :to="returnUrl">返 回</router-link>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑课程</span>
          </div>
        </div>
        <div style="height:500px;">
          <div class="p-c">
            <div class="i2">
              <div class="tl">
                <span>课程名称：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入课程名称"
                  v-model="course.courseName"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>课程类型：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.courseType"
                  clearable
                  placeholder="请选择类型"
                  id="input-exerc-typeid"
                >
                  <el-option
                    v-for="item in pOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>项目：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.projectId"
                  clearable
                  placeholder="请选择项目"
                  id="input-exerc-typeid"
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
            <div class="i2">
              <div class="tl">
                <span>分类：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.categoryId"
                  clearable
                  placeholder="请选择分类"
                  id="input-exerc-typeid"
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
            <div class="i2">
              <div class="tl">
                <span>学科：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.subjectId"
                  clearable
                  placeholder="请选择学科"
                  id="input-exerc-typeid"
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
            <div class="i2">
              <div class="tl">
                <span>教师：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.teacherId"
                  clearable
                  placeholder="请选择教师"
                  id="input-exerc-typeid"
                >
                  <el-option
                    v-for="item in teacherList"
                    :key="item.id"
                    :label="item.teacherName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>精品课程：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="course.isFamous"
                  clearable
                  placeholder="请选择是否精品课程"
                  id="input-exerc-typeid"
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
            <div class="i2">
              <div class="tl">
                <span>一句话：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入一句话简介："
                  v-model="course.oneWord"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>课时数：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入课时数"
                  v-model="course.courseCount"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>价格：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入价格" v-model="course.price">
              </div>
            </div>
            <div class="i2" v-if="course.courseType==1">
              <div class="tl">
                <span>视频链接：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入视频链接" v-model="course.courseUrl">
              </div>
            </div>
            <!-- <div class="i2">
              <div class="tl">
                <span>折扣：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入折扣" v-model="course.discount">
              </div>
            </div>-->
            <div class="i2">
              <div class="tl">
                <span>排序：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" v-model="course.seq">
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="i2" style="height: 120px;">
              <div class="tl">
                <span>课程图片：</span>
              </div>
              <div class="tr">
                <fileUpload ref="fileUpload" :imgPath="course.pictureUrl"></fileUpload>
              </div>
            </div>
            <div class="i2" style="height：100px">
              <div class="tl">
                <span>备注：</span>
              </div>
              <div class="tr">
                <textarea
                  style="height:100px;width:388px;padding:3px;"
                  placeholder="请输入备注"
                  v-model="course.introduce"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div class="pf">
          <button class="btn" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from "../../config/apiConfig";
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "CourseEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      returnUrl: "/course/list",
      course: {
        courseName: null,
        courseType: null,
        pictureUrl: null,
        oneWord: null,
        introduce: null,
        teacherId: null,
        teacherName: null,
        courseCount: null,
        price: null,
        discount: null,
        projectId: null,
        categoryId: null,
        subjectId: null,
        effective: 1,
        replayDate: null,
        replayUsername: null,
        seq: null,
        projectName: null,
        categoryName: null,
        subjectName: null,
        isFamous: null
      },
      projectList: [],
      categoryList: [],
      subjectList: [],
      teacherList: [],
      enableOptions: [{ id: 1, label: "是" }, { id: 0, label: "否" }],
      pOptions: [
        { id: 1, label: "视频" },
        { id: 2, label: "题库" },
        { id: 3, label: "公开课" },
        { id: 4, label: "每日一练" }
      ]
    };
  },
  created() {
    this.addload();
    this.getinfo();
  },
  mounted() {
    this.setDateTimePick();
  },
  methods: {
    getinfo() {
      var that = this;
      var id = this.$route.params.id;
      console.log(id);
      if (id != null && id > 0) {
        var url = api.api.course.info + "/" + id;
        axios.post(url).then(response => {
          
          var rdata = response.data;
          if (rdata.code == 0) {
            this.course = rdata.course;
          } else {
            this.$message.error("查询课程失败：" + rdata.msg);
          }
        });
      }
    },
    save() {
      var that = this;
      var param = that.course;
      var imgpath = this.$refs.fileUpload.$data.img.urlPath;
      if (imgpath != null && imgpath.length > 0) {
        param.pictureUrl = imgpath;
      }
      axios.post(api.api.course.save, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.exerciseEditVisable = false;
          window.history.go(-1);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    addload() {
      var that = this;
      axios.post(api.api.course.addload).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectList = rdata.course.projectList;
          that.categoryList = rdata.course.categoryList;
          that.subjectList = rdata.course.subjectList;
          that.teacherList = rdata.course.teacherList;
        }
      });
    },
    projectChange() {
      this.course.categoryId = null;
      this.course.subjectId = null;
      this.categoryList = [];
      this.subjectList = [];
      if (this.course.projectId != null) {
        if (this.course.projectId !== "") {
          this.course.categoryId = null;
          var that = this;
          var url =
            api.api.category.listByProject + "/" + this.course.projectId;
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
      console.log(this.course.categoryId);
      this.course.subjectId = null;
      this.subjectList = [];
      if (this.course.categoryId != null) {
        if (this.course.categoryId !== "") {
          var that = this;
          var url =
            api.api.subject.listByCategory + "/" + this.course.categoryId;
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
    setDateTimePick() {
      console.log(111);
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
          that.course.replayDate = picker.currentTarget.value;
        });
    }
  }
};
</script>
<style scoped>
.panel .tr {
  position: relative;
}
.panel .tip {
  position: absolute;
  left: 12px;
  font-size: 12px;
  color: #c6303e;
  text-align: left;
  margin: 5px auto;
  width: 250px;
}
.panel .not {
  background-color: rgba(49, 195, 166, 0.5);
  cursor: not-allowed;
}
</style>
