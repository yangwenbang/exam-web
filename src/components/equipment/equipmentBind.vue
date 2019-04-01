<template>
  <div>
    <div class="head-c">
      <span class="bread-item">设备绑定</span>
    </div>
    <div class="content">
      <div class="equipmentBind">
        <div class="bind-item">
          <span>设备ID</span>
          <input type="text" placeholder="" v-model="deviceId">
        </div>
        <div class="bind-item">
          <span>用户ID</span>
          <input type="text" placeholder="" v-model="userId">
        </div>
        <div class="bind-item">
          <span>用户手机</span>
          <input type="text" placeholder="" v-model="phone">
        </div>
        <div class="bind-item">
          若用户ID为空则以手机号绑定，
          否则用户ID优先
        </div>
        <div>
          <button @click="bind">绑定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from '../../config/apiConfig'

export default {
  name: "equipmentBind",
  data () {
    return {
      deviceId: '',
      userId: '',
      phone: ''
    }
  },
  created () {
  },
  methods: {
    bind () {
      let that = this;
      var param = {
        device: {
          deviceId: that.deviceId
        },
        user: {
          id: that.userId,
          phone: that.phone
        }
      };
      axios.post(api.api.device.bind,param).then(function(response) {
        let result = response.data;
        if (response.status === 200) {
          if (result.bresult) {
            util.alert("绑定成功");
          } else {
            util.alert(result.message);
          }
        }
      })
        .catch(function(error) {
          util.alert('网络异常')
        })
    }
  }
}
</script>
<style scoped>
  .equipmentBind {
    width: 350px;
    margin: 0 auto;
    padding: 30px 100px;
  }
  .equipmentBind .bind-item {
    margin-bottom: 25px;
  }
  .equipmentBind .bind-item input{
    box-sizing: border-box;
    width: 250px;
    height: 26px;
    margin-left: 10px;
  }
  .equipmentBind button {
    width: 310px;
    height: 36px;
  }
</style>
