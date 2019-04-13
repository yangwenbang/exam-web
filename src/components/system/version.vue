<template>
  <div>
    <div class="head-c">
      <span class="bread-item">版本列表</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t">
          <div class="name">
            <span>筛选查询</span>
          </div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 60px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">版本名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.exerciseName">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">版本类别:</span>
                  </div>
                  <div class="fca">
                    <el-select
                      v-model="searchData.conditions.exerciseType"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="b">
                <input type="button" class="btn btn-primary" value="查询" @click="reSearch">
                <input type="button" class="btn btn-primary" value="重置" @click="reset">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>版本列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class @click="showEdit">添加版本</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">设备类型</div>
                </th>
                <th>
                  <div class="ll">版本号</div>
                </th>
                <th>
                  <div class="ll">设备地址</div>
                </th>
                <th>
                  <div class="ll">更新内容</div>
                </th>
                <th>
                  <div class="ll">操作</div>
                </th>
              </tr>
              <tr v-for="item in versionList" :key="item.id">
                <td>
                  <div class="ll">
                    <span v-for="xitem in typeOptions" :key="xitem.id">
                      <span v-if="item.equipmentType==xitem.id">{{xitem.label}}</span>
                    </span>
                  </div>
                </td>
                <td>
                  <div class="ll">{{item.equipmentVersion}}</div>
                </td>
                <td>
                  <div class="ll">{{item.equipmentPath}}</div>
                </td>
                <td>
                  <div class="ll">{{item.updateContent}}</div>
                </td>
                <td>
                  <span class="operate" @click="edit(item)">编辑</span>
                  <span class="operate" @click="del(item)">删除</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging :total="searchData.page.listTotal" v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="编辑题型" :visible.sync="editVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑版本</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>设备类型：</span>
            </div>
            <div class="tr">
              <el-select
                v-model="version.equipmentType"
                clearable
                placeholder="请选择设备类型"
                id="input-exerc-typeid"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>版本号：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入版本号"
                v-model="version.equipmentVersion"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>设备地址：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入设备地址"
                v-model="version.equipmentPath"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>更新内容：</span>
            </div>
            <div class="tr">
              <textarea
                class="add-input"
                style="width:480px;height:100px;"
                placeholder="请输入更新内容"
                v-model="version.updateContent"
              ></textarea>
            </div>
          </div>
          <div style="clear:both"></div>
          <div class="pf">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
import Utils from "@/vendor/utils.js";

export default {
  name: "VersionList",
  components: {
    routerPaging
  },
  data() {
    return {
      version: {},
      editVisable: false,
      typeOptions: [{ id: 0, label: "安卓" }, { id: 1, label: "ios" }],
      versionList: {},
      searchData: {
        conditions: {
          status: null,
          sidx: "",
          order: "desc"
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      }
    };
  },
  created() {
    this.loading = false;
    this.getData(1);
  },
  methods: {
    showEdit() {
      this.version = {};
      this.editVisable = true;
    },
    getData(val) {
      var that = this;
      var param = util.clone(that.searchData);
      that.searchData.page.page = val;
      that.loading = true;
      axios.post(api.api.version.list, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.versionList = rdata.page.list;
          that.searchData.page.listTotal = rdata.page.totalCount;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
      });
    },
    save() {
      var that = this;
      var param = util.clone(that.version);
      axios.post(api.api.version.save, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.getData(1);
          that.editVisable = false;
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    edit(item) {
      this.version = util.clone(item);
      this.editVisable = true;
    },
    del(item) {
      var that = this;
      var param = util.clone(item);
      axios.post(api.api.version.delete, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          that.getData(1);
        } else {
          this.$message.error("删除失败" + rdata.msg);
        }
      });
    },
    reSearch() {
      this.getData(1);
    },
    reset() {
      var resetData = {
        conditions: {
          isEnable: null,
          phone: "",
          username: "",
          startTime: "",
          endTime: ""
        },
        page: {
          page: 1,
          num: 10,
          listTotal: 0
        }
      };
      this.searchData = resetData;
      this.getData(1);
    }
  }
};
</script>
<style scoped>
div.content {
  text-align: left;
}

table.comTb .u-info .i {
  display: inline-block;
  margin: 10px;
  margin-right: 0;
  vertical-align: middle;
}

table.comTb .u-info .ii {
  margin-left: 30%;
}

table.comTb .u-info {
  cursor: pointer;
  text-align: left;
}
table.comTb .u-info .i img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

