<template>
  <div>
    <el-card>
      <CategorySelector ref="cs" @categoryChange="handleCategoryChange" />
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button  type="primary" icon="el-icon-plus" @click="showAdd" :disabled="!category3Id">添加属性值</el-button>
        <el-table v-loading="loading" :data="attrs" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>

          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag style="margin-right:10px" type="success" v-for="value in row.attrValueList" :key="value.id">{{value.valueName}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="300">
            <template slot-scope="{row,$index}">
              <hint-button title="修改属性" type="primary" icon="el-icon-edit" size="main" @click="showUpdate(row)"></hint-button>
              <hint-button title="删除属性" type="primary" icon="el-icon-delete" size="main" @click="addRemove(row.id)"></hint-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form inline>
          <el-form-item label="属性名">
            <el-input v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attr.attrName">添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>

        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input :ref="$index" v-if="row.edit" v-model="row.valueName" @blur="toList(row)" @keyup.enter.native="toList(row)" placeholder="请输入名称"></el-input>
              <span style="display:inline-block;  width: 100%" v-else @click="toEdit(row, $index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`确定要删除 ${row.valueName} 吗?`" @onConfirm="attr.attrValueList.splice($index,1)">
                <hint-button slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini" ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <el-button type="primary" :disabled="!attr.attrName" @click="preservation">保存</el-button>
        </template>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "AttrList",

  data() {
    return {
      category1Id: null, // 一级分类ID
      category2Id: null, // 二级分类ID
      category3Id: null, // 三级分类ID
      loading: false,
      attrs: [], // 属性列表
      isShowList: true,
      attr: {
        attrName: "", // 属性名称
        attrValueList: [], // 属性值列表
        categoryId: this.category3Id, // 当前第三级分类Id
        categoryLevel: 3 // 分类的级别
      }
    };
  },

  mounted() {
  },
  watch: {
    isShowList(value) {
      this.$refs.cs.disabled = !value
    }
  },
  methods: {
    // 显示修改界面
    showUpdate(attr) {
      this.attr = cloneDeep(attr) // 深拷贝
      // this.attr = { ...attr };  // 浅拷贝
      this.isShowList = false
    },

    // 分类ID发生改变的监听回调
    handleCategoryChange({ categoryId, level }) {
      if (level === 1) {
        // 重置二级与三级分类的数据
        this.category2Id = null;
        this.category3Id = null;
        this.attrs = []
        this.category1Id = categoryId;
      } else if (level === 2) {
        // 重置三级分类的数据
        this.category3Id = null;
        this.attrs = []

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 只有当选择了三级的分类ID, 才去请求获取属性列表
        this.getAttrs();
      }
    },

    // 异步获取属性列表
    async getAttrs() {
      this.loading = true;
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrs = result.data;
      this.loading = false;
    },

    // 添加属性
    showAdd() {
      this.attr = {
        attrName: '', // 属性名
        attrValueList: [], // 属性值列表
        categoryId: this.category3Id, // 当前第3级分类ID
        categoryLevel: 3, // 分类级别
      }
      this.isShowList = false;
    },

    // 添加属性值
    addAttrValue() {
      // 创建一个
      const attrValue = {
        attrId: this.attr.id, // 当前要修改的属性ID
        valueName: "", // 属性值名称
        edit: true  // 编辑模式
      };
      // 添加到数组
      
      this.attr.attrValueList.push(attrValue);
      
      // 最后一个新的输入框自动获得焦点
      this.$nextTick(() => this.$refs[this.attr.attrValueList.length - 1].focus())
    },

    // 编辑模式变为查看模式
    toList(attrValue) {
      if (attrValue.valueName.trim() === '') {
        return
      } 
      const isRepeat = this.attr.attrValueList.filter(value => value.valueName === attrValue.valueName).length === 2
      
      if (isRepeat) {
        this.$message.warning('属性名称不能重复')
        attrValue.valueName = ""
        return
      }
      attrValue.edit = false
    },

    // 查看模式变为编辑模式
    toEdit(attrValue, index) {
      if (attrValue.hasOwnProperty('edit')) {
        attrValue.edit = true
      } else {
        this.$set(attrValue, 'edit', true)
      }
      this.$nextTick(()=> this.$refs[index].focus())
    },

    // 删除属性
    addRemove(id) {
      this.$confirm('确定要删除该属性么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.attr.remove(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getAttrs()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });  
        this.getAttrs()    
      });
    },

    // 保存属性
    async preservation() {
      const attr = this.attr
      this.$delete(this.attr, 'edit')
      attr.attrValueList = attr.attrValueList.filter(attrValue=>{
        if (attrValue.valueName) {
          return true
        }
        return false
      })
      if (attr.attrValueList.length === 0) {
        this.$message.warning('至少指定一个属性值的名称')
        return
      }
      const result = await this.$API.attr.save(attr)
      if (result.code === 200) {
        this.$message({
          type: "success",
          message: "保存成功!"
        })
      } else {
        this.$message({
          type: "error",
          message: "保存失败!"
        })
      }
      this.isShowList = true
      this.getAttrs()
    }
  }
};
</script>
<style >
</style>
