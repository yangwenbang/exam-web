<template>
  <div>
    <div class="head-c">
      <span class="bread-item">部门管理</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>部门列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class="ic">
                当前选择
                <span class="ir">{{currentDept.name}}</span>
              </span>
              <span @click="addRole">添加角色</span>
            </div>
          </div>
        </div>
        <div class="result-c cs">
          <div class="cc">
            <div class="c1">
              <el-tree
                :data="depts"
                :props="defaultProps"
                :expand-on-click-node="false"
                default-expand-all
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.data.name }}</span>
                  <div style="width:200px;text-align:left;">
                    <el-button type="text" size="mini" @click="() => handleNodeClick(node)">查看角色</el-button>
                    <el-button type="text" size="mini" @click="() => appendDept(data)">添加子部门</el-button>
                    <el-button
                      v-if="node.data.parentId!=0"
                      type="text"
                      size="mini"
                      @click="() => removeDept(node, data)"
                    >删除</el-button>
                    <el-button
                      v-if="node.data.parentId==0"
                      type="text"
                      size="mini"
                      @click="() => editdept(node, data)"
                    >编辑</el-button>
                  </div>
                </div>
              </el-tree>
            </div>
          </div>
          <div class="cc cc-1">
            <div class="bl">
              <div>
                <table class="comTb">
                  <tr>
                    <th>
                      <div class="ll-1">角色名称</div>
                    </th>
                    <th class="ls">
                      <div>权限</div>
                    </th>
                  </tr>
                  <tr v-for="item in roles" :key="item.id">
                    <td>
                      <div class="ll-1">{{item.roleName}}</div>
                    </td>
                    <td>
                      <span class="operate" @click="getRoleInfo(item)">查看</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="编辑公司" :visible.sync="parentdeptvisable" width="650px" center>
      <div class="panel" style="margin-bottom:0;">
        <div class="p-t p-t2">
          <div class="name">
            <span>公司编辑</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>名称：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入名称" v-model="parentDept.name">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>地址：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入地址" v-model="parentDept.address">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>公司联系人：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入公司联系人"
                v-model="parentDept.contact"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>联系方式：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入联系方式" v-model="parentDept.phone">
            </div>
          </div>

          <div class="i">
            <div class="tl">
              <span>联系方式：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload" :imgPath="parentDept.picture"></fileUpload>
            </div>
          </div>

          <div class="i">
            <div class="tl">
              <span>描述：</span>
            </div>
            <div class="tr">
              <textarea
                style="width:383px;height:80px;"
                placeholder="请输入描述"
                v-model="parentDept.description"
              ></textarea>
            </div>
          </div>
          <div style="clear:both;"></div>
        </div>
      </div>
      <div class="pff">
        <button class="cb" @click="savepdept">确 定</button>
        <button class="ib" @click="deptvisable=false">取 消</button>
      </div>
    </el-dialog>
    <el-dialog title="添加子部门" :visible.sync="deptvisable" width="650px" center>
      <div class="panel" style="margin-bottom:0;height:200px;">
        <div class="p-t p-t2">
          <div class="name">
            <span>部门编辑</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>父部门名称：</span>
            </div>
            <div class="tr">
              <span>{{currentDept.name}}</span>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>部门名称：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入部门名称" v-model="childDept.name">
            </div>
          </div>
        </div>
      </div>
      <div class="pff">
        <button class="cb" @click="savedept">确 定</button>
        <button class="ib" @click="deptvisable=false">取 消</button>
      </div>
    </el-dialog>
    <el-dialog title="角色权限" :visible.sync="menuvisable" width="600px" center>
      <div class="panel" style="margin-bottom:0;height:200px;border-bottom:0;">
        <div class="p-t p-t2">
          <div class="name">
            <span>角色编辑</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>部门名称：</span>
            </div>
            <div class="tr">
              <span>{{currentDept.name}}</span>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>角色名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入角色名称"
                v-model="currentRole.roleName"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="ct">
        <el-tree :data="menus" node-key="menuId" ref="qxtree" show-checkbox :props="defaultProps"></el-tree>
      </div>
      <div class="pff">
        <button class="cb" @click="modifyqx">确 定</button>
        <button class="ib" @click="menuvisable=false">取 消</button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delvisable" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{currentDept.name}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delvisable = false">取 消</el-button>
        <el-button type="primary" @click="delData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
import fileUpload from "@/components/child-components/upload-components/webupload";

