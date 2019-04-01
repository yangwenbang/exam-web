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
      <div class="rs clearfix">
        <div class="ln">所属商品：</div>
        <div class="rn">
          <el-select v-model="CardPatchVo.product.id" clearable placeholder="请选择">
            <el-option v-for="item in productLst" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="p-t p-t2">
        <div class="name">卡片列表</div>
      </div>
      <div class="result-c" v-if="cards.length">
        <table class="comTb">
          <tr>
            <th>卡号</th>
            <th>密码</th>
          </tr>
          <tr v-for="(item,index) in cardCopys" :key="index">
            <td>{{item.code}}</td>
            <td>{{item.password}}</td>
          </tr>
        </table>
      </div>
      <div class="p-f">
        <div class="page">
          <routerPaging :total='cards.length' :date="date" v-on:change="pageChange"></routerPaging>
        </div>
      </div>
      <div class="p-c" v-if="cards.length" style="text-align:center;">
        <input type="button" class="btn btn-primary" value="导入" @click="patchAdd">
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
  name: 'cardPatch',
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
  data () {
    return {
      loading: false,
      file: {
        path: ''
      },
      cards: [],
      cardCopys: [],
      productLst: [],
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
      CardPatchVo: {
        cards: [],
        product: {
          id: ''
        }
      },
      date: new Date()
    }
  },
  created () {
    this.getProducts()
  },
  watch: {
    hasShow: function (n, o) {
      this.deleteFiles()
    }
  },
  methods: {
    getProducts () {
      var that = this
      var param = that.productSearchCondition
      console.log(param,"111");
      // 添加请求头
      axios.post(api.api.product.list, param).then(response => {
        if (response.data.bresult) {
          console.log( response.data.object);
          that.productLst = response.data.object
          console.log(that.productLst)
        }
      })
    },
    pageChange (val) {
      var start = (val - 1) * 10
      var end = val * 10
      var cardCopy = this.cards.slice(start, end)
      console.log(cardCopy)
      this.cardCopys = cardCopy
    },
    deleteFiles () {
      this.file.path = ''
      this.cards = []
      this.cardCopys = []
      $('.sf').val(null)
    },
    selectFiles () {
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
    patchAdd () {
      var param = this.CardPatchVo
      var that = this
      that.loading = true
      param.cards = this.cards
      axios.post(api.api.card.patchAdd, param).then(response => {
        that.loading = false
        if (response.data.bresult) {
          util.alertdo(response.data.message, function () {
            that.$emit('closeCard', false)
          })
        }
      }).catch(res => {
        that.loading = false
        util.alert('网络错误！')
      })
    },
    cancelAdd () {
      this.$emit('closeCard', false)
    },
    preview (file) {
      // console.log(t)
      var that = this
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        const data = ev.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        var cardData = null
        var cardArray = []
        for (let sheet in workbook.Sheets) {
          cardData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        }
        if (Object.getOwnPropertyNames(cardData[0]).length != 3) {
          util.alert('导入的数据格式不符合要求，请按照导入模板进行数据导入！')
        } else {
          for (var i = 0; i < cardData.length; i++) {
            var card = {code: cardData[i].code, password: cardData[i].password}
            console.log(card)
            var codeReg = /[1-9][0-9]{18}/
            var codeCheck = codeReg.test(cardData[i].code)
            console.log(codeCheck)
            var passwordReg = /[0-9]{18}/
            var pcheck = passwordReg.test(cardData[i].password)
            console.log(pcheck)
            if (codeCheck && pcheck) {
              cardArray.push(card)
            } else {
              util.alert('导入的数据的格式不正确，请检查数据格式是否有误！')
              break
            }
          }
          that.cards = cardArray
          that.date = new Date()
          that.pageChange(1)
        }
      }
      that.cards = []
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
    margin-bottom: 20px;
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

  .cfile .rs {
    position: absolute;
    float: right;
    z-index: 10;
    right: -350px;
    top: 0;
  }

  .cfile .rs .ln {
    float: left;
    font-size: 16px;
    color: #333;
    line-height: 40px;
  }

  .cfile .rs .rn {
    float: right;
  }

  .cfile .sf {
    display: none;
  }

  .cfile span {
    display: inline-block;
    height: 40px;
    width: 100px;
    font-size: 40px;
    line-height: 100px;
    text-align: center;
    color: #fff;
    background: #ddd;
    cursor: pointer;
  }
</style>
