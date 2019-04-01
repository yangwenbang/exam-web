<template>
  <div class="equipmentBind">
    <div class="bind-item">
      <span>用户ID</span>
      <input type="text" placeholder="" v-model="searchCondition.conditions.userId">
    </div>
    <div>
      <button @click="change">兑换</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import api from '../../config/apiConfig'

export default {
  name: "changeProduct",
  data () {
    return {
      searchCondition: {
        conditions: {
          score: this.$route.query.score,
          productId: this.$route.query.pid,
          userId: '',
          rankType:this.$route.query.rankType,
        }}

    }
  },
  created () {
  },
  methods: {
    change () {

      var that = this;
      var param = that.searchCondition;
      axios.post(api.api.product.exchange, param).then(response => {
        if (response.data.bresult) {
          util.alert(response.data.message);
          window.location.href = "/#/recharge/goodslist";
        } else {
          util.alert(response.data.message)
        }
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