table.comTb .u-info .i span {
  line-height: 25px;
  color: #1abc9c;
}

table.comTb .u-info:hover .i span {
  text-decoration: underline;
}

.u-c {
  text-align: center;
}

.u-c .u {
  width: 100%;
  margin: 10px;
}

.u-c .u .u-i {
  float: left;
  text-align: right;
  width: 47%;
}

.u-c .u .u-ii {
  float: left;
  text-align: left;
  width: 39%;
  margin-left: 20px;
  word-break: break-all;
}

.u-c .u-img img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.u-c .u > div {
  display: inline-block;
  width: 49%;
}

.panel .p-c .i .tr input.add-input {
  width: 480px;
}

.cfile {
  position: relative;
  width: 300px;
  height: 40px;
  margin-bottom: 50px;
}

.cfile .download {
  position: absolute;
  top: 45px;
  width: 650px;
  color: #1abc9c;
  font-size: 16px;
  z-index: 2;
}

.cfile .download .dl,
.cfile .download .dr {
  display: inline-block;
  width: 48%;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}

.cfile .download .dl:hover span,
.cfile .download .dr:hover span {
  text-decoration: underline;
}

.cfile .lb {
  position: absolute;
  float: left;
  z-index: 10;
  left: 0px;
  top: 0;
}

.cfile .lo {
  position: absolute;
  float: left;
  z-index: 10;
  left: 0px;
  top: 0;
}

.c .lh {
  display: none;
}

.cfile .lt {
  height: 40px;
  width: 300px;
  font-size: 16px;
  text-align: center;
  color: #333;
  background: #f2f2f2;
  cursor: pointer;
  border: none;
}

.cfile .sf {
  display: none;
}

.cfile .rt {
  position: absolute;
  z-index: 10;
  right: -350px;
  top: 0;
}

.cfile .rt span {
  font-size: 14px;
  line-height: 40px;
  color: #1abc9c;
  background: none;
  width: 100%;
}

.cfile .rt:hover span {
  text-decoration: underline;
}

.cfile .rf {
  position: absolute;
  z-index: 10;
  right: -170px;
  top: 0;
}

.cfile .rf span {
  font-size: 14px;
  line-height: 40px;
  color: #1abc9c;
  background: none;
  width: 100%;
}

.cfile .rf:hover span {
  text-decoration: underline;
}

@media screen and (max-width: 1400px) {
  table.comTb .u-info .i img {
    width: 35px;
    height: 35px;
  }

  table.comTb .u-info .i {
    display: block;
    margin: 0;
    text-align: center;
  }

  table.comTb .u-info .i > div {
    margin-bottom: 10px;
  }

  table.comTb .u-info .ii {
    margin-left: 0;
    margin-top: 10px;
  }
  .cfile {
    position: relative;
    border: solid 1px #ddd;
    width: 300px;
    height: 40px;
    margin-bottom: 50px;
  }

  .cfile .download {
    position: absolute;
    top: 45px;
    width: 650px;
    color: #1abc9c;
    font-size: 16px;
    z-index: 2;
  }

  .cfile .download .dl,
  .cfile .download .dr {
    display: inline-block;
    width: 48%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }

  .cfile .download .dl:hover span,
  .cfile .download .dr:hover span {
    text-decoration: underline;
  }

  .cfile .lb {
    position: absolute;
    float: left;
    z-index: 10;
    left: 0px;
    top: 0;
  }

  .cfile .lo {
    position: absolute;
    float: left;
    z-index: 10;
    left: 0px;
    top: 0;
  }

  .c .lh {
    display: none;
  }

  .cfile .lt {
    height: 40px;
    width: 300px;
    font-size: 16px;
    text-align: center;
    color: #333;
    background: #f2f2f2;
    cursor: pointer;
    border: none;
  }

  .cfile .sf {
    display: none;
  }

  .cfile .rt {
    position: absolute;
    z-index: 10;
    right: -350px;
    top: 0;
  }

  .cfile .rt span {
    font-size: 14px;
    line-height: 40px;
    color: #1abc9c;
    background: none;
    width: 100%;
  }

  .cfile .rt:hover span {
    text-decoration: underline;
  }

  .cfile .rf {
    position: absolute;
    z-index: 10;
    right: -170px;
    top: 0;
  }

  .cfile .rf span {
    font-size: 14px;
    line-height: 40px;
    color: #1abc9c;
    background: none;
    width: 100%;
  }

  .cfile .rf:hover span {
    text-decoration: underline;
  }
}
</style>
