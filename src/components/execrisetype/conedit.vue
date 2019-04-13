<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑题型</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑课程</span>
          </div>
        </div>
        <div>
          <div class="p-c">
            <div class="i">
              <div class="tl">
                <span>题目内容：</span>
              </div>
              <div class="tr">
                <textarea
                  class="itext"
                  placeholder="请输入题目内容"
                  v-model="exerciseContent.exerciseContent"
                ></textarea>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="i">
              <div class="tl">
                <span>题型：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
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
            <div v-if="exerciseContent.exerciseTypeId!=optionc">
              <div class="i">
                <div class="tl">
                  <span>答案选项类型：</span>
                </div>
                <div class="tr">
                  <el-select
                    el="select"
                    v-model="optiontype"
                    @change="changeOptionType"
                    clearable
                    placeholder="请选择答案选项类型"
                  >
                    <el-option
                      v-for="item in optiontypes"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>

              <div class="i" v-show="optiontype==0">
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
              <div class="i" style="height: 100px;" v-show="optiontype==1">
                <div class="tl">
                  <span>答案选项图片：</span>
                </div>
                <div class="tr">
                  <imgupload :imgPath="exerciseContent.optionss" v-on:change="setOptionImg"></imgupload>
                </div>
              </div>
            </div>
            <div style="clear:both"></div>
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
                <input
                  class="add-input"
                  type="text"
                  placeholder="分数"
                  v-model="exerciseContent.score"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>答案解析：</span>
              </div>
              <div class="tr">
                <textarea
                  class="itext"
                  placeholder="请输入答案解析"
                  v-model="exerciseContent.answerAnalysis"
                ></textarea>
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>备注：</span>
              </div>
              <div class="tr">
                <textarea class="itext" placeholder="请输入备注" v-model="exerciseContent.remark"></textarea>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="i" style="height: 100px;">
              <div class="tl">
                <span>题目中图片：</span>
              </div>
              <div class="tr">
                <imgupload :imgPath="exerciseContent.exerciseContentPicture" v-on:change="setImg"></imgupload>
              </div>
            </div>

            <div class="i" style="height: 100px;">
              <div class="tl">
                <span>答案解析图片：</span>
              </div>
              <div class="tr">
                <imgupload
                  :imgPath="exerciseContent.exerciseAnswerPicture"
                  v-on:change="setImgAnswer"
                ></imgupload>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="pf">
              <button class="btn" @click="save">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from "../../config/apiConfig";
import imgupload from "@/components/child-components/imgupload";

export default {
  name: "ExecriseContentEdit",
  components: {
    imgupload
  },
  data() {
    return {
      backurl: "",
      exerciseContent: {},
      optiontypes: [{ id: 0, label: "文字选项" }, { id: 1, label: "图片选项" }],
      optiontype: 0,
      typeAllList: [],
      contentpics: [],
      answerpics: [],
      optionpics: [],
      optionssBack: "",
      optionc: 0
    };
  },
  created() {
    this.getBackurl();
    this.getTypes();
    this.getContent();
  },
  methods: {
    getBackurl() {
      var url = window.location.href;
      var urlindex = url.indexOf("#url");
      if (urlindex > 0) {
        this.backurl = url.substring(urlindex + 5, url.length);
      }
    },
    getTypes() {
      var that = this;
      axios.post(api.api.execrisetype.listall).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.typeAllList = rdata.list;
          that.typeAllList.forEach(item => {
            if (item.exerciseName == "问答题") {
              that.optionc = item.id;
            }
          });
        }
      });
    },
    getContent() {
      var that = this;
      if (this.$route.params.id != 0) {
        var url = api.api.execrisetype.coninfo + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.exerciseContent = rdata.exerciseContent;
            if (that.exerciseContent.optionss.indexOf("JX-IMG-") > -1) {
              that.optiontype = 1;
              that.optionssBack = that.exerciseContent.optionss;
            } else {
              that.optiontype = 0;
            }
          }
        });
      }
    },
    goback() {
      window.history.go(-1);
    },
    setImg(datas) {
      this.contentpics = datas;
      console.log(datas);
    },
    setImgAnswer(datas) {
      this.answerpics = datas;
    },
    setOptionImg(datas) {
      var that = this;
      this.optionpics = datas;
      if (that.optionpics.length > 0) {
        this.exerciseContent.optionss = "";
        that.optionpics.forEach(item => {
          if (item.urlPath.length > 0) {
            var path = "JX-IMG-" + item.urlPath + ";";
            that.optionssBack = that.exerciseContent.optionssBack + path;
          }
        });
      }
    },
    changeOptionType() {
      var that = this;
      if (that.optiontype == 0) {
        that.exerciseContent.optionss = "";
      } else if (that.optiontype == 1) {
        that.exerciseContent.optionss = that.optionssBack;
      }
    },
    save() {
      var that = this;
      var param = util.clone(that.exerciseContent);
      if (that.contentpics.length > 0) {
        param.exerciseContentPicture = "";
        that.contentpics.forEach(item => {
          if (item.urlPath.length > 0) {
            var path = item.urlPath + ";";
            param.exerciseContentPicture = param.exerciseContentPicture + path;
          }
        });
      }
      if (that.answerpics.length > 0) {
        param.exerciseAnswerPicture = "";
        that.answerpics.forEach(item => {
          if (item.urlPath.length > 0) {
            var path = item.urlPath + ";";
            param.exerciseAnswerPicture = param.exerciseAnswerPicture + path;
          }
        });
      }
      if (that.optionpics.length > 0) {
        param.optionss = "";
        that.optionpics.forEach(item => {
          if (item.urlPath.length > 0) {
            var path = "JX-IMG-" + item.urlPath + ";";
            param.optionss = param.optionss + path;
          }
        });
      }
      param.sectionId = this.$route.params.sectionId;
      axios.post(api.api.execrisetype.consave, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          window.history.go(-1);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.panel .p-c .i .tr input#input-exerc-typeid {
  width: 896px;
}

.panel .p-c .i .tr .itext {
  width: 883px;
  height: 80px;
}

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
@media screen and (max-width: 1400px) {
  .panel .p-c .i .tr .itext {
    width: 600px;
  }
}
</style>
