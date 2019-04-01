<template>
  <div>
    <div class="head-c">
      <span class="bread-item">设备详情</span>
    </div>
    <div class="content">
      <div id="equipmentDetail">
        <!--设备管理第一部分信息-->
        <div class="ii">
          <div class="common-background">设备基本信息</div>
          <div v-loading="loading">
            <div class="route-config">
              <div class="block_inline"><span>设备ID: </span>
                <span>{{device.deviceId}}</span>
              </div>
              <div class="block_inline"><span>设备MAC: </span>
                <span>{{device.macAddress}}</span>
              </div>
              <div class="block_inline">
                <span>是否启用: </span>
                <span>{{device.enable? '是' : '否'}}</span>
              </div>
            </div>
            <div class="route-config">
              <div class="block_inline">
                <span>是否绑定: </span>
                <span v-if="device.hasBind">是</span>
                <span v-if="!device.hasBind">否</span>
              </div>
              <div class="block_inline" v-if="device.hasBind">
                <span>所属用户: </span>
                <span>{{user.username}}</span>
              </div>
            </div>
            <div class="route-config">
              <div class="block_inline">
                <span>是否激活:</span>
                <span v-if="device.active">是</span>
                <span v-if="!device.active">否</span>
              </div>
              <div class="block_inline">
                <span>是否在线: </span>
                <span v-if="device.online">是</span>
                <span v-if="!device.online">否</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ii">
          <div class="common-background">路由配置信息</div>
          <div v-loading="loading">
            <div class="route-config" v-if="pshow">
              <div class="block_inline"><span>联网方式: </span><span>{{deviceConfig.sord}}</span></div>
              <div class="block_inline"><span>宽带账号: </span><span>{{deviceConfig.networkAccount}}</span></div>
              <div class="block_inline"><span>宽带密码: </span><span>{{deviceConfig.networkPassWord}}</span></div>
            </div>
            <div class="route-config" v-if="sshow">
              <div class="block_inline"><span>联网方式: </span><span>静态IP</span></div>
              <div class="block_inline"><span>网络地址: </span><span>{{deviceConfig.static_webAddress}}</span></div>
              <div class="block_inline"><span>子网掩码: </span><span>{{deviceConfig.static_subnetMask}}</span></div>
              <div class="block_inline"><span>默认网关: </span><span>{{deviceConfig.static_defaultNetWay}}</span></div>
              <div class="block_inline"><span>首选DNS: </span><span>{{deviceConfig.oneDNS}}</span></div>
              <div class="block_inline"><span>备选DNS: </span><span>{{deviceConfig.twoDNS}}</span></div>
            </div>
            <div class="route-config" v-if="dshow">
              <div class="block_inline"><span>联网方式: </span><span>动态IP</span></div>
              <div class="block_inline"><span>DNS配置方式: </span><span>{{deviceConfig.dynamicType = 0 ? '自动配置DNS' : '手动配置DNS'}}</span></div>
              <div class="block_inline"><span>首选DNS: </span><span>{{deviceConfig.oneDNS}}</span></div>
              <div class="block_inline"><span>备选DNS: </span><span>{{deviceConfig.twoDNS}}</span></div>
            </div>
            <div class="route-config">
              <div class="block_inline"><span>2.4G: </span><span>{{deviceConfig.hasTwoConfig ? '开启' : '关闭'}}</span></div>
              <div class="block_inline"><span>WiFi名称: </span><span>{{deviceConfig.twoWifiAccount}}</span></div>
              <div class="block_inline"><span>WiFi密码: </span><span>{{deviceConfig.twoWifiPassWord}}</span></div>
              <div class="block_inline"><span>加密方式: </span><span>{{deviceConfig.twoWifiLocktype ? deviceConfig.twoWifiLocktype : '无'}}</span></div>
              <div class="block_inline"><span>是否隐藏网络: </span><span>{{deviceConfig.twoWifiForce ? '是' : '否'}}</span></div>
            </div>
            <div class="route-config">
              <div class="block_inline"><span>5G: </span><span>{{deviceConfig.hasFiveConfig ? '开启' : '关闭'}}</span></div>
              <div class="block_inline"><span>WiFi名称: </span><span>{{deviceConfig.fiveAccount}}</span></div>
              <div class="block_inline"><span>WiFi密码: </span><span>{{deviceConfig.fiveWifiPassWord}}</span></div>
              <div class="block_inline"><span>加密方式: </span><span>{{deviceConfig.fiveWifiLocktype ? deviceConfig.fiveWifiLocktype : '无'}}</span></div>
              <div class="block_inline"><span>是否隐藏网络: </span><span>{{deviceConfig.fiveWifiForce ? '是' : '否'}}</span></div>
            </div>
            <div class="route-config">
              <div class="block_inline"><span>访客WiFi: </span><span>{{deviceConfig.hasCustomerConfig ? '开启' : '关闭'}}</span></div>
              <div class="block_inline"><span>WiFi名称: </span><span>{{deviceConfig.customerWifiAccount}}</span></div>
              <div class="block_inline"><span>WiFi密码: </span><span>{{deviceConfig.customerWifiPassWord}}</span></div>
              <div class="block_inline"><span>加密方式: </span><span>{{deviceConfig.customerWifiLocktype ? deviceConfig.customerWifiLocktype : '无'}}</span></div>
              <div class="block_inline"><span>是否隐藏网络: </span><span>{{deviceConfig.customerWifiForce ? '是' : '否'}}</span></div>
            </div>
          </div>
        </div>
        <div class="ii">
          <div class="common-background">存储空间  (单位：G)</div>
          <div v-loading="loading">
            <div class="route-config">
              <div class="block_inline"><span>内置存储（总）: </span><span>{{(storage.total/1024/1024).toFixed(4)}}</span></div>
              <div class="block_inline"><span>已使用: </span><span>{{used}}</span></div>
              <div class="block_inline"><span>空闲: </span><span>{{noused}}</span></div>
            </div>
            <div class="route-config">
              <div class="block_inline"><span>外置存储（总）: </span><span>0</span></div>
              <div class="block_inline"><span>已使用: </span><span>0</span></div>
              <div class="block_inline"><span>空闲: </span><span>0</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import api from '../../config/apiConfig'

  export default {
    name: "EquipmentDetail",
    data() {
      return {
        loading: true,
        device: {
          deviceId: this.$route.params.id
        },
        deviceConfig: {},
        storage: {},
        message: "8972400929",
        pshow: false,
        sshow: false,
        dshow: false,
        used: 0,
        noused: 0
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        let that = this;
        var param = that.device
        axios.post(api.api.device.info, param).then(function (response) {
          let result = response.data;
          console.log(result);
          if (result.bresult) {
              that.device = result.object.device;
              if (result.object.deviceConfig != null) {
                that.deviceConfig = result.object.deviceConfig;
                if (that.deviceConfig.sord === 'pppoe') {
                  that.pshow = true;
                } else if (that.deviceConfig.sord === 'static') {
                  that.sshow = true;
                } else if (that.deviceConfig.sord === 'dhcp') {
                  that.dshow = true;
                };
              }
              if (result.object.user != null) {
                that.user = result.object.user;
              }
              if (result.object.storage != null) {
                that.storage = result.object.storage;
                that.used = ((that.storage.movie + that.storage.music + that.storage.photo + that.storage.share)/1024/1024).toFixed(4)
                if (that.used == '0.0000') {
                  that.used = 0
                }
                that.noused = that.storage.other
                if (that.noused == 0) {
                  that.noused = 0
                } else {
                  that.noused = ((that.noused)/1024/1024).toFixed(4)
                }
              }
            }
            that.loading = false;
        })
      }
    }
  };
</script>

<style>
  #equipmentDetail {
    width: 100%;
  }

  #equipmentDetail .ii {
    text-align: left;
    border: solid 1px #ddd;
    margin-bottom: 20px;
  }

  #equipmentDetail .ii .common-background {
    background-color: #f1f1f1;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding-left: 20px;
  }

  #equipmentDetail .ii .ii-content {
    margin-top: 30px;
    font-size: 14px;
    padding-left: 20px;
  }

  #equipmentDetail .ii .ii-content > div {
    margin-bottom: 30px;
  }

  #equipmentDetail .block_inline {
    display: inline-block;
    margin-left: 20px;
  }

  #equipmentDetail .block_inline div {
    margin-bottom: 30px;
  }

  #equipmentDetail .ii {
    font-size: 14px;
  }

  #equipmentDetail .ii .route-config {
    border-top: 1px solid #d7d7d7;
    padding: 20px 0;
  }

  #equipmentDetail .ii .route-config div {
    min-width: 260px;
  }
</style>
