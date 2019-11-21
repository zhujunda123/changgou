import {createAPI, createFormAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/${urls}/album/search/${data.page}/${data.size}`, 'get', data)

export const all = () => createAPI(`/${urls}/album`, 'get')

export const detail = data => createAPI(`/${urls}/album/${data.id}`, 'get', data)

export const add = data => createAPI(`/${urls}/album`, 'post', data)

export const update = data => createAPI(`/${urls}/album/${data.id}`, 'put', data)

export const remove = data => createAPI(`/${urls}/album/${data.id}`, 'delete', data)
