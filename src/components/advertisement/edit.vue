<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑广告</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑广告</span>
          </div>
        </div>
        <div>
          <div class="p-c">
            <div class="i" style="height: 100px;">
              <div class="tl">
                <span>图片：</span>
              </div>
              <div class="tr">
                <fileUpload :imgPath="advertisement.pictureUrl" v-on:change="setImg"></fileUpload>
              </div>
            </div>
            <div style="clear:both;"></div>
            <!-- <div class="i">
              <div class="tl">
                <span>广告标题：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入广告标题"
                  v-model="advertisement.adTitle"
                >
              </div>
            </div>-->
            <!-- <div class="i">
              <div class="tl">
                <span>推广广告词：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入广告词"
                  v-model="advertisement.wechatAdword"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>广告微信号：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入广告微信号"
                  v-model="advertisement.wechatNum"
                >
              </div>
            </div>-->
            <div class="i">
              <div class="tl">
                <span>图片类型：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
                  v-model="advertisement.pictureType"
                  clearable
                  placeholder="请选择图片类型"
                >
                  <el-option
                    v-for="item in adtypes"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>项目：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
                  v-model="advertisement.projectId"
                  clearable
                  placeholder="请选择项目"
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
                <span>操作类型：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
                  v-model="advertisement.operateType"
                  clearable
                  placeholder="请选择操作类型"
                >
                  <el-option
                    v-for="item in opTypes"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i" v-if="advertisement.operateType==2">
              <div class="tl">
                <span>链接网址：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入链接网址"
                  v-model="advertisement.operateUrl"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>排序：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入排序"
                  v-model="advertisement.seq"
                >
              </div>
            </div>
            <!-- <div class="i">
              <div class="tl">
                <span>广告类型：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
                  v-model="advertisement.adType"
                  clearable
                  placeholder="请选择广告类型"
                >
                  <el-option
                    v-for="item in adtypes"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>-->
            <!-- <div class="i">
              <div class="tl">
                <span>网页内容：</span>
              </div>
              <div class="tr">
                <div class="kd">
                  <div class="ckeditor">
                    <textarea id="editor" rows="10" cols="100"></textarea>
                  </div>
                </div>
              </div>
            </div>-->
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
  name: "AdvertisementEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      advertisement: {},
      projectlist: [],
      adtypes: [
        { id: 0, value: "首页弹出图片广告" },
        { id: 1, value: "首页图片广告" }
      ],
      opTypes: [{ id: 0, value: "不操作" }, { id: 2, value: "打开网址" }]
    };
  },
  created() {
    this.getProjects();
    this.getInfo();
  },
  mounted() {
    // CKEDITOR.replace("editor", {
    //   filebrowserImageUploadUrl: api.api.file.upload,
    //   language: "zh-cn"
    // });
  },
  methods: {
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
        var url = api.api.advertisement.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.advertisement = rdata.advertisement;
          }
        });
      }
    },
    goback() {
      window.history.go(-1);
    },
    setImg(url) {
      this.advertisement.pictureUrl = url;
    },
    save() {
      var that = this;
      var param = that.advertisement;
      param.createDate = null;
      param.updateTime = null;
      // var data = CKEDITOR.instances.editor.getData();
      // param.adDetail = data;
      axios.post(api.api.advertisement.save, param).then(response => {
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
