import {createAPI, createFormAPI} from '@/utils/request'
var urls = ''
export const brandsAll = () => createAPI(`/brand`, 'get')  //未分页列表

export const brandList = params => createAPI(`/brand/search/${params.page}/${params.size}`, 'get', params.data) //列表
export const searchBrandList = params => createAPI(`/brand/search/${params.page}/${params.size}`, 'post', params) //列表

export const detail = data => createAPI(`/brand/${data.id}`, 'get', data)  //详情

export const add = data => createAPI(`/brand`, 'post', data) // 添加

export const update = data => createAPI(`/brand/${data.id}`, 'put', data)  // 修改

export const remove = data => createAPI(`/brand/${data.id}`, 'delete', data) //删除
