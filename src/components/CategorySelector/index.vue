<template>
  <el-form inline>
    <el-form-item label="一级分类">
      <el-select placeholder="请选择" v-model="category1Id" @change="handleCategory1Change" :disabled="disabled">
        <el-option :label="c1.name" :value="c1.id" v-for="c1 in category1List" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select placeholder="请选择" v-model="category2Id" @change="handleCategory2Change" :disabled="disabled">
        <el-option :label="c2.name" :value="c2.id" v-for="c2 in category2List" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select placeholder="请选择" v-model="category3Id" @change="handleCategory3Change" :disabled="disabled">
        <el-option :label="c3.name" :value="c3.id" v-for="c3 in category3List" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",

  data() {
    return {
      category1List: [], // 一级分类列表
      category2List: [], // 二级分类列表
      category3List: [], // 三级分类列表
      category1Id: "", // 选择的一级分类id
      category2Id: "", // 选择的二级分类id
      category3Id: "", // 选择的三级分类id
      disabled: false // 是否禁用select
    };
  },

  mounted() {
    this.getCategory1List();
  },

  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1();
      const category1List = result.data;
      this.category1List = category1List;
    },

    async handleCategory1Change(category1Id) {
      this.$emit("categoryChange", { categoryId: category1Id, level: 1 });
      this.category2Id = "";
      this.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      const result = await this.$API.category.getCategorys2(category1Id);
      this.category2List = result.data;
    },

    async handleCategory2Change(category2Id) {
      this.$emit("categoryChange", { categoryId: category2Id, level: 2 });
      this.category3List = [];
      this.category3Id = "";
      const result = await this.$API.category.getCategorys3(category2Id);
      this.category3List = result.data;
    },
    handleCategory3Change(category3Id) {
      this.$emit("categoryChange", { categoryId: category3Id, level: 3 });
    }
  }
};
</script>

<style>
</style>