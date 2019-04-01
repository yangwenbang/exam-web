<template>
  <div>
    <div class="head-c">
      <span class="bread-item">权限管理</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>权限列表</span>
          </div>
        </div>
        <div class="result-c cs">
          <div class="cc">
            <div class="c1">
              <el-tree :data="menus" :props="defaultProps" :expand-on-click-node="false">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.data.name }}</span>
                  <div style="width:200px;text-align:left;">
                    <el-button type="text" size="mini" @click="edit(data)">编辑</el-button>
                    <el-button type="text" size="mini" @click="append(data)">添加子权限</el-button>
                    <el-button
                      v-if="node.data.parentId!=0"
                      type="text"
                      size="mini"
                      @click="() => removeDept(node, data)"
                    >删除</el-button>
                  </div>
                </div>
              </el-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="编辑权限" :visible.sync="editvisable" width="650px" center>
      <div class="panel" style="margin-bottom:0;">
        <div class="p-t p-t2">
          <div class="name">
            <span style="color:#f00" v-if="parentMenu.name">{{parentMenu.name}}</span>
            <span>编辑权限</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>权限名称：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入权限名称" v-model="currentMenu.name">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>权限属性：</span>
            </div>
            <div class="tr">
              <el-select el="sel" v-model="currentMenu.type" clearable placeholder="请选择权限属性">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="i" v-if="currentMenu.type==1">
            <div class="tl">
              <span>url：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入url" v-model="currentMenu.url">
            </div>
          </div>
          <div class="i" v-if="currentMenu.type>0">
            <div class="tl">
              <span>控制标识：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入控制标识"
                v-model="currentMenu.perms"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="pff">
        <button class="cb" @click="save">确 定</button>
        <button class="ib" @click="editvisable=false">取 消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
export default {
  name: "MenuList",
  data() {
    return {
      msg: "你确定删除这个权限吗？",
      menuvisable: false,
      editvisable: false,
      delvisable: false,
      childDept: { name: "" },
      currentMenu: {},
      menus: [],
      parentMenu: {},
      defaultProps: {
        children: "nodes",
        label: "name"
      },
      typeOptions: [
        {
          id: 0,
          label: "顶级权限"
        },
        {
          id: 1,
          label: "菜单权限"
        },
        {
          id: 2,
          label: "操作权限"
        }
      ]
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    edit(data) {
      console.log(data);
      this.editvisable = true;
      this.currentMenu = data;
    },
    append(data) {
      console.log(data);
      this.editvisable = true;
      this.parentMenu = data;
      this.currentMenu = {};
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
    save() {},
    getMenus() {
      var that = this;
      axios.post(api.api.menu.all).then(response => {
        var rdata = response.data;
        that.menus = listfpToTree("menuId", "parentId", rdata);
      });
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
.panel .p-c .i .tr [el="sel"] {
  width: 398px !important;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  font-size: 14px;
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
  height: 600px;
  overflow-y: auto;
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
@media screen and (min-width: 1400px) {
  .cc {
    float:left;
    width: 50%;
  }
}
</style>
