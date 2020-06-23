// 品牌相关
import request from '@/utils/request'
const api_name = '/admin/product/baseTrademark'
export default {

  // 获取品牌分页列表
  // 获取所有品牌列表
  getList(page, limit) {
    if (page && limit) {
      return request.get(`${api_name}/${page}/${limit}`)
    }
    return request.get(`${api_name}/getTrademarkList`)
  },

  // 根据ID获取品牌
  getById(id) {
    return request.get(`${api_name}/get/${id}`)
  },

  // 删除指定id的品牌
  remove(id) {
    return request.delete(`${api_name}/remove/${id}`)
  },

  // 添加品牌
  // trademark没有ID的
  /* add({tmName,logoUrl}){
    return request.post(`${api_name}/save`,{tmName,logoUrl})
  }, */
  add(trademark) {
    return request.post(`${api_name}/save`, trademark)
  },

  // 更新品牌
  // trademark有ID的
  update(trademark) {
    return request.post(`${api_name}/uadate`, trademark)
  }
}
