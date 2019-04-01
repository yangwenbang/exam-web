<template>
  <div>
    <div class="cfile">
      <div>
        <span>
          <img v-if="img.path" :src="img.path">
        </span>
      </div>
      <div :class="[ 'lb', {'lh': img.path.length!=0}]">
        <button class="lt" @click="selectFiles">+</button>
        <input
          class="sf"
          :id="htmlid"
          type="file"
          accept="image/x-png, image/gif, image/jpeg, image/bmp"
        >
      </div>
      <div :class="[ 'lo', {'lh': img.path.length==0}]">
        <button class="lt" @click="deleteFiles">-</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../../../config/apiConfig";

export default {
  name: "fileUpload",
  props: {
    // 总条数
    imgPath: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      htmlid: "",
      index: 1,
      img: {
        path: "",
        urlPath: ""
      }
    };
  },
  created() {
    this.setId();
  },
  watch: {
    imgPath: function(n, o) {
      if (n != null) {
        this.img.path = n;
      } else {
        this.img.path = "";
      }
    }
  },
  methods: {
    setId() {
      this.htmlid = util.guid();
    },
    deleteFiles() {
      this.img.path = "";
      this.$emit("change", null);
    },
    selectFiles() {
      let that = this;
      let id = "#" + that.htmlid;
      $(id).trigger("click");
      $(id).on("change", function() {
        var file = $(id)[0].files[0];
        var reg = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传图片类型文件");
        } else {
          that.preview(file);
          that.uploadFile(file);
        }
      });
    },
    uploadFile(file) {
      var that = this;
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // 通过append向form对象添加数据
      param.append("chunk", "0"); // 添加form表单中其他数据
      axios.post(api.api.file.upload, param).then(response => {
        var rdata = response.data;
        if (rdata.code === 0) {
          that.img.urlPath = rdata.url;
          that.$emit("change", rdata.url);
          console.log(that.htmlid, rdata.url);
          this.$message({
            message: "图片上传成功",
            type: "success"
          });
        } else {
          this.$message.error("图片上传失败" + rdata.msg);
        }
      });
    },
    preview(file) {
      var read = new FileReader(); // 创建FileReader对像;
      read.readAsDataURL(file); // 调用readAsDataURL方法读取文件;
      let that = this;
      read.onload = function() {
        var url = read.result; // 拿到读取结果;
        var img = new Image();
        img.src = url;
        that.img.path = url;
      };
    }
  }
};
</script>
<style scoped>
.cfile {
  position: relative;
  border: solid 1px #ddd;
  width: 100px;
  height: 100px;
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
  opacity: 0;
}

.cfile .lo:hover {
  opacity: 0.3;
}

.c .lh {
  display: none;
}

.cfile .lt {
  height: 100px;
  width: 100px;
  font-size: 30px;
  text-align: center;
  color: #333;
  background: #f2f2f2;
  cursor: pointer;
  border: none;
}

.cfile .sf {
  display: none;
}

.cfile span {
  display: inline-block;
  height: 97px;
  width: 100px;
  font-size: 40px;
  line-height: 100px;
  text-align: center;
  color: #fff;
  background: #ddd;
  cursor: pointer;
}

.cfile span img {
  width: 100px;
  height: 100px;
}
</style>
