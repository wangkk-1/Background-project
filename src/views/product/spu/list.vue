<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelector @categoryChange="handleCategoryChange" />
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm">
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" @click="isShowSpuForm=true">添加SPU</el-button>
        <!-- 列表 -->
        <el-table border :data="spuList" style="margin-top:10px">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <hint-button title="添加SKU" type="primary" icon="el-icon-plus" size="mini" />
              <hint-button title="修改SPU" type="primary" icon="el-icon-edit" size="mini" />
              <hint-button title="查看所有SKU" type="info" icon="el-icon-info" size="mini" />
              <hint-button title="删除SPU" type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center " :current-page="page" :page-sizes="[5,10,15]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getSpuList" @size-change="handleSizeChange"></el-pagination>
      </div>
      <SpuForm :visible.sync="isShowSpuForm" ></SpuForm>
      <!-- 本质<SpuForm @update:visible="isShowSpuForm=$event"></SpuForm> -->

      <SpuForm :visible.sync="isShowSpuForm"></SpuForm>

    </el-card>
  </div>
</template>

<script>
import  SpuForm from "../components/SpuForm"
import CategorySelector from "../../../components/CategorySelector";
// import { category } from '../../../api';
export default {
  name: "SpuList",
  data() {
    return {
      isShowSpuForm: false, // 显示/隐藏
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      total: 0,
      page: 1,
      limit: 5
    };
  },
  mounted() {
    // this.category1Id = 2
    // this.category2Id = 13
    // this.category3Id = 61
    // this.getSpuList(1)
  },
  methods: {
    // 异步获取数据
    async getSpuList(page = 1) {
      this.page = page
      const result = await this.$API.spu.getList( page, this.limit, this.category3Id)
      const { records, total } = result.data
      this.spuList = records
      this.total = total
    },
    // 分页器
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getSpuList()
    },
    // 三级分类
    handleCategoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = ""
        this.category3Id = ""
        this.spuList = []
        this.total = 0
        this.category1Id = categoryId
      } else if (level === 2) {
        this.category3Id = ""
        this.spuList = []
        this.total = 0
        this.category2Id = categoryId
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
  },
  components: {
    CategorySelector,
    SpuForm
  }
}
</script>
