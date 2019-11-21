import {createAPI, createFormAPI} from '@/utils/request'
// var urls = 'goods'
// export const templateList = data => createAPI(`/${urls}/template/search/${data.page}/${data.size}`, 'get', data)

// export const templatesAll = () => createAPI(`/${urls}/template`, 'get')

// export const add = data => createAPI(`/${urls}/template`, 'post', data)

// export const update = data => createAPI(`/${urls}/template/${data.id}`, 'put', data)

// export const remove = data => createAPI(`/${urls}/template/${data.id}`, 'delete', data)

export const templateList = data => createAPI(`/template/search/${data.page}/${data.size}`, 'get', data)

export const templatesAll = () => createAPI(`/template`, 'get')

export const add = data => createAPI(`/template`, 'post', data)

export const update = data => createAPI(`/template/${data.id}`, 'put', data)

export const remove = data => createAPI(`/template/${data.id}`, 'delete', data)
