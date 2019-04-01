<template>
  <div>
    <div class="head-c">
      <span class="bread-item">题型列表</span>
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
                    <span class="ct">题型名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchData.conditions.exerciseName">
                  </div>
                </div>
              </div>
              <!-- <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">题型模板:</span>
                  </div>
                  <div class="fca">
                    <el-select v-model="searchData.conditions.modelId" clearable placeholder="请选择">
                      <el-option
                        v-for="item in modelList"
                        :key="item.id"
                        :label="item.modelName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div> -->
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">题型类别:</span>
                  </div>
                  <div class="fca">
                    <el-select
                      v-model="searchData.conditions.exerciseType"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
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
            <span>题型列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class @click="showEdit">添加数据</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>
                  <div class="ll">题型名称</div>
                </th>
                <th>题型</th>
                <!-- <th>
                  <div class="ll">题型模板</div>
                </th> -->
                <th>
                  <div class="ll">题型说明</div>
                </th>
                <th>
                  <div class="ll">备注</div>
                </th>
                <th>排序</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in typeList" :key="item.id">
                <td>
                  <div class="ll">{{item.exerciseName}}</div>
                </td>
                <td>  
                  <span v-for="xitem in typeOptions" :key="xitem.id">
                    <span v-if="xitem.id==item.exerciseType">{{xitem.label}}</span>
                  </span>
                <!-- <td>
                  <div class="ll">{{item.exerciseModel}}</div>
                </td> -->
                <td>
                  <div class="ll">{{item.description}}</div>
                </td>
                <td>
                  <div class="ll">{{item.remark}}</div>
                </td>
                <td>
                  <div>{{item.seq}}</div>
                </td>
                <td>
                  <span class="operate" @click="info(item)">编辑</span>
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
    <el-dialog title="编辑题型" :visible.sync="exerciseEditVisable" width="800px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>编辑题型</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>题型名称：</span>
            </div>
            <div class="tr">
              <input
                class="add-input"
                type="text"
                placeholder="请输入题型名称"
                v-model="type.exerciseName"
              >
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>题型：</span>
            </div>
            <div class="tr">
              <el-select
                v-model="type.exerciseType"
                clearable
                placeholder="请选择题型"
                id="input-exerc-typeid"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>题型说明：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入题型说明" v-model="type.description">
            </div>
          </div>
          <!-- <div class="i">
            <div class="tl">
              <span>题型模板：</span>
            </div>
            <div class="tr">
              <el-select
                v-model="type.exerciseModelId"
                clearable
                placeholder="请选择题型模板"
                id="input-exerc-typeid"
              >
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div> -->
          <div class="i">
            <div class="tl">
              <span>排序：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入题型说明" v-model="type.seq">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>备注：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入备注" v-model="type.remark">
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="批量导入题型" :visible.sync="patchVisible" width="50%" center>
      <div class="cfile" v-show="file.path.length==0">
        <div :class="[ 'lb', {'lh': file.path.length!=0}]">
          <button class="lt" @click="selectFiles">请选择文件</button>
          <input
            class="sf"
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
        </div>
      </div>
      <div class="panel">
        <div class="p-c" style="margin:0;">
          <table class="comTb">
            <tr>
              <th>
                <div class="ll">题型名称</div>
              </th>
              <th>题型</th>
              <!-- <th>
                <div class="ll">题型模板</div>
              </th> -->
              <th>
                <div class="ll">题型说明</div>
              </th>
              <th>
                <div>seq</div>
              </th>
              <th>
                <div class="ll">备注</div>
              </th>
            </tr>
            <tr v-for="item in importTypes" :key="item.id">
              <td>
                <div class="ll">{{item.exerciseName}}</div>
              </td>
              <td>{{item.exerciseTypeName}}</td>
              <!-- <td>
                <div class="ll">{{item.exerciseModelName}}</div>
              </td> -->
              <td>
                <div class="ll">{{item.description}}</div>
              </td>
              <td>
                <div>{{item.seq}}</div>
              </td>
              <td>
                <div class="ll">{{item.remark}}</div>
              </td>
            </tr>
          </table>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="excelImport">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{msg}}</span>
      <span style="margin-left:20px;color:#0dbc5c;">{{type.exerciseName}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
import userSelect from "@/components/child-components/selector-components/user";
import Utils from "@/vendor/utils.js";

export default {
  name: "ExecriseTypeList",
  components: {
    routerPaging,
    userSelect
  },
  data() {
    return {
      msg: "确定删除这条题型吗?",
      exerciseEditVisable: false,
      centerDialogVisible: false,
      patchVisible: false,
      loading: true,
      typeOptions: [
        { id: 0, value: 0, label: "单选" },
        { id: 1, value: 1, label: "多选" },
        { id: 2, value: 2, label: "问答" },
        { id: 3, value: 3, label: "判断" }
      ],
      typeList: [],
      file: {
        path: ""
      },
      importTypes: [],
      modelList: [],
      type: {
        exerciseType: 0
      },
      searchData: {
        conditions: {
          exerciseType: null,
          exerciseName: "",
          modelId: null,
          sidx: "seq",
          order: "asc"
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
    this.getModels();
  },
  methods: {
    selectFiles() {
      let that = this;
      $(".sf").trigger("click");
      $(".sf").on("click", function() {
        var file = $(".sf")[0].files[0];
        var reg = /(.*)\.(xls|xlsx|csv)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传excel文件");
        } else {
          that.file.path = file.name;
          that.preview(file);
        }
      });
      $(".sf").on("change", function() {
        var file = $(".sf")[0].files[0];
        var reg = /(.*)\.(xls|xlsx|csv)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传excel文件");
        } else {
          that.file.path = file.name;
          that.preview(file);
        }
      });
    },
    getModels() {
      var that = this;
      axios
        .post(api.api.execrisetype.modelall)
        .then(response => {
          var resultData = response.data;
          if (resultData.code == 0) {
            that.modelList = resultData.list;
          }
        })
        .catch(error => {
          util.alert("网络错误，请稍后再试！");
        });
    },
    getData(val) {
      var that = this;
      var param = util.clone(that.searchData);

      if (param.conditions.modelId != null) {
        if (param.conditions.modelId.length == 0) {
          param.conditions.modelId = null;
        }
      }

      if (param.conditions.exerciseType != null) {
        if (param.conditions.exerciseType.length == 0) {
          param.conditions.exerciseType = null;
        }
      }
      that.searchData.page.page = val;
      that.loading = true;
      axios.post(api.api.execrisetype.list, param).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.typeList = rdata.page.list;
          that.searchData.page.listTotal = rdata.page.totalCount;
        } else {
          this.$message.error("查询失败" + rdata.msg);
        }
      });
    },
    save() {
      var that = this;
      var param = that.type;
      param.createTime = null;
      param.updateTime = null;
      axios.post(api.api.execrisetype.save, param).then(response => {
        that.loading = false;
        
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          that.exerciseEditVisable = false;
          that.getData(1);
        } else {
          this.$message.error("保存失败" + rdata.msg);
        }
      });
    },
    delData() {
      var param = this.type;
      axios.post(api.api.execrisetype.delete, param).then(response => {
        
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData(1);
        } else {
          this.$message.error("删除失败" + rdata.msg);
        }
        this.centerDialogVisible = false;
      });
    },
    del(item) {
      this.type = item;
      this.centerDialogVisible = true;
    },
    info(item) {
      var that = this;
      var param = item;
      axios.post(api.api.execrisetype.info, param).then(response => {
        
        var rdata = response.data;
        if (rdata.code == 0) {
          that.type = rdata.exerciseType;
          that.exerciseEditVisable = true;
        } else {
          this.$message.error("查询失败" + rdata.msg);
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
    },
    showEdit() {
      this.exerciseEditVisable = true;
      this.type = {};
    },
    patchItems() {
      this.importTypes = [];
      this.file.path = "";
      this.patchVisible = true;
    },
    preview(file) {
      var that = this;
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: "binary"
        });
        var deviceData = null;
        var deviceArray = [];
        for (let sheet in workbook.Sheets) {
          deviceData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          console.log(deviceData);
        }
        deviceData.forEach(element => {
          var data = Object.values(element);
          var item = {
            id: 0,
            exerciseName: data[0],
            exerciseTypeName: data[1],
            exerciseType: data[1],
            exerciseModelId: data[2],
            exerciseModelName: data[2],
            description: data[3],
            remark: data[4]
          };
          that.importTypes.push(item);
          that.tidy(item);
          console.log(that.importTypes);
        });
      };
      fileReader.readAsBinaryString(file);
    },
    tidy(item) {
      this.modelList.forEach(element => {
        if (element.modelName == item.exerciseModelId) {
          item.exerciseModelName = element.modelName;
          item.exerciseModelId = element.id;
        }
      });
      this.typeOptions.forEach(element => {
        if (element.label == item.exerciseTypeName) {
          item.exerciseType = element.id;
        }
      });
    },
    excelImport() {
      var that = this;
      var param = that.importTypes;
      axios.post(api.api.execrisetype.patchsave, param).then(response => {
        
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "导入成功",
            type: "success"
          });
          that.patchVisible = false;
          that.getData(1);
        } else {
          this.$message.error("导入失败" + rdata.msg);
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    export2Model() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = ["题型名称", "题型", "题型模板", "题型说明", "备注"];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "deviceid",
          "devicename",
          "macaddress",
          "username",
          "hasbind",
          "isenable"
        ];
        let that = this;
        axios
          .post(api.api.execrisetype.modelall)
          .then(response => {
            var resultData = response.data;
            console.log(resultData);
            if (resultData.code == 0) {
              var data = resultData.list;
              const data = this.formatJson(filterVal, data);
              export_json_to_excel(tHeader, data, "题型数据列表");
            }
          })
          .catch(error => {
            util.alert("网络错误，请稍后再试！");
          });
      });
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
