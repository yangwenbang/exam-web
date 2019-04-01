<template>
  <div v-loading="loading">
    <div class="cfile">
      <div :class="[ 'lb', {'lh': file.path.length!=0}]">
        <button class="lt" @click="selectFiles">请选择文件</button>
        <input class="sf" type="file"
               accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      </div>
      <div :class="[ 'lo', {'lh': file.path.length==0}]">
        <button class="lt" @click="deleteFiles">{{file.path}}</button>
      </div>
      <div class="download">
        <div class="dl" @click="downloadMouldAdd">
          <span class="downLoadAdd">设备批量导入模版(标准)</span>
        </div>
        <div class="dr" @click="downloadMouldUpd">
          <span class="downLoadUpd">设备批量导入模版(带渠道标识)</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="p-t p-t2">
        <div class="name">设备列表</div>
      </div>
      <div class="result-c" v-if="devices.length">
        <table class="comTb">
          <tr>
            <th>设备序列号</th>
            <th>设备mac地址</th>
            <th>获取渠道</th>
          </tr>
          <tr v-for="(item,index) in devCopys" :key="index">
            <td>{{item.deviceId}}</td>
            <td>{{item.macAddress}}</td>
            <td>{{item.channel}}</td>
          </tr>
        </table>
      </div>
      <div class="p-f">
        <div class="page">
          <routerPaging :total='devices.length' :date="date" v-on:change="pageChange"></routerPaging>
        </div>
      </div>
      <div class="p-c" v-if="devices.length" style="text-align:center;">
        <input type="button" class="btn btn-primary" value="导入" @click="patchAdd">
        <input type="button" class="btn btn-primary" value="修改" @click="patchUpd">
        <input type="button" class="btn btn-primary" value="取消" @click="cancelAdd">
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import routerPaging from '@/components/child-components/page-components/paging'
  import api from '../../../config/apiConfig'

  var XLSX = require('xlsx')
  export default {
    name: 'devicePatch',
    components: {
      routerPaging
    },
    props: {
      // 总条数
      hasShow: {
        default: function () {
          return true
        }
      }
    },
    data() {
      return {
        loading: false,
        file: {
          path: ''
        },
        devices: [],
        devCopys: [],
        date: new Date()
      }
    },
    watch: {
      hasShow: function (n, o) {
        this.deleteFiles()
      }
    },
    methods: {
      downloadMouldAdd() {
        window.open('../../../static/file/设备导入(标准).xlsx')
      },
      downloadMouldUpd() {
        window.open('../../../static/file/设备导入(带渠道标识).xlsx')
      },
      pageChange(val) {
        var start = (val - 1) * 10
        var end = val * 10
        var devCopy = this.devices.slice(start, end)
        this.devCopys = devCopy
      },
      deleteFiles() {
        this.file.path = ''
        this.devices = []
        this.devCopys = []
        $('.sf').val(null)
      },
      selectFiles() {
        let that = this
        $('.sf').trigger('click')
        $('.sf').on('change', function () {
          var file = $('.sf')[0].files[0]
          var reg = /(.*)\.(xls|xlsx|csv)$/
          var check = reg.test(file.name)
          if (!check) {
            util.alert('请上传excel文件')
          } else {
            that.file.path = file.name
            that.preview(file)
          }
        })
      },
      patchAdd() {
        var param = this.devices
        var that = this
        that.loading = true
        axios.post(api.api.device.patchAdd, param).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alertdo(response.data.message, function () {
              that.$emit('closeDevice', false)
            })
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false
        })
      },
      patchUpd() {
        var param = this.devices
        var that = this
        that.loading = true
        axios.post(api.api.device.patchUpd, param).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alertdo(response.data.message, function () {
              that.$emit('closeDevice', false)
            })
          }
        }).catch(res => {
          that.loading = false
          util.alert('网络错误！')
        })
      },
      cancelAdd() {
        this.$emit('closeDevice', false)
      },
      preview(file) {
        var that = this
        const fileReader = new FileReader()
        fileReader.onload = (ev) => {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          var deviceData = null
          var deviceArray = []
          for (let sheet in workbook.Sheets) {
            deviceData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
          }
          if (!(Object.getOwnPropertyNames(deviceData[0]).length == 4 ||
            Object.getOwnPropertyNames(deviceData[0]).length == 3)) {
            util.alert('1导入的数据格式不符合要求，请按照导入模板进行数据导入！')
          } else {
            for (var i = 0; i < deviceData.length; i++) {
              var AddressReg = /(([A-F0-9]{2}:)|([A-F0-9]{2}-)){5}[A-F0-9]{2}/g
              var adCheck = AddressReg.test(deviceData[i].macAddress)
              if (adCheck) {
                if (Object.getOwnPropertyNames(deviceData[0]).length ==3){
                  var device = {deviceId: deviceData[i].deviceId, macAddress: deviceData[i].macAddress}
                  deviceArray.push(device)
                }
                if (Object.getOwnPropertyNames(deviceData[0]).length ==4){
                  var device = {deviceId: deviceData[i].deviceId, macAddress: deviceData[i].macAddress, channel: deviceData[i].channel}
                  deviceArray.push(device)
                }
              } else {
                util.alert('2导入的数据的格式不正确，请检查数据格式是否有误！')
                break
              }
            }
            that.devices = deviceArray
            that.date = new Date()
            that.pageChange(1)
          }
        }
        that.devices = []
        fileReader.readAsBinaryString(file)
      }
    }
  }
</script>
<style scoped>
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
    color: #1ABC9C;
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
    color: #1ABC9C;
    background: none;
    width: 100%;
  }

  .cfile .rf:hover span {
    text-decoration: underline;
  }

  /*.cfile span {*/
  /*display: inline-block;*/
  /*height: 40px;*/
  /*width: 100px;*/
  /*font-size: 40px;*/
  /*line-height: 100px;*/
  /*text-align: center;*/
  /*color: #fff;*/
  /*background: #ddd;*/
  /*cursor: pointer;*/
  /*}*/
</style>
