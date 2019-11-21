import {createAPI, createFormAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/${urls}/spec/search/${data.page}/${data.size}`, 'get', data)

export const detail = data => createAPI(`/${urls}/spec/${data.id}`, 'get', data)

export const add = data => createAPI(`/${urls}/spec`, 'post', data)

export const update = data => createAPI(`/${urls}/spec/${data.id}`, 'put', data)

export const remove = data => createAPI(`/${urls}/spec/${data.id}`, 'delete', data)
