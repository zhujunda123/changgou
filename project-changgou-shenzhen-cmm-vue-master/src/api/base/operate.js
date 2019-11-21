import {createAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/${urls}/spu/search/${data.page}/${data.pagesize}`, 'get', data)
export const addlist = data => createAPI(`/${urls}/sku/findAll.do/${data.page}/${data.pagesize}`, 'get', data)
export const listset = data => createAPI(`/${urls}/spu/search`, 'get', data)
export const remove = data => createAPI(`/${urls}/itemDetailSeckill/delete.do/${data.id}`, 'delect', data)
export const saveData = data => createAPI(`/${urls}/itemDetailSeckill/update.do/${data.id}`, 'post', data)
export const addRow = data => createAPI(`/${urls}/itemDetailSeckill/add.do/${data.id}`, 'post', data)
export const deleRow = data => createAPI(`/${urls}/itemDetailSeckill/delete.do/${data.id}`, 'post', data)
export const saveNumber = data => createAPI(`/${urls}/itemDetailSeckill/delete.do/${data.id}`, 'post', data)