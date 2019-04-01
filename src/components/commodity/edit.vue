<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑商品</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑商品</span>
          </div>
        </div>
        <div>
          <div class="p-c">
            <div class="i" style="height: 100px;">
              <div class="tl">
                <span>图片：</span>
              </div>
              <div class="tr">
                <fileUpload :imgPath="commodity.pictureUrl" v-on:change="setImg"></fileUpload>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="i">
              <div class="tl">
                <span>商品名称：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入商品名称"
                  v-model="commodity.commodityName"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>商品简介：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="text"
                  placeholder="请输入商品简介"
                  v-model="commodity.oneWord"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>项目：</span>
              </div>
              <div class="tr">
                <el-select el="select" v-model="commodity.projectId" clearable placeholder="请选择项目">
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
                <span>商品价格：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入商品价格" v-model="commodity.coin">
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>商品排序：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入商品排序" v-model="commodity.seq">
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>商品详细介绍：</span>
              </div>
              <div class="tr">
                <div class="kd">
                  <div class="ckeditor">
                    <textarea id="editor" rows="10" cols="100"></textarea>
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
  name: "CommodityEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      commodity: {},
      projectlist: []
    };
  },
  created() {
    this.getProjects();
  },
  mounted() {
    CKEDITOR.replace("editor", {
      filebrowserImageUploadUrl: api.api.file.upload,
      language: "zh-cn"
    });
    this.getInfo();
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
        var url = api.api.commodity.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.commodity = rdata.commodity;
            CKEDITOR.instances.editor.setData(that.commodity.introduce);
          }
        });
      }
    },
    goback() {
      window.history.go(-1);
    },
    setImg(url) {
      this.commodity.pictureUrl = url;
    },
    save() {
      var that = this;
      var param = that.commodity;
      param.replayDate = null;
      param.updateTime = null;
      var data = CKEDITOR.instances.editor.getData();
      param.introduce = data;
      axios.post(api.api.commodity.save, param).then(response => {
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
