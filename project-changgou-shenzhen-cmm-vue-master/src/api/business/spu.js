import {createAPI, createFormAPI} from '@/utils/request'
// var urls = 'goods'
// export const list = data => createAPI(`/${urls}/spu/search/${data.page}/${data.size}`, 'get', data)

// export const restore = data => createAPI(`/${urls}/spu/restore/${data.id}`, 'put', data)

// export const remove = data => createAPI(`/${urls}/spu/${data.id}`, 'delete', data)

export const list = data => createAPI(`/spu/search/${data.page}/${data.size}`, 'get', data)

export const restore = data => createAPI(`/spu/restore/${data.id}`, 'put', data)

export const remove = data => createAPI(`/spu/${data.id}`, 'delete', data)
