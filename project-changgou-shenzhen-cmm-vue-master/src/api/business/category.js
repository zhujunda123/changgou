import {createAPI, createFormAPI} from '@/utils/request'
// var urls = 'goods'
// export const categoryList = data => createAPI(`/${urls}/category/search`, 'get', data)

// export const categorysAll = () => createAPI(`/${urls}/category`, 'get')

// export const detail = data => createAPI(`/${urls}/category/${data.id}`, 'get', data)

// export const add = data => createAPI(`/${urls}/category`, 'post', data)

// export const update = data => createAPI(`/${urls}/category/${data.id}`, 'put', data)

// export const remove = data => createAPI(`/${urls}/category/${data.id}`, 'delete', data)

export const categoryList = data => createAPI(`/category/search`, 'get', data)

export const categorysAll = () => createAPI(`/category`, 'get')

export const detail = data => createAPI(`/category/${data.id}`, 'get', data)

export const add = data => createAPI(`/category`, 'post', data)

export const update = data => createAPI(`/category/${data.id}`, 'put', data)

export const remove = data => createAPI(`/category/${data.id}`, 'delete', data)
