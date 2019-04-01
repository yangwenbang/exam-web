<template>
  <div>
    <div class="head-c">
      <span class="bread-item">权限列表</span>
    </div>
    <div class="content">
      <div id="wai" class="clearfix">
        <div  class="divleft">
          <div class="panel">
            <div v-loading="loading">
              <div class="p-t p-t2 clearfix">
                <div class="name">
                  <span>权限组</span>
                </div>
                <div class="tools clearfix">
                  <div class="t-r">
                    <span @click="addorg()">添加</span>
                    <span @click="updorg()">修改</span>
                    <span @click="delorg()">删除</span>
                  </div>
                </div>
              </div>
              <div class="result-c">
                <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
          </div>
        </div>
        <div class="divright">
          <div class="panel">
            <div v-loading="loading2">
              <div class="p-t p-t2 clearfix">
                <div class="name">
                  <span>权限表</span>
                </div>
                <div class="tools clearfix">
                  <div class="t-r">
                    <span @click="save()">保存</span>
                  </div>
                </div>
              </div>
              <div class="result-c">
                <div class="custom-tree-container">
                  <div class="block">
                    <el-tree :data="data2" show-checkbox="" node-key="id" ref="tree" default-expand-all :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.authorityname}}</span>
                    <span>
                     <el-button type="text" size="mini" @click="() => append(data)">
                        添加子权限
                      </el-button>
                      <el-button type="text" size="mini" @click="() => remove(node, data)">
                        删除权限
                      </el-button>
                       <el-button type="text" size="mini" @click="() => edit(data)">
                        修改权限
                      </el-button>
                    </span>
             </span>
                    </el-tree>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-dialog :title="title" :visible.sync="showAuthority" width="700px" center>
            <div class="panel">
              <div class="p-c">
                <div>
                  <div>
                    <input type="text" v-model="authority.parentid" readonly="readonly" v-show="false">
                  </div>
                </div>
                <div class="i">
                  <div class="tl">
                    <span>权限名称：</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="authority.authorityname">
                  </div>
                </div>
                <div class="i">
                  <div class="tl">
                    <span>访问地址：</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="authority.methodorurl"><!--  v-model="keyEdit.deviceid"-->
                  </div>
                </div>
                <div class="i" style="text-align: center;">
                  <button v-show="addah" class="btn" @click="addAuthority()"><span>添加</span></button>
                  <button v-show="updah" class="btn" @click="updAuthority()"><span>修改</span></button>
                </div>
              </div>
            </div>
          </el-dialog>

          <el-dialog :title="title" :visible.sync="showOrlRole" width="700px" center>
            <div class="panel">
              <div class="p-c">
                <div>
                  <div>
                    <input type="text" v-model="orgrolegroup.parentid" readonly="readonly" v-show="false">
                  </div>
                </div>
                <div class="i">
                  <div class="tl">
                    <span>权限组名称：</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="orgrolegroup.rolegroupname">
                  </div>
                </div>
                <div class="i" style="text-align: center;">
                  <button v-show="addah" class="btn" @click="saveorg()"><span>添加</span></button>
                  <button v-show="updah" class="btn" @click="saveeditorg()"><span>修改</span></button>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from '../../config/apiConfig'

  export default {
    name: "list",
    data() {
      return {
        showAuthority: false,
        showOrlRole: false,
        loading: true,
        loading2: true,
        data: [],
        node: [],
        data2: [],
        title: '',
        addah: false,
        updah: false,
        defaultProps: {
          children: 'children',
          rolegroupid: 'rolegroupid',
          label: 'rolegroupname'
        },
        groupauthority: {
          roleGroupId: 0,
          parentid: 0
        },
        authorityVo: {
          rolegroupid: 0,
          authorityids: ''
        },
        authority: {
          authorityId: 0,
          parentid: 0,
          authorityname: '',
          methodorurl: '',
          isenable: 1
        },
        orgrolegroup: {
          roleGroupId: 0,
          parentid: 0,
          rolegroupname: ''
        },
        searchCondition: {
          conditions: {},
          page: {
            page: 1,
            num: 9999,
            totalSize: 0
          }
        },
      };
    },
    created() {
      this.getData();
      this.getData2();
    },
    methods: {
      handleNodeClick(data) {
        var that = this;
        console.log(data);
        this.node = data;
        that.resetChecked();
        that.groupauthority.roleGroupId = data.rolegroupid;
        that.orgrolegroup.rolegroupname = data.rolegroupname;
        that.orgrolegroup.parentid = data.parentid;
        that.orgrolegroup.roleGroupId = data.rolegroupid;
        var param = that.groupauthority;
        let list = [];
        axios.post(api.api.groupauthority.list, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              list.push(item.authorityid);
            })
            that.setCheckedKeys(list);
          }
        })
      },
      getData() {
        var that = this
        that.loading = true;
        that.loading2 = true;
        var param = that.searchCondition
        // 添加请求头
        let dataArray = [];
        axios.post(api.api.orgrolegroup.list, param).then(response => {
          that.loading = false;
          that.loading2 = false;
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              let parentid = item.parentid;
              if (parentid == 0) {
                let objTemp = {
                  rolegroupid: item.rolegroupid,
                  rolegroupname: item.rolegroupname,
                  parentid: parentid,
                }
                dataArray.push(objTemp);
              }
            })
            this.data = this.data2treeDG(that.list, dataArray)
          }
        })
      },
      data2treeDG(datas, dataArray) {
        for (let j = 0; j < dataArray.length; j++) {
          let dataArrayIndex = dataArray[j];
          let childrenArray = [];
          let id = dataArrayIndex.rolegroupid;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let parentid = data.parentid;
            if (parentid == id) {//判断是否为儿子节点
              let objTemp = {
                rolegroupid: data.rolegroupid,
                rolegroupname: data.rolegroupname,
                parentid: parentid,
                id: data.rolegroupid
              }
              childrenArray.push(objTemp);
            }
          }
          dataArrayIndex.children = childrenArray;
          if (childrenArray.length > 0) {//有儿子节点则递归
            this.data2treeDG(datas, childrenArray)
          }
        }
        this.data = dataArray;
        return dataArray;
      },
      getData2() {
        var that = this
        var param = that.searchCondition
        that.loading = true;
        that.loading2 = true;
        // 添加请求头
        let dataArray = [];
        axios.post(api.api.authority.list, param).then(response => {
          that.loading = false;
          that.loading2 = false;
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              let parentid = item.parentid;
              if (parentid == 0) {
                let objTemp = {
                  id: item.authorityId,
                  authorityId: item.authorityId,
                  authorityname: item.authorityname,
                  parentid: parentid,
                  methodorurl: item.methodorurl
                }
                dataArray.push(objTemp);
              }
            })
            this.data2 = this.data2treeAu(that.list, dataArray)
          }
        })
      },
      data2treeAu(datas, dataArray) {
        for (let j = 0; j < dataArray.length; j++) {
          let dataArrayIndex = dataArray[j];
          let childrenArray = [];
          let id = dataArrayIndex.authorityId;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let parentid = data.parentid;
            if (parentid == id) {//判断是否为儿子节点
              let objTemp = {
                id: data.authorityId,
                authorityId: data.authorityId,
                authorityname: data.authorityname,
                parentid: parentid,
                methodorurl: data.methodorurl
              }
              childrenArray.push(objTemp);
            }
          }
          dataArrayIndex.children = childrenArray;
          if (childrenArray.length > 0) {//有儿子节点则递归
            this.data2treeAu(datas, childrenArray)
          }
        }
        return dataArray;
      },
      append(data) {
        this.title = "添加权限";
        this.showAuthority = true;
        this.addah = true;
        this.updah = false;
        this.authority.authorityname = '';
        this.authority.authorityId = 0;
        this.authority.methodorurl = '';
        this.authority.parentid = data.authorityId;
      },
      addAuthority() {
        var param = this.authority;
        axios.post(api.api.authority.add, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            this.showAuthority = false;
            this.authority.authorityname = '';
            this.authority.parentid = 0;
            this.authority.authorityId = 0;
            this.authority.methodorurl = '';
            this.getData2();
          }
        })
      },
      remove(node, data) {
        if (node.childNodes.length > 0) {
          util.alert("删除失败，请先删除子权限");
          return;
        }
        this.authority.authorityId = data.authorityId;
        var param = this.authority;
        axios.post(api.api.authority.del, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            this.showAuthority = false;
            this.authority.authorityname = '';
            this.authority.methodorurl = '';
            this.getData2();
          }
        })
        // this.getCheckedKeys();
      },
      edit(data) {
        this.title = "修改权限";
        this.addah = false;
        this.updah = true;
        this.showAuthority = true;
        this.authority.parentid = data.parentid;
        this.authority.authorityname = data.authorityname;
        this.authority.authorityId = data.authorityId;
        this.authority.methodorurl = data.methodorurl;
      },
      updAuthority() {
        var param = this.authority;
        axios.post(api.api.authority.edit, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            this.showAuthority = false;
            this.authority.authorityname = '';
            this.authority.parentid = 0;
            this.authority.authorityId = 0;
            this.authority.methodorurl = '';
            this.getData2();
          }
        })
      },
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys(num) {
        this.$refs.tree.setCheckedKeys(num);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      save() {
        this.authorityVo.authorityids = this.$refs.tree.getCheckedKeys() + "";
        this.authorityVo.rolegroupid = this.groupauthority.roleGroupId;
        if (this.authorityVo.rolegroupid == 0) {
          util.alert("请选择用户权限组")
          return;
        }
        this.loading = true;
        this.loading2 = true;
        var param = this.authorityVo;
        axios.post(api.api.groupauthority.add, param).then(response => {
          this.loading = false;
          this.loading2 = false;
          if (response.data.bresult) {
            util.alert(response.data.message)
          }
        })
      },
      addorg() {
        this.orgrolegroup.rolegroupname = '';
        this.orgrolegroup.parentid = this.groupauthority.roleGroupId;
        this.title = '添加权限组';
        this.showOrlRole = true;
        this.addah = true;
        this.updah = false;
      },
      saveorg() {
        this.loading = true;
        this.loading2 = true;
        var param = this.orgrolegroup;
        axios.post(api.api.orgrolegroup.add, param).then(response => {
          if (response.data.bresult) {
            this.showOrlRole = false;
            this.getData();
            util.alert(response.data.message)
          } else {
            util.alert(response.data.message)
          }
        })
      },
      updorg() {
        this.title = '修改权限组';
        this.showOrlRole = true;
        this.updah = true;
        this.addah = false;
      },
      saveeditorg() {
        this.loading = true;
        this.loading2 = true;
        var param = this.orgrolegroup;
        console.log(param);
        axios.post(api.api.orgrolegroup.upd, param).then(response => {
          if (response.data.bresult) {
            this.showOrlRole = false;
            this.getData();
            util.alert(response.data.message)
          }
        })
      },
      delorg() {
        console.log(this.node);
        console.log(this.node.children.length);
        if (this.node.children.length > 0) {
          util.alert("请先删除子级目录权限")
          return;
        }
        this.orgrolegroup.roleGroupId = this.node.rolegroupid;
        var param=this.orgrolegroup;
        this.loading = true;
        this.loading2 = true;
        axios.post(api.api.orgrolegroup.del, param).then(response => {
          if (response.data.bresult) {
            this.showOrlRole = false;
            this.getData();
            util.alert(response.data.message)
          }
        })
      },
    }
  }
</script>

<style scoped>
  @import url("//unpkg.com/element-ui@2.4.11/lib/theme-chalk/index.css");

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
  }

  #wai .result-c{
    height: 700px;
    overflow: auto;
    width: 100%;
  }

  .divleft {
    float: left;
    width: 25%;
  }

  .divright {
    float: left;
    width: 70%;
    margin-left: 50px;
  }

  @media screen and (max-width: 1450px) {
    .divleft {
      width: 28%;
    }

    .divright {
      width: 65%;
    }
  }

</style>
