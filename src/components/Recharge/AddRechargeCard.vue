<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加充值卡</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="add-card">
        <div class="first-step">
          <div class="addCard-t">
            <span>第一步，导入充值卡信息:</span>
          </div>
          <div class="addCard-c">
            <div class="single">
              <div class="single-c">
                <div class="card-num">
                  <span>卡号 ：</span><input type="text" v-model="card.code">
                </div>
                <div class="card-psw">
                  <span>卡密 ：</span><input type="text" v-model="card.password">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="second-step">
          <div class="addCard-t">
            <span>第二步，关联商品</span>
          </div>
          <div class="addCard-c">
            <el-select v-model="card.productId" clearable placeholder="请选择">
              <el-option v-for="item in productLst" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="final-step">
          <button @click="addCard"><span>单个导入</span></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import api from '../../config/apiConfig'

export default {
  name: 'addRechargeCard',
  data () {
    return {
      message: '12345678',
      productLst: [],
      loading: false,
      productSearchCondition: {
        conditions: {
          flag:true
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      card: {
        code: '',
        name: '',
        password: '',
        score: 0,
        productId: '',
        addUserId: ''
      },
    }
  },
  created () {
    this.getProducts()
  },
  methods: {
    getProducts: function () {
      var that = this
      var param = that.productSearchCondition
      // 添加请求头
      axios.post(api.api.product.list, param).then(response => {
        if (response.data.bresult) {
          that.productLst = response.data.object
        }
      })
    },
    addCard: function () {
      var that = this
      var param = that.card
      that.loading = true
      axios.post(api.api.card.add, param).then(response => {
        that.loading = false
        util.alert(response.data.message)
      }).catch(res => {
        util.alert('网络错误！')
        that.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .add-card {
    text-align: left;
    font-size: 14px;
  }

  .add-card .first-step {
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 20px;
  }

  .add-card .addCard-t {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .add-card .addCard-c {
    margin-bottom: 20px;
  }

  .addCard-c .batch {
    margin-bottom: 20px;
  }

  .addCard-c .single .single-c {
    margin-top: 20px;
    line-height: 40px;
  }

  .single-c .card-num,
  .single-c .card-psw {
    display: inline-block;
    margin-right: 50px;
  }

  .single-c .card-num input,
  .single-c .card-psw input {
    width: 250px;
    height: 30px;
    outline: none;
    padding-left: 10px;
  }

  .addCard-c .i {
    font-weight: bold;
  }

  .addCard-c .excel {
    margin-bottom: 20px;
  }

  .excel .e-up {
    line-height: 40px;
  }

  .excel .e-up > span {
    color: #555;
  }

  .excel .e-up input {
    outline: none;
    color: #aaa;
  }

  .excel .e-tip {
    color: #aaa;
  }

  .addCard-c .card-table table {
    width: 50%;
    border-collapse: collapse;
    text-align: center;
    border: 1px solid #e4e4e4;
  }

  .addCard-c .card-table table th,
  .addCard-c .card-table table td {
    height: 45px;
    border: 1px solid #e4e4e4;
  }

  .addCard-c .card-table table th {
    background-color: #F2F2F2;
  }

  .add-card .second-step {
    margin-bottom: 150px;
  }

  .addCard-c #goods {
    width: 150px;
    height: 35px;
    outline: none;
  }

  .final-step button {
    width: 150px;
    height: 35px;
    border: none;
    border-radius: 3px;
    outline: none;
    background-color: #1ABC9C;
    color: #fff;
  }


</style>
