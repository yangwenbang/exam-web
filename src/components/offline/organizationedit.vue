<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑机构</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑机构</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>机构名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入机构名称"
                v-model="organization.organizationName"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>机构描述：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入机构描述"
                v-model="organization.organizationDesc"
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
                v-model="organization.projectId"
                clearable
                placeholder="请选择所属项目"
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
              <span>城市：</span>
            </div>
            <div class="tr">
              <CitySelect @change="setcity" :cityId="organization.cityId"></CitySelect>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>机构地址：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入机构地址"
                v-model="organization.organizationAddress"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>联系人：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入联系人"
                v-model="organization.contact"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>联系电话：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入联系电话"
                v-model="organization.phone"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>排序：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入排序" v-model="organization.seq">
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" style="margin-right:30px;" @click="save">保存</button>
            <el-button class="btn-primary" @click="goback">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from "../../config/apiConfig";
import CitySelect from "@/components/child-components/city-select";

export default {
  name: "OfflineOrganizationEdit",
  components: {
    CitySelect
  },
  data() {
    return {
      organization: {},
      projectlist: []
    };
  },
  created() {
    this.getProjects();
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
        var url =
          api.api.offline.organization.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.organization = rdata.offlineOrganization;
          }
        });
      }
    },
    goback() {
      window.history.go(-1);
    },
    setcity(item) {
      this.organization.cityId = item.cityId;
      this.organization.provinceId = item.provinceId;
      console.log(this.organization);
    },
    save() {
      var that = this;
      var param = that.organization;
      param.replayDate = null;
      param.updateTime = null;
      axios.post(api.api.offline.organization.save, param).then(response => {
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
