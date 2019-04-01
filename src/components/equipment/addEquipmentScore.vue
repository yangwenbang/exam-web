<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加设备积分</span>
    </div>
    <div class="content">
      <div id="addEquipment">
        <div class="addEquipment">
          <div>添加设备积分</div>
          <div class="c">
            <input type="text" placeholder="请输入积分" v-model="score.score">
          </div>
          <!--<div class="c">
            <el-select v-model="score.rankType" clearable placeholder="请选择" style="width: 50%; height: 40px;">
              <el-option v-for="option in rankTypeLst" :key="option.id" :label="option.name" :value="option.id">
              </el-option>
            </el-select>
          </div>-->
          <button @click="addEquipmentScore">添加积分</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import api from '../../config/apiConfig'

  export default {
    name: 'addEquipmentScore',
    data() {
      return {
        score: {
          userId: this.$route.query.uid,
          deviceId: this.$route.query.did,
          score: '',
          rankType: ''
        },
        rankTypeLst: [
          {id: 1, name: '电信积分类型'},
          {id: 2, name: 'INT积分类型'}
        ]
      }
    },
    created() {
    },
    methods: {
      addEquipmentScore() {
        let that = this
        var data = that.score;
        axios.post(api.api.device.scoreAdd, data).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            window.location.href = '/#/equipment/list'
          }
        })

      }
    }
  }

</script>
<style scoped>
  #addEquipment {
    padding-top: 52px;
    padding-left: 220px;
  }

  #addEquipment .addEquipment {
    box-shadow: 1px 1px 13px 0 #ccc;
    width: 500px;
    margin: 0 auto;
    padding: 50px 0;
  }

  #addEquipment .addEquipment .c {
    margin: 30px 0;
  }

  #addEquipment .addEquipment .c input {
    width: 250px;
    height: 36px;
    padding-left: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }

  #addEquipment .addEquipment button {
    width: 250px;
    height: 36px;
    background-color: #31c3a6;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    outline: none;
  }

  #addEquipment .addEquipment .c div {
    font-size: 12px;
    color: #c6303e;
    text-align: left;
    margin: 5px auto;
    width: 250px;
  }
</style>
