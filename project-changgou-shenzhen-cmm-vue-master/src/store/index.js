import Vue from 'vue'
import Vuex from 'vuex'
// import app from '@/module-dashboard/store/app'
// import errorLog from '@/module-dashboard/store/errorLog'
// import permission from '@/module-dashboard/store/permission'
// import tagsView from '@/module-dashboard/store/tagsView'
// import user from '@/module-dashboard/store/user'
import getters from './getters'

Vue.use(Vuex)
const state = {
  collapsed: false,
  topNavState: 'home',
  leftNavState: 'home'
}
for (var item in state) {
   localStorage.getItem(item)? state[item] = JSON.parse(localStorage.getItem(item)): false
}
const store = new Vuex.Store({
  state,
  getters
})

// const store = new Vuex.Store({
//   modules: {
//     app,
//     errorLog,
//     permission,
//     tagsView,
//     user
//   },
//   getters
// })

export default store
