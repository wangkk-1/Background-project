// 品牌相关
import request from '@/utils/request'
const api_name = '/admin/product/baseTrademark'
export default {
  // 获取分类列表
  getList(category1Id, category2Id, category3Id) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 获取指定属性ID的所有属性值列表
  getValueList(attId) {
    return request.get(`/admin/product/getAttrValueList/${attrId}`)
  },
  // 添加或者更新属性
  save(attrInfo) {
    return request.post('/admin/product/saveAttrInfo', attrInfo)
  },
  // 删除指定ID的属性
  remove(id) {
    return request.delete(`/admin/product/deleteAttr/${id}`)
  }
}
