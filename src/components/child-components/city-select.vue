<template>
  <div>
    <div class="iscity">
      <div class="iin" @click="showsel">
        <div class="itips" v-if="!selpri">请选择城市</div>
        <div class="s" v-if="selpri">
          {{selpri.provinceName}}
          <div class="close">
            <i @click="delprivince" class="el-dialog__close el-icon el-icon-close"></i>
          </div>
        </div>
        <div class="s" v-if="selcity">
          {{selcity.cityName}}
          <div class="close">
            <i @click="delcity" class="el-dialog__close el-icon el-icon-close"></i>
          </div>
        </div>
      </div>
      <div class="if" v-show="showcitysel">
        <div class="ic">
          <ul v-if="selcities.length==0">
            <li v-for="item in privinces" :key="item.id">
              <div class="it" @click="selprivince(item)">{{item.provinceName}}</div>
            </li>
          </ul>
          <ul v-else>
            <li v-for="item in selcities" :key="item.id">
              <div
                :class="['it',{'itc':selcity!=null&&selcity.id==item.id}]"
                @click="selecity(item)"
              >{{item.cityName}}</div>
            </li>
          </ul>
        </div>
        <div class="ifoot">
          <button class="btn rb" @click="selcityok">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../../config/apiConfig";

export default {
  name: "CitySelect",
  props: {
    cityId: {
      type: Number,
      default: function() {
        return 0;
      }
    }
  },
  data() {
    return {
      showcitysel: false,
      selcities: [],
      cities: [],
      selpri: null,
      selcity: null,
      privinces: []
    };
  },
  created() {
    this.getProvince();
    this.getCity();
  },
  mounted() {
    this.tidyCity();
  },
  watch: {
    cityId: function(n, o) {
      if (n != o) {
        if (this.cityId != 0) {
          this.tidyCity();
        } else {
          this.selpri = null;
          this.selcity = null;
        }
      }
    }
  },
  methods: {
    tidyCity() {
      if (this.cityId > 0) {
        this.cities.forEach(item => {
          if (item.id == this.cityId) {
            this.selcity = item;
          }
        });
        if (this.selcity != null) {
          this.privinces.forEach(item => {
            if (this.selcity.provinceId == item.id) {
              this.selpri = item;
            }
          });
          this.selprivince(this.selpri);
        }
      } else {
        this.selpri = null;
        this.selcity = null;
      }
    },
    getCity() {
      var that = this;
      axios.post(api.api.city.listall).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.cities = rdata.list;
          that.tidyCity();
        }
      });
    },
    showsel() {
      this.showcitysel = true;
    },
    getProvince() {
      var that = this;
      axios.post(api.api.province.all).then(response => {
        that.loading = false;
        var rdata = response.data;
        if (rdata.code == 0) {
          that.privinces = rdata.list;
        }
      });
    },
    delprivince() {
      this.selpri = null;
      this.selcities = [];
      this.selcity = null;
    },
    delcity() {
      this.selcity = null;
    },
    selprivince(item) {
      this.selpri = item;
      this.selcities = [];
      this.cities.forEach(eitem => {
        if (eitem.provinceId == item.id) {
          this.selcities.push(eitem);
        }
      });
    },
    selecity(item) {
      this.selcity = item;
    },
    selcityok() {
      if (this.selcity != null) {
        var city = {
          provinceId: this.selpri.id,
          cityId: this.selcity.id
        };
        this.$emit("change", city);
        this.showcitysel = false;
      } else {
        this.$message.error("请选择城市");
      }
    }
  }
};
</script>
<style>
.iscity {
  width: 893px;
  position: relative;
  cursor: pointer;
}
.iscity .iin {
  border: solid 1px #aaa;
  width: 893px;
  height: 38px;
}
.iscity .iin .itips {
  float: left;
  z-index: 2;
  line-height: 30px;
  padding: 5px;
  padding-left: 8px;
  font-size: 13px;
  color: #aaa;
}
.iscity .iin .s {
  max-width: 200px;
  width: 100px;
  margin: 5px;
  border: solid 1px #aaa;
  border-radius: 2px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  float: left;
  position: relative;
  font-size: 13px;
}

.iscity .iin .s .close {
  position: absolute;
  float: right;
  right: 0;
  bottom: 8px;
  width: 20px;
  height: 20px;
  z-index: 11;
}

.iscity .if {
  float: left;
  position: absolute;
  z-index: 10;
  height: 300px;
  width: 100%;
  border: solid 1px #aaa;
  top: 45px;
  background: #fff;
}
.iscity .if .ic {
  height: 260px;
  width: 100%;
  overflow-y: auto;
}
.iscity .if .ifoot {
  float: left;
  position: absolute;
  z-index: 10;
  height: 40px;
  width: 100%;
  border-top: solid 1px #aaa;
  bottom: 0px;
  background: #fff;
}
.iscity .if .ifoot .rb {
  float: right;
  margin-right: 20px;
  width: 50px;
  height: 30px;
  margin-top: 5px;
}
.iscity .if ul {
  list-style: none;
}
.iscity .if ul li {
  float: left;
  min-width: 100px;
}
.iscity .if ul li .it {
  margin: 5px;
  border: solid 1px #aaa;
  border-radius: 2px;
  height: 30px;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.iscity .if ul li .itc {
  background: #4d9fe4;
  border: solid 1px #4d9fe4;
  color: #fff;
}
.iscity .if ul li .it:hover {
  background: #4d9fe4;
  border: solid 1px #4d9fe4;
  color: #fff;
}
@media screen and (max-width: 1400px) {
  .iscity {
    width: 615px;
  }
  .iscity .iin {
    width: 615px;
  }
}
</style>
