<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑资讯</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑资讯</span>
          </div>
        </div>
        <div>
          <div class="p-c">
            <div class="fphone">
              <div class="i">
                <div class="tl">
                  <span>资讯标题：</span>
                </div>
                <div class="tr">
                  <input
                    class="add-input"
                    type="text"
                    placeholder="请输入资讯标题"
                    v-model="newsMsg.msgName"
                  >
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>资讯简介：</span>
                </div>
                <div class="tr">
                  <input
                    class="add-input"
                    type="text"
                    placeholder="请输入资讯简介(该项将作为分享的简介)"
                    v-model="newsMsg.oneWord"
                  >
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>所属项目：</span>
                </div>
                <div class="tr">
                  <el-select
                    el="select"
                    v-model="newsMsg.projectId"
                    clearable
                    placeholder="请选择所属项目"
                    @change="projectChange"
                  >
                    <el-option
                      v-for="item in projectlist"
                      :key="item.id"
                      :label="item.projectName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>资讯类别：</span>
                </div>
                <div class="tr">
                  <el-select
                    el="select"
                    v-model="newsMsg.msgTypeId"
                    clearable
                    placeholder="请选择资讯类别"
                  >
                    <el-option
                      v-for="item in pMsgTypes"
                      :key="item.id"
                      :label="item.typeName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>排序：</span>
                </div>
                <div class="tr">
                  <input class="add-input" type="text" placeholder="请输入排序" v-model="newsMsg.seq">
                </div>
              </div>
            </div>
            <div class="fphone">
              <div class="i">
                <div class="tl">
                  <span>资讯内容：</span>
                </div>
                <div class="tr">
                  <div class="kd">
                    <div class="ckeditor">
                      <textarea id="editor"></textarea>
                    </div>
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
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from "../../config/apiConfig";
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "newsMsgEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      newsMsg: {
        projectId: null,
        msgTypeId: null,
        msgContent: "",
        msgName: "",
        oneWord: "",
        seq: null
      },
      projectlist: [],
      pMsgTypes: [],
      msgTypes: []
    };
  },
  created() {
    this.getTypes();
    this.getProjects();
  },
  mounted() {
    var that = this;
    CKEDITOR.replace("editor", {
      filebrowserImageUploadUrl: api.api.file.upload,
      language: "zh-cn",
      height: 500
    });
    CKEDITOR.on("instanceReady", function(e) {
      that.getInfo();
    });
  },
  methods: {
    projectChange() {
      var that = this;
      this.newsMsg.msgTypeId=null;
      that.pMsgTypes = [];
      if (that.newsMsg.projectId != null) {
        if (that.newsMsg.projectId !== "") {
          that.msgTypes.forEach(item => {
            if (item.projectId == that.newsMsg.projectId) {
              console.log(item);
              that.pMsgTypes.push(item);
            }
          });
        }
      }
    },
    getProjects() {
      var that = this;
      axios.post(api.api.project.listall).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.projectlist = rdata.list;
        }
      });
    },
    getInfo() {
      var that = this;
      if (this.$route.params.id != 0) {
        var url = api.api.msg.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.newsMsg = rdata.newMsg;
            CKEDITOR.instances.editor.setData(that.newsMsg.msgContent);
          }
        });
      }
    },
    getTypes() {
      var that = this;
      var url = api.api.msg.type.all;
      axios.post(url).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          that.msgTypes = rdata.list;
        }
      });
    },
    goback() {
      window.history.go(-1);
    },
    setImg(url) {
      this.newsMsg.pictureUrl = url;
    },
    save() {
      var that = this;
      var param = that.newsMsg;
      var data = CKEDITOR.instances.editor.getData();
      // param.
      param.msgContent = data;
      axios.post(api.api.msg.save, param).then(response => {
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
