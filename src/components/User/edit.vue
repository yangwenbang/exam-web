<template>
  <div>
    <div class="head-c">
      <span class="bread-item">编辑用户</span>
      <div style="float:right;">
        <button class="cb" @click="goback">返 回</button>
      </div>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑用户</span>
          </div>
        </div>
        <div>
          <div class="p-c">
            <div style="clear:both;"></div>
            <div class="i">
              <div class="tl">
                <span>用户名：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入广告标题" v-model="user.username">
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>用户类型：</span>
              </div>
              <div class="tr">
                <el-select
                  el="select"
                  v-model="user.userType"
                  clearable
                  placeholder="请选择用户类型"
                >
                  <el-option
                    v-for="item in userTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>所属部门：</span>
              </div>
              <div class="tr">
                <div class="sel" @click="selectDept">
                  <span class="s" v-if="user.deptId==0">请选择部门</span>
                  <span class="s" v-if="user.deptId>0" style="color:#000;">
                    <span v-for="item in srcdepts" :key="item.deptId">
                      <span v-if="item.deptId==user.deptId">{{item.name}}</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>密码：</span>
              </div>
              <div class="tr">
                <input
                  class="add-input"
                  type="password"
                  placeholder="请输入密码"
                  v-model="user.password"
                >
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>邮箱：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入邮箱" v-model="user.email">
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>手机号：</span>
              </div>
              <div class="tr">
                <input class="add-input" type="text" placeholder="请输入手机号" v-model="user.mobile">
              </div>
            </div>
            <div class="i">
              <div class="tl">
                <span>角色类型：</span>
              </div>
              <div class="tr">
                <!-- <span v-for="item in roles" :key="item.roleId">
                  <span
                    :class="[item.checked?'selbtn clbt':'selbtn']"
                    @click="selrole(item)"
                  >{{item.roleName}}</span>
                </span>-->
                <el-checkbox-group v-model="userroles" size="medium">
                  <el-checkbox-button
                    v-for="item in roles"
                    :label="item.roleName"
                    :key="item.roleId"
                    @change="selrole(item)"
                  >{{item.roleName}}</el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>
            <div class="pf">
              <button class="btn" @click="save">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="selectdeptVisable" width="500PX" center title="部门选择">
      <div style="margin-bottom:5px;font-size:15px;">请选择部门</div>
      <div style="border:solid 1px #ddd;padding:10px;">
        <el-tree :data="depts" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        <div slot="footer" class="dialog-footer" style="margin-top:20px;text-align:center;">
          <el-button type="primary" @click="selData">确 定</el-button>
          <el-button @click="selectdeptVisable = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import api from "../../config/apiConfig";
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "UserEdit",
  components: {
    fileUpload
  },
  data() {
    return {
      seldept: {},
      selectdeptVisable: false,
      user: {
        email: "",
        mobile: "",
        password: "",
        username: "",
        deptId: 0,
        deptName: ""
      },
      userroles: [],
      depts: [],
      srcdepts: [],
      opTypes: [],
      roles: [],
      defaultProps: {
        children: "nodes",
        label: "name"
      },
      userTypes: [
        { id: 0, label: "默认用户" },
        { id: 1, label: "合作伙伴" },
        { id: 2, label: "系统用户" },
        { id: 3, label: "管理员" }
      ]
    };
  },
  created() {
    this.getRoles();
    this.getdepts();
  },
  mounted() {},
  methods: {
    getinfo() {
      var that = this;
      if (this.$route.params.id != 0) {
        var url = api.api.user.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.user = rdata.user;
            that.user.roleIdList.forEach(element => {
              that.roles.forEach(item => {
                if (element == item.roleId) {
                  that.userroles.push(item.roleName);
                }
              });
            });
          }
        });
      }
    },
    getRoles() {
      var that = this;
      axios.post(api.api.role.select).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.roles = rdata.list;
          that.roles.forEach(item => {
            item.checked = false;
          });
          that.getinfo();
        }
      });
    },
    getdepts() {
      var that = this;
      axios.post(api.api.dept.list).then(response => {
        that.loading = false;
        var rdata = response.data;
        rdata.forEach(element => {
          var bitem = util.clone(element);
          that.srcdepts.push(bitem);
        });
        //  listfpToTree("deptId", "parentId", rdata);
        that.depts = listfpToTree("deptId", "parentId", rdata);
      });
    },
    handleNodeClick(data) {
      this.seldept = data;
    },
    selData() {
      this.selectdeptVisable = false;
      this.user.deptId = this.seldept.deptId;
      this.user.deptName = this.seldept.name;
    },
    selectDept() {
      this.selectdeptVisable = true;
    },
    goback() {
      window.history.go(-1);
    },
    selrole(item) {
      item.checked = !item.checked;
    },
    save() {
      var that = this;
      var param = util.clone(that.user);
      param.roleIdList = [];
      that.userroles.forEach(item => {
        that.roles.forEach(ritem => {
          if (ritem.roleName == item) {
            param.roleIdList.push(ritem.roleId);
          }
        });
      });
      console.log(param);
      axios.post(api.api.user.save, param).then(response => {
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

.selbtn {
  width: 80px;
  height: 35px;
  margin-right: 10px;
  border-radius: 3px;
  font-size: 13px;
  background-color: #fff;
  border: solid 1px #aaa;
  outline: none;
  cursor: pointer;
  display: inline-block;
  line-height: 35px;
  text-align: center;
}
.clbt {
  background-color: #1abc9c !important;
  border: none;
  color: #fff;
}
</style>
