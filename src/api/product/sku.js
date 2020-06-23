// 包含sku相关接口
import request from '@/utils/request'
export default {
  // 下架SKU GET /admin/product/cancelSale/{skuId}
  offGoods(skuId) {
    request.get(`/admin/product/cancelSale/${skuId}`)
  },
  // 删除指定id的sku DELETE /admin/product/deleteSku/{skuId}
  remove(skuId) {
    request.delete(`/admin/product/deleteSku/${skuId}`)
  },
  // 根据指定的SPU的id查询所有对应的SKU的列表 GET /admin/product/findBySpuId/{spuId}
  queryList(spuId) {
    request.get(`/admin/product/findBySpuId/${spuId}`)
  },
  // 根据SKU的id查询SKU的详细信息  GET /admin/product/getSkuById/{skuId}
  queryInformation(skuId) {
    request.get(`/admin/product/getSkuById/${skuId}`)
  },
  // 获取SKU的分页列表  GET /admin/product/list/{page}/{limit}
  getList(page, limit) {
    request.get(`/admin/product/list/${page}/${limit}`)
  },
  // 上架SKU  GET /admin/product/onSale/{skuId}
  listingGoods(skuId) {
    request.get(`/admin/product/onSale/${skuId}`)
  },
  // 保存 POST /admin/product/saveSkuInfo
  saveItem() {
    request.post(`/admin/product/saveSkuInfo`)
  },
  // 保存 POST /admin/product/updateSkuInfo
  saveItem() {
    request.post(`/admin/product/updateSkuInfo`)
  },
  // 获取指定SPU的id对应的图片列表  GET /admin/product/spuImageList/{spuId}
  getPictureList(spuId) {
    request.get(`/admin/product/spuImageList/${spuId}`)
  },
  // 获取指定SPU的id对应的销售属性列表 GET /admin/product/spuSaleAttrList/{spuId}
  getSalesList(spuId) {
    request.get(`/admin/product/spuSaleAttrList/${spuId}`)
  }
}
