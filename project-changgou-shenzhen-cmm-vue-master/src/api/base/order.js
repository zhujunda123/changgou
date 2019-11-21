import {createAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/order/search`, 'get', data)
export const brand = data => createAPI(`/order/search`, 'get', data)
