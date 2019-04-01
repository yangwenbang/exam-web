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
                <span>题目图片：</span>
              </div>
              <div class="tr">
                <fileUpload :imgPath="exerciseContent.exerciseContentPicture" v-on:change="setImg"></fileUpload>
              </div>
            </div>
            <div class="i" style="height: 100px;">
              <div class="tl">
                <span>答案解析图片：</span>
              </div>
              <div class="tr">
                <fileUpload
                  :imgPath="exerciseContent.exerciseAnswerPicture"
                  v-on:change="setImgAnswer"
                ></fileUpload>
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
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "ExecriseContentEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      exerciseContent: {},
      typeAllList: [],
      contentpics: [],
      answerpics: []
    };
  },
  created() {
    this.getTypes();
    this.getContent();
  },
  methods: {
    getTypes() {
      var that = this;
      axios.post(api.api.execrisetype.listall).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.typeAllList = rdata.list;
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
          }
        });
      }
    },
    goback() {
      window.history.go(-1);
    },
    setImg(url) {
      this.exerciseContent.exerciseContentPicture = url;
    },
    setImgAnswer(url) {
      this.exerciseContent.exerciseAnswerPicture = url;
    },
    save() {
      var that = this;
      var param = that.exerciseContent;
      param.createDate = null;
      param.updateTime = null;
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
</style>
