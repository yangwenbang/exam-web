<template>
  <div class="pager" v-if="pageSize>0">
    <div class="i lx">
      <ul>
        <li :class="[ '-first', {'-disabled': index === 1}]" @click="first"><<</li>
        <li :class="[ '-prev', {'-disabled': index === 1}]" @click="prevPage"><</li>
        <li class="-number" @click="goPage(item)" v-for="item in pPages">{{item}}</li>
        <li class="-number -active">{{this.index}}</li>
        <li class="-number" @click="goPage(item)" v-for="item in nPages">{{item}}</li>
        <li :class="[ '-next', {'-disabled': index === pageSize}]" @click="nextPage">></li>
        <li :class="[ '-last', {'-disabled': index === pageSize}]" @click="last">>></li>
      </ul>
    </div>
    <div class="i rx">
      <div class="count">
        <span>共</span>
        <span class="count-num">{{size}}</span>
        <span>项</span>
        <span>每页</span>
        <span class="count-num">{{limit}}</span>
        <span>条</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "routerPaging",
  props: {
    // 当前页面的索引
    pageIndex: {
      type: Number,
      default: 1
    },
    // 每一页最多显示的条数
    pageLimit: {
      type: Number,
      default: 10
    },
    // 每一页最多显示的页码数字
    perPages: {
      type: Number,
      default: 2
    },
    // 总条数
    total: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    date: {
      type: Date,
      default: function() {
        return null;
      }
    }
  },
  data() {
    return {
      //当前页码
      index: +this.pageIndex,
      limit: this.pageLimit,
      //限定前后个数
      tSize: 3,
      //总条数
      size: this.total,
      //是否显示前置按钮
      showPrevMore: false,
      showNextMore: false,
      //总页数
      pageSize: 0,
      //前页码集合
      pPages: [],
      //后页码集合
      nPages: []
    };
  },
  watch: {
    date: function(n, o) {
      if (n != o) {
        this.tidyPages();
        this.tidyPagers();
      }
    },
    total: function(n, o) {
      if (n != o) {
        this.total = n;
        this.tidyPages();
        this.tidyPagers();
      }
    }
  },
  methods: {
    init() {
      this.index = 1;
      this.cal();
    },
    cal() {
      this.tidyPages();
      this.tidyPagers();
    },
    // 计算总页码
    tidyPages() {
      this.size = this.total;
      this.pageSize = Math.ceil(this.total / this.limit);
    },
    tidyPagers() {
      this.addNearPage();
    },
    addNearPage() {
      this.pagePreNear();
      this.pageNextNear();
    },
    goPage(page) {
      if (this.index !== page) {
        this.index = page;
        this.pagePreNear();
        this.pageNextNear();
        this.$emit("change", this.index);
      }
    },
    pagePreNear() {
      this.pPages = [];
      //默认添加5页
      var cpage = this.index;
      var cdis = cpage - 1;
      if (cdis >= this.tSize) {
        for (var i = this.tSize; i > 0; i--) {
          this.pPages.push(cpage - i);
        }
      } else {
        for (var i = cdis; i > 0; i--) {
          this.pPages.push(cpage - i);
        }
      }
    },
    pageNextNear() {
      this.nPages = [];
      //默认添加5页
      var cpage = this.index;
      var cdis = this.pageSize - this.index;
      if (cdis >= this.tSize) {
        for (var i = 0; i < this.tSize; i++) {
          this.nPages.push(cpage + 1 + i);
        }
      } else {
        for (var i = 0; i < cdis; i++) {
          this.nPages.push(cpage + 1 + i);
        }
      }
    },
    prevPage() {
      if (this.index > 1) {
        this.goPage(this.index - 1);
      }
    },
    nextPage() {
      if (this.index < this.pageSize) {
        this.goPage(this.index + 1);
      }
    },
    first() {
      if (this.index !== 1) {
        this.goPage(1);
      }
    },
    last() {
      if (this.index !== this.pageSize) {
        this.goPage(this.pageSize);
      }
    }
  }
};
</script>
<style>
.pager {
  display: inline-block;
}

.pager .i {
  float: right;
}

.pager .lx {
  margin-top: 10px;
  text-align: right;
}

.pager .rx {
  text-align: left;
}

.pager .rx .count {
  font-family: "microsoft yahei";
  margin-right: 20px;
  font-size: 14px;
  color: #666;
}

.pager .rx .count .count-num {
  color: #666;
}

.pager ul {
  list-style: none;
}

.pager ul li {
  border-top: 1px solid #aaa;
  border-right: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.pager ul li {
  float: left;
  width: 30px;
  text-align: center;
}

.pager ul .-first {
  border-left: 1px solid #aaa;
}

.pager .-disabled {
  cursor: not-allowed !important;
  background-color: #fff;
}

.pager .-disabled:hover {
  background-color: #fff;
  color: #324057;
}

.pager .-number:hover {
  color: #1abc9c;
  background-color: #fff;
  border-color: #1abc9c;
}

.pager ul .-active {
  color: #fff !important;
  background-color: #1abc9c !important;
  border-color: #1abc9c !important;
}
</style>
