<template>
  <el-form ref="form" :model="form" label-width="100px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select value placeholder="请选择品牌">
        <el-option label="A" :value="11"></el-option>
        <el-option label="C" :value="22"></el-option>
        <el-option label="B" :value="33"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" rows="4" placeholder="SPU描述"></el-input>
    </el-form-item>
    <!-- 图片 -->
    <el-form-item label="SPU图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </el-form-item>
    <!-- 表格 -->
    <el-form-item label="SPU描述">
      <el-select value placeholder="请选择">
        <el-option label="A" :value="11"></el-option>
        <el-option label="C" :value="22"></el-option>
        <el-option label="B" :value="33"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <el-table border style="margin-top:20px">
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="属性名"></el-table-column>
        <el-table-column label="属性值名称列表"></el-table-column>
        <el-table-column label="操作">
          <hint-button title="删除" type="danger" icon="el-icon-delete" size="mini"></hint-button>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label>
      <el-button type="primary">保存</el-button>
      <!-- 一般不用<el-button @click="$parent.$parent.isShowSpuForm=false">取消</el-button> -->
      <el-button @click="$emit('update:visible', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "SpuForm",
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        name: "",
        dialogImageUrl: "",
        dialogVisible: false
      }
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