export default {
  name: "DeptList",
  components: {
    fileUpload
  },
  data() {
    return {
      parentdeptvisable: false,
      parentDept: {},
      msg: "你确定删除这个部门吗？",
      menuvisable: false,
      deptvisable: false,
      delvisable: false,
      childDept: { name: "" },
      menus: [],
      roleMenuIds: [],
      depts: [],
      roles: [],
      currentRole: {},
      currentDept: {},
      defaultProps: {
        children: "nodes",
        label: "name"
      }
    };
  },
  created() {
    this.getDepts();
    this.getMenus();
  },
  methods: {
    appendDept(data) {
      console.log(data);
      this.currentDept = data;
      this.childDept = {};
      this.deptvisable = true;
    },
    editdept(node, data) {
      this.parentdeptvisable = true;
      this.parentDept = data;
    },
    removeDept(node, data) {
      this.delvisable = true;
      this.currentDept = data;
    },
    delData() {
      var that = this;
      var param = { id: this.currentDept.deptId };
      axios.post(api.api.dept.delete, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          that.delvisable = false;
          that.getDepts();
        } else {
          this.$message.error("删除失败" + rdata.msg);
        }
      });
    },
    getMenus() {
      var that = this;
      axios.post(api.api.menu.all).then(response => {
        var rdata = response.data;
        that.menus = listfpToTree("menuId", "parentId", rdata);
      });
    },
    getDepts() {
      axios.post(api.api.dept.list).then(response => {
        var rdata = response.data;
        this.depts = listfpToTree("deptId", "parentId", rdata);
      });
    },
    savedept() {
      var that = this;
      this.childDept.parentId = this.currentDept.deptId;
      var param = this.childDept;
      axios.post(api.api.dept.save, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.deptvisable = false;
          that.getDepts();
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    savepdept() {
      var that = this;
      var param = this.parentDept;
      axios.post(api.api.dept.save, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.deptvisable = false;
          that.getDepts();
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    handleNodeClick(data) {
      console.log(data.data);
      this.currentDept = data.data;
      this.getRoles(data.data);
    },
    getRoles(item) {
      var that = this;
      var url = api.api.role.dept + "/" + item.deptId;
      axios.post(url).then(response => {
        var rdata = response.data;
        that.roles = rdata.list;
      });
    },
    getRoleInfo(item) {
      var that = this;
      this.currentRole = item;
      that.menuvisable = true;
      var url = api.api.role.info + "/" + item.roleId;
      axios.post(url).then(response => {
        var rdata = response.data;
        that.$refs.qxtree.setCheckedKeys(rdata.role.menuIdList);
      });
    },
    modifyqx() {
      var menus = this.$refs.qxtree.getCheckedKeys();
      var that = this;
      var param = {
        roleId: this.currentRole.roleId,
        deptId: this.currentDept.deptId,
        roleName: this.currentRole.roleName,
        deptIdList: [],
        menuIdList: menus
      };
      axios.post(api.api.role.savemenu, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.menuvisable = false;
          that.getRoles(this.currentDept);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    addRole() {
      this.currentRole = [];
      this.menuvisable = true;
      this.$refs.qxtree.setCheckedKeys([]);
    }
  }
};
</script>
<style scoped>
.panel .p-c .i .tr input.add-input {
  width: 383px;
}
.panel .p-c .i .tr span {
  line-height: 38px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  font-size: 15px;
  padding-right: 8px;
  color: #000;
}
.comTb {
  border-top: solid 1px #ddd;
  border-bottom: solid 1px #aaa;
}
.ct {
  height: 300px;
  border: solid 1px #ddd;
  padding: 10px;
  overflow-y: auto;
}
.sfr {
  color: #f00;
}
.ll-1 {
  text-align: left;
  padding-left: 20px;
}
.ls {
  width: 200px;
}
.cs {
  min-height: 600px;
}
.bl {
  min-height: 600px;
  border-left: solid 1px #aaa;
}
.cc {
  min-height: 600px;
  float: left;
  width: 50%;
}
.cc-1 {
  float: right;
}
.cc .c1 {
  margin: 20px;
  height: 300px;
}
.cc .c1 .el-tree-node__content {
  height: 40px;
}

.el-tree-node__label {
  font-size: 16px;
  color: #000;
}
.pff {
  height: 50px;
  border: solid 1px #ddd;
  border-top: 0;
  text-align: right;
  background: #f2f2f2;
}
.pff button {
  font-size: 15px;
  cursor: pointer;
}
.pff .cb {
  margin-top: 8px;
  height: 34px;
  background: #33b097;
  min-width: 80px;
  border: solid 1px #33b097;
  color: #fff;
  border-radius: 2px;
  margin-right: 10px;
}
.pff .cb:hover {
  background: #36b99f;
  border: solid 1px #36b99f;
}
.pff .ib {
  height: 34px;
  background: #fff;
  min-width: 80px;
  border-radius: 2px;
  border: solid 1px #aaa;
  color: #000;
  margin-right: 20px;
}
.pff .ib:hover {
  border: solid 1px #3e8cd5;
}
.ir {
  border: 0 !important;
  color: #f00;
  background: #f3f3f3 !important;
}
.ic:hover {
  background: #f3f3f3 !important;
  color: #000;
}
.ic {
  border: 0 !important;
  color: #000;
}
</style>
