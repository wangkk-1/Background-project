<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加</el-button>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="trademarks" border style="margin:30px 0">
      <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌"></el-table-column>
      <el-table-column label="Logo">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="width:120px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="warning" @click="showUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        style="text-align:center "
        :current-page="page"
        :page-sizes="[3,6,9]"
        :page-size="limit"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getTrademarks"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <!-- 添加对话框 -->
    <!--
          action : 地址  可能存在跨域 /dev-api/admin/product/fileUpload
          :show-file-list : 指定是否显示上传图片的列表 false 只显示一张
          :on-success : 用来指定上传成功时的回调函数
          :before-upload : 在准备发上传请求前调用 如果返回 false 不发请求
    -->
    <el-dialog :title="form.id?'修改品牌' : '添加品牌'" :visible.sync="isShowDialog">
      <el-form :model="form" :rules="rules" ref="ruleForm" style="width:80%">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过50K</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "Treademark",
  data() {
    return {
      trademarks: [], // 当前页的品牌列表
      total: 0, // 总数量
      page: 1, // 当前页码
      limit: 3, // 每一页数量
      isShowDialog: false, // 是否显示添加的对话框
      dialogFormVisible: false,
      form: {
        // 用来收集添加品牌的数据
        tmName: "",
        logoUrl: ""
      },
      loading: false,
      // 表单验证要求
      rules: {
        tmName: [
          { required: true, message: "请输入名称" }, // trigger: "change" 触发的时机  默认值 可不写 输入过程只能够触发检查
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符之间",
            trigger: "blur"
          } // 触发的时机是失去焦点
        ],
        logoUrl: [{ required: true, message: "LOGO必须指定" }]
      }
    };
  },
  mounted() {
    this.getTrademarks();
  },
  methods: {
    // 获取指定页码的列表数据显示
    async getTrademarks(page = 1) {
      this.page = page;
      this.loading = true;
      // 发请求
      const result = await this.$API.trademark.getList(page, this.limit);
      this.loading = false;
      if (result.code === 200) {
        const { records, total } = result.data;
        this.trademarks = records;
        this.total = total;
      } else {
        this.$message({
          type: "warning",
          Message: "获取分页列表失败"
        });
      }
    },

    // 分页器中
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getTrademarks();
    },

    // 显示添加的界面
    showAdd() {
      this.form = {
        tmName: "",
        logoUrl: ""
      };
      this.isShowDialog = true
      // 清除表单验证提示信息
      this.$nextTick(() => {
        this.$refs.ruleFrom.clearValidate()
      })
    },

    // 显示修改界面
    showUpdate(trademark) {
      this.form = { ...trademark };
      this.isShowDialog = true;
    },

    // 添加或者更新的请求
    addOrUpdate() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          // 准备数据
          const trademark = this.form;
          let result;
          // 提交请求
          if (trademark.id) {
            // 更新
            result = await this.$API.trademark.update(trademark);
          } else {
            // 添加
            result = await this.$API.trademark.add(trademark);
          }
          // 成功或者失败
          if (result.code === 200) {
            this.$message.success(`${trademark.id ? "更新" : "添加"}成功!`);
            this.isShowDialog = false;
            // 重新获取列表显示   修改为当前页   添加为第一页
            this.getTrademarks(trademark.id ? this.page : 1);
          } else {
            this.$message.success(`${trademark.id ? "更新" : "添加"}成功!`);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 删除指定的品牌
    remove(trademark) {
      this.$confirm(`确定删除 ${trademark.tmName} 吗?`, "提示", {
        type: "warning"
      })
        .then(async () => {
          // 发删除品牌的请求
          const result = await this.$API.trademark.remove(trademark.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 显示那一页  当前页 / 上一页
            this.getTrademarks(
              this.trademarks.length === 1 && this.page > 1
                ? this.page - 1
                : this.page
            );
          } else {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加品牌的添加图片
    // res 上传请求返回的响应体数据对象
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // 保存请求返回的图片URL数据
      this.form.logoUrl = res.data;
    },
    /* 对图片的要求   大小  类型 */
    beforeAvatarUpload(file) {
      // const isJPGOrPNG = file.type === "image/jpeg" || file.type === "image/png";
      const isJPGOrPNG = ["image/jpeg", "image/png"].indexOf(file.type) >= 0;
      const isLt50K = file.size / 1024 < 50;
      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt50K) {
        this.$message.error("上传头像图片大小不能超过 50K!");
      }
      return isJPGOrPNG && isLt50K;
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>