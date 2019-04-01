<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑教师</span>
      <div style="float:right;">
        <router-link tag="button" class="cb" :to="returnUrl">返 回</router-link>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑教师</span>
          </div>
        </div>
        <div style="height:500px;">
          <div class="p-c">
            <div class="i2">
              <div class="tl">
                <span>教师名称：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入教师名称"
                  v-model="teacher.teacherName"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>所教科目：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="teacher.subjectId"
                  clearable
                  placeholder="请选择所教科目"
                  id="input-exerc-typeid"
                >
                  <el-option
                    v-for="item in subjectList"
                    :key="item.id"
                    :label="item.subjectName"
                    :value="item.subjectName"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>教学特长：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入教学特长"
                  v-model="teacher.teacherSpecial"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>教龄(年)：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入教龄"
                  v-model="teacher.teacherLength"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>学历：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入学历"
                  v-model="teacher.education"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>名师推荐：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="teacher.isFamous "
                  clearable
                  placeholder="请选择是否名师推荐"
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
                <span>手机号：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入教师手机号"
                  v-model="teacher.teacherMobile"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>教师密码：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="password"
                  placeholder="请输入教师密码"
                  v-model="teacher.teacherPassword"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>性别：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="teacher.sex"
                  clearable
                  placeholder="请选择性别"
                  id="input-exerc-typeid"
                >
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>所在城市：</span>
              </div>
              <div class="tr">
                <el-select
                  v-model="teacher.cityId"
                  clearable
                  placeholder="请选择类型"
                  id="input-exerc-typeid"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.cityName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>联系地址：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入联系地址"
                  v-model="teacher.homeAddress"
                >
              </div>
            </div>
            <div class="i2">
              <div class="tl">
                <span>邮箱地址：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入邮箱地址" v-model="teacher.email">
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
                  v-model="teacher.oneWord"
                >
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="i2" style="height: 120px;">
              <div class="tl">
                <span>教师图片：</span>
              </div>
              <div class="tr">
                <fileUpload ref="fileUpload" :imgPath="teacher.headPictureUrl"></fileUpload>
              </div>
            </div>
            <div class="i2" style="height：100px">
              <div class="tl">
                <span>教师简介：</span>
              </div>
              <div class="tr">
                <textarea
                  style="height:100px;width:388px;padding:3px;"
                  placeholder="请输入教师简介"
                  v-model="teacher.teacherIntroduce"
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
  name: "TeacherEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      teacher: {
        teacherMobile: null,
        teacherPassword: null,
        teacherName: null,
        sex: null,
        cityId: null,
        homeAddress: null,
        email: null,
        teacherIntroduce: null,
        teacherSpecial: null,
        teacherLength: null,
        education: null,
        headPictureUrl: null,
        isFamous: null,
        subjectId: null,
        subjectName: null,
        oneWord: null
      },
      returnUrl: "/teacherlist",
      cityList: [],
      subjectList: [],
      teacherList: [],
      enableOptions: [{ id: 1, label: "是" }, { id: 0, label: "否" }],
      sexOptions: [{ id: 1, label: "男" }, { id: 0, label: "女" }]
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
        var url = api.api.teacher.info + "/" + id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.teacher = rdata.teacher.teacherEntity;
            console.log(that.teacher);
          } else {
            this.$message.error("查询教师失败：" + rdata.msg);
          }
        });
      }
    },
    save() {
      var that = this;
      var param = that.teacher;
      param.updateTime = null;
      param.createTime = null;
      param.headPictureUrl = this.$refs.fileUpload.$data.img.urlPath;
      axios.post(api.api.teacher.save, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          window.history.go(-1);
          that.exerciseEditVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    addload() {
      var that = this;
      axios.post(api.api.teacher.load).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.cityList = rdata.teacher.cityList;
          that.subjectList = rdata.teacher.subjectList;
        }
      });
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
          that.teacher.replayDate = picker.currentTarget.value;
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
