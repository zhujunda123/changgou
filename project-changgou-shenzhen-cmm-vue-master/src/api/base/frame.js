import {createAPI, createFormAPI} from '@/utils/request'
var urls = 'system'
export const login = data => createAPI(`/${urls}/admin/login`, 'post', data)
export const register = data => createAPI('/base/frame/register', 'post', data)
export const logout = data => createAPI('/base/frame/logout', 'post', data)
export const passwd = data => createAPI('/base/frame/passwd', 'post', data)
export const profile = data => createAPI('/frame/profile', 'post', data)
