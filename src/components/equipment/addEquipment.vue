<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加单台设备</span>
    </div>
    <div class="content">
      <!--<div id="addEquipment">-->
        <!--<div class="addEquipment">-->
          <!--<div>添加单个设备</div>-->
          <!--<div class="c">-->
            <!--<input type="text" placeholder="请输入设备ID" v-model="equipmentId">-->
            <!--<div class="tip" v-if=" isShowHint && hint === '请输入设备ID' ">{{hint}}</div>-->
          <!--</div>-->
          <!--<div class="c">-->
            <!--<input placeholder="请输入设备Mac" type="text" v-model="equipmentMac" @blur="macReg">-->
            <!--<div class="tip" v-if=" isMacShow">{{macTip}}</div>-->
          <!--</div>-->
          <!--<div class="c">-->
            <!--<input placeholder="请输入设备名称" type="text" v-model="equipmentName">-->
            <!--<div class="tip" v-if=" isShowHint && hint === '请输入设备名称' ">{{hint}}</div>-->
          <!--</div>-->
          <!--<button  @click="addEquipment" :class="{ not : isable }" :disabled="isSub">添加设备</button>-->
        <!--</div>-->
      <!--</div>-->
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加单个设备</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>设备ID：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入设备ID" v-model="equipmentId">
              <div class="tip" v-if=" isShowHint && hint === '请输入设备ID' ">{{hint}}</div>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>设备Mac：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入设备Mac" v-model="equipmentMac" @blur="macReg">
              <div class="tip" v-if=" isMacShow">{{macTip}}</div>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>设备名称：</span>
            </div>
            <div class="tr">
              <input class="add-input" type="text" placeholder="请输入设备名称" v-model="equipmentName">
              <div class="tip" v-if=" isShowHint && hint === '请输入设备名称' ">{{hint}}</div>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>获取渠道：</span>
            </div>
            <div class="tr">
              <el-select v-model="equipmentChannel" clearable placeholder="请选择" id="input-channel">
                <el-option v-for="item in channel" :key="item.id" :label="item.label" :value="item.wbval1">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="addEquipment" :class="{ not : isable }" :disabled="isSub">添加设备</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import api from '../../config/apiConfig'
export default {
  name: 'addEquipment',
  data () {
    return {
      equipmentId: '',
      equipmentMac: '',
      equipmentName: '',
      equipmentChannel: '',
      hint: '',
      isShowHint: false,
      isMacShow: false,
      isable: false,
      isSub: false,
      macTip: '',
      loading: '',
      channel: []
    }
  },
  created () {
    this.getChannel()
  },
  methods: {
    getChannel () {
      var that = this;
      axios.post(api.api.wordbook.getchannel).then(res => {
        if (res.data.bresult) {
          that.channel = res.data.object;
          that.channel.forEach(function (item) {
            item.label = item.tpname + '(' + item.wbname + ')';
          })
        } else {
          that.channel = null;
        }
      }).catch(res => {
        console.log(res);
      })
    },
    macReg () {
      var reg = /(([A-F0-9]{2}:)|([A-F0-9]{2}-)){5}[A-F0-9]{2}/g
      if (!reg.test(this.equipmentMac)) {
        this.isMacShow = true;
        this.macTip = 'MAC地址错误，请检查后重新输入！'
      } else {
        this.isMacShow = false;
      }
    },
    addEquipment () {
      let that = this
      that.isable = true
      var param = {
        'macAddress': that.equipmentMac,
        'deviceId': that.equipmentId,
        'deviceName': that.equipmentName,
        'channel': that.equipmentChannel
      }
      if (!that.equipmentId) {
        that.hint = '请输入设备ID'
        that.isShowHint = true
        return
      }
      if (!that.equipmentMac) {
        that.hint = '请输入设备Mac'
        that.isShowHint = true
        return
      }
      if (!that.equipmentName) {
        that.hint = '请输入设备名称'
        that.isShowHint = true
        return
      }
      if (!that.isMacShow) {
        axios.post(api.api.device.add, param).then(function (response) {
          that.isSub = true
          let data = response.data
          if (data.bresult === true) {
            that.isSub = false
            util.alertdo(response.data.message,function () {
              window.location.href = "/#/equipment/list/1";
            });
          } else {
            util.alert(response.data.message);
            that.isSub = false
          }
        })
          .catch(function (error) {
            that.isSub = false
            console.log(error)
          })
      } else {
        util.alert('添加失败！')
      }
    }
  }
}

</script>
<style scoped>
  .panel .tr{
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
  .panel .not{
    background-color: rgba(49,195,166,.5);
    cursor: not-allowed;
  }

</style>
