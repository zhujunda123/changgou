import {createAPI, createFormAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/${urls}/para/search/1/10`, 'get', data)

export const detail = data => createAPI(`/${urls}/para/${data.id}`, 'get', data)

export const add = data => createAPI(`/${urls}/para`, 'post', data)

export const update = data => createAPI(`/${urls}/para/${data.id}`, 'put', data)

export const remove = data => createAPI(`/${urls}/para/${data.id}`, 'delete', data)
