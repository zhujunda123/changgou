import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import Layout from '@/module-dashboard/pages/layout'
import index from '@/module-dashboard/components/templates'

import {getToken} from '@/utils/auth'
import {hasPermissionPoint, hasPermission} from '@/utils/permission'
// console.log(888, getToken())
// 定义
const _import = require('./import_' + process.env.NODE_ENV) // 懒加载 导包
const whiteList = ['/login', '/authredirect'] // 白名单 无需跳转

// 配置
Vue.use(Router)
NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

/**
 * 基础路由
 * 
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
    path: '/login',
    component: _import('dashboard/pages/login'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('dashboard/pages/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('dashboard/pages/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('dashboard/pages/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    title: '首页',
    type: 'home', // 根据type区分不同模块（顶部导航）
    name: 'home', // 根据name区分不同子模块（左侧导航）
    menuShow: true,
    icon: 'iconHome'
  },
  {
    path: '/enterpriseManager',
    type: 'enterprise',
    name: 'enterprise',
    title: '商品',
    component: Layout,
    redirect: '/commodity/list',
    menuShow: true,
    icon: 'iconCommodity',
    children: [{
        path: '/commodityList',
        name: 'commodityList',
        // leaf: true, // 只有一个节点
        components: {
          default: index
        },
        title: '商品管理',
        iconCls: 'el-icon-menu',
        menuShow: true,
        children: [{
            path: '/commodity/list',
            component: _import('list/pages/basic-list'),
            name: '商品列表',
            menuShow: true
          },
          {
            path: '/commodity/add',
            component: _import('list/pages/basic-add'),
            name: '添加商品',
            menuShow: true
          },
          {
            path: '/commodity/examine',
            component: _import('list/pages/examine-list'),
            name: '商品审核',
            menuShow: true
          },
          {
            path: '/commodity/spu',
            component: _import('spu/pages/index'),
            name: '商品回收站',
            menuShow: true
          },
        ]
      },
      {
        path: '/commodityConfig',
        name: 'commodityConfig',
        // leaf: true, // 只有一个节点
        components: {
          default: index
        },
        title: '商品配置',
        iconCls: 'el-icon-menu',
        menuShow: true,
        children: [{
            path: '/commodity/category-list',
            component: _import('category/pages/list'),
            name: '商品分类',
            menuShow: true
          },
          {
            path: '/commodity/category-add',
            component: _import('category/pages/add'),
            name: '添加分类',
            menuShow: false
          },
          {
            path: '/commodity/template-list',
            component: _import('template/pages/list'),
            name: '规格参数',
            menuShow: true
          },
          {
            path: '/commodity/spec-list',
            component: _import('spec/pages/list'),
            name: '规格列表',
            menuShow: false
          },
          {
            path: '/commodity/spec-add',
            component: _import('spec/pages/add'),
            name: '添加规格',
            menuShow: false
          },
          {
            path: '/commodity/para-list',
            component: _import('para/pages/list'),
            name: '参数列表',
            menuShow: false
          },
          {
            path: '/commodity/para-add',
            component: _import('para/pages/add'),
            name: '添加参数',
            menuShow: false
          },
          {
            path: '/commodity/brand-list',
            component: _import('brand/pages/list'),
            name: '品牌管理',
            menuShow: true
          },
          {
            path: '/commodity/brand-add',
            component: _import('brand/pages/add'),
            name: '添加品牌',
            menuShow: false
          },
          {
            path: '/commodity/album-list',
            component: _import('album/pages/list'),
            name: '图片库管理',
            menuShow: true
          },
          {
            path: '/commodity/album-add',
            component: _import('album/pages/add'),
            name: '新建相册',
            menuShow: false
          },
          {
            path: '/commodity/album-detail',
            component: _import('album/pages/detail'),
            name: '相册详情',
            menuShow: false
          },
          {
            path: '/commodity/detail',
            component: _import('list/pages/basic-add'),
            name: '企业详情',
            menuShow: false
          }
        ]
      }
    ]
  },
  // {
  //   path: '/orderManager',
  //   type: 'enterprise',
  //   name: 'order',
  //   component: Layout,
  //   title: '订单',
  //   icon: 'iconOrder',
  //   redirect: '/order/list',
  //   menuShow: true,
  //   children: [{
  //     path: '/orderList',

  //     name: 'orderList',
  //     // leaf: true, // 只有一个节点
  //     components: {
  //       default: index
  //     },
  //     title: '订单管理',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/order/list',
  //         component: _import('order/pages/order-list'),
  //         name: '订单列表',
  //         menuShow: true
  //       },
  //       {
  //         path: '/order/batch',
  //         component: _import('order/pages/batch-list'),
  //         name: '批量发货',
  //         menuShow: false
  //       }
  //       // { path: '/order/list', component: _import('details/pages/seniorDetails'), name: '确认收货', menuShow: true },
  //       // { path: '/order/list', component: _import('details/pages/seniorDetails'), name: '到货提醒', menuShow: true },
  //       // { path: '/order/list', component: _import('details/pages/seniorDetails'), name: '订单设置', menuShow: true }
  //     ]
  //   }]
  // },
  // {
  //   path: '/order/printingOrder',
  //   component: _import('order/pages/printingOrder'),
  //   hidden: true
  // },
  // {
  //   path: '/order/orderDetails',
  //   component: _import('order/pages/order-details'),
  //   hidden: true
  // },
  // {
  //   path: '/stockManager',
  //   type: 'enterprise',
  //   name: 'stock',
  //   component: Layout,
  //   title: '库存',
  //   icon: 'iconStock',
  //   redirect: '/stock/list',
  //   menuShow: true,
  //   children: [{
  //     path: '/stockList',
  //     components: {
  //       default: index
  //     },
  //     name: 'stockList',
  //     title: '库存记录',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/stock/list',
  //         component: _import('stock/pages/stock-list'),
  //         name: '商品入库',
  //         menuShow: true
  //       },
  //       {
  //         path: '/stock/stockout',
  //         component: _import('stock/pages/stockout-list'),
  //         name: '商品出库',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // },
  // {

  //   path: '/userManager',
  //   type: 'enterprise',
  //   name: 'user',
  //   title: '用户',
  //   component: Layout,
  //   redirect: '/user/list',
  //   menuShow: true,
  //   icon: 'iconUser',

  //   children: [{
  //       path: '/userList',
  //       name: 'userList',
  //       // leaf: true, // 只有一个节点
  //       components: {
  //         default: index
  //       },
  //       title: '用户管理',
  //       iconCls: 'el-icon-menu',
  //       menuShow: true,
  //       children: [{
  //           path: '/user/list',
  //           component: _import('user/pages/user-list'),
  //           name: '用户列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/user/info',
  //           component: _import('user/pages/user-info'),
  //           name: '查看',
  //           menuShow: false
  //         }
  //         // {
  //         //   path: '/user/list',
  //         //   component: _import('details/pages/seniorDetails'),
  //         //   name: '会员等级设置',
  //         //   menuShow: true
  //         // }
  //       ]
  //     }
  //     // {
  //     //   path: '/growList',
  //     //   components: {
  //     //     default: index
  //     //   },
  //     //   name: 'growList',
  //     //   title: '成长值及匠币',
  //     //   iconCls: 'el-icon-menu',
  //     //   menuShow: true,
  //     //   children: [{
  //     //       path: '/grow/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '成长值及匠币查询',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/grow/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '任务奖励设置',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/grow/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '更多规则设置',
  //     //       menuShow: true
  //     //     }
  //     //   ]
  //     // }
  //   ]
  // },
  // {
  //   path: '/promotionManager',
  //   type: 'enterprise',
  //   name: 'promotion',
  //   component: Layout,
  //   title: '促销',
  //   icon: 'iconPromotion',
  //   redirect: '/promotion/list',
  //   menuShow: true,
  //   children: [{
  //       path: '/promotionList',
  //       components: {
  //         default: index
  //       },
  //       name: 'promotionList',
  //       title: '秒杀专区',
  //       iconCls: 'el-icon-menu', // 图标样式class
  //       menuShow: true,
  //       children: [{
  //           path: '/promotion/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '秒杀活动列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/promotion/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '时间段列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/promotion/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '秒杀提醒通知',
  //           menuShow: true
  //         }
  //       ]
  //     },
  //     {
  //       path: '/couponList',
  //       components: {
  //         default: index
  //       },
  //       name: 'couponList',
  //       title: '优惠券管理',
  //       iconCls: 'el-icon-menu', // 图标样式class
  //       menuShow: true,
  //       children: [{
  //           path: '/coupon/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '优惠券列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/coupon/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '添加优惠券',
  //           menuShow: true
  //         }
  //       ]
  //     },
  //     {
  //       path: '/activityList',
  //       components: {
  //         default: index
  //       },
  //       name: 'activityList',
  //       title: '活动管理',
  //       iconCls: 'el-icon-menu', // 图标样式class
  //       menuShow: true,
  //       children: [{
  //           path: '/activity/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '活动列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/activity/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '添加活动',
  //           menuShow: true
  //         }
  //       ]
  //     },
  //     {
  //       path: '/homeList',
  //       components: {
  //         default: index
  //       },
  //       name: 'homeList',
  //       title: '首页推荐',
  //       iconCls: 'el-icon-menu', // 图标样式class
  //       menuShow: true,
  //       children: [{
  //           path: '/home/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '品牌制造商',
  //           menuShow: true
  //         },
  //         {
  //           path: '/home/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '新鲜好物',
  //           menuShow: true
  //         },
  //         {
  //           path: '/home/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '人气推荐',
  //           menuShow: true
  //         },
  //         {
  //           path: '/home/list',
  //           component: _import('details/pages/seniorDetails'),
  //           name: '专题精选',
  //           menuShow: true
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {

  //   path: '/operateManager',
  //   type: 'enterprise',
  //   name: 'operate',
  //   title: '运营',
  //   component: Layout,
  //   redirect: '/spike/list',
  //   menuShow: true,
  //   icon: 'iconOperate',
  //   children: [{
  //       path: '/spikeList',
  //       name: 'spikeList',
  //       // leaf: true, // 只有一个节点
  //       components: {
  //         default: index
  //       },
  //       title: '用户管理',
  //       iconCls: 'el-icon-menu',
  //       menuShow: true,

  //       children: [{
  //           path: '/spike/list',
  //           component: _import('operate/pages/spike-list'),
  //           name: '秒杀活动列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/spike/operateset',
  //           component: _import('operate/pages/operate-set-list'),
  //           name: '时间段列表',
  //           menuShow: true
  //         },
  //         {
  //           path: '/spike/operate-list',
  //           component: _import('operate/pages/operate-list'),
  //           name: '商品列表',
  //           menuShow: false
  //         }
  //       ]
  //     }
  //     // {
  //     //   path: '/fullredList',
  //     //   components: {
  //     //     default: index
  //     //   },
  //     //   name: 'fullredList',
  //     //   title: '满减专区',
  //     //   iconCls: 'el-icon-menu', // 图标样式class
  //     //   menuShow: true,
  //     //   children: [{
  //     //       path: '/fullred/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '满减活动列表',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/fullred/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '添加满减活动',
  //     //       menuShow: true
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   path: '/operatecouList',
  //     //   components: {
  //     //     default: index
  //     //   },
  //     //   name: 'operatecouList',
  //     //   title: '优惠券管理',
  //     //   iconCls: 'el-icon-menu', // 图标样式class
  //     //   menuShow: true,
  //     //   children: [{
  //     //       path: '/operatecou/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '优惠券列表',
  //     //       menuShow: true
  //     //     },

  //     //     {
  //     //       path: '/operatecou/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '添加优惠券',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/operatecou/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '优惠券查询',
  //     //       menuShow: true
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   path: '/operateactivList',
  //     //   components: {
  //     //     default: index
  //     //   },
  //     //   name: 'operateactivList',
  //     //   title: '活动管理',
  //     //   iconCls: 'el-icon-menu', // 图标样式class
  //     //   menuShow: true,
  //     //   children: [{
  //     //       path: '/operateactiv/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '活动列表',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/operateactiv/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '添加活动',
  //     //       menuShow: true
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   path: '/advertList',
  //     //   components: {
  //     //     default: index
  //     //   },
  //     //   name: 'advertList',
  //     //   title: '广告管理',
  //     //   iconCls: 'el-icon-menu', // 图标样式class
  //     //   menuShow: true,
  //     //   children: [{
  //     //       path: '/advert/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '广告列表',
  //     //       menuShow: true
  //     //     },
  //     //     {
  //     //       path: '/advert/list',
  //     //       component: _import('details/pages/seniorDetails'),
  //     //       name: '添加广告',
  //     //       menuShow: true
  //     //     }
  //     //   ]
  //     // }
  //   ]
  // },

  // {
  //   path: '/contentManager',
  //   type: 'enterprise',
  //   name: 'content',
  //   component: Layout,
  //   title: '内容',
  //   icon: 'iconContent',
  //   redirect: '/special/list',
  //   menuShow: true,
  //   children: [{
  //     path: '/specialList',
  //     components: {
  //       default: index
  //     },
  //     name: 'specialList',
  //     title: '专题管理',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/special/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '专题列表',
  //         menuShow: true
  //       },
  //       {
  //         path: '/special/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '发布专题',
  //         menuShow: true
  //       },
  //       {
  //         path: '/special/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '分类管理',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // },
  // {
  //   path: '/statisticsManager',
  //   type: 'enterprise',
  //   name: 'statistics',
  //   component: Layout,
  //   title: '统计',
  //   icon: 'iconStatistics',
  //   redirect: '/statistics/transaction',
  //   menuShow: true,
  //   children: [{
  //     path: '/statisticsList',
  //     components: {
  //       default: index
  //     },
  //     name: 'statisticsList',
  //     title: '统计分析',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/statistics/transaction',
  //         component: _import('statistics/pages/statis-list'),
  //         name: '交易统计',
  //         menuShow: true
  //       },
  //       {
  //         path: '/statistics/flow',
  //         component: _import('statistics/pages/statis-list'),
  //         name: '流量统计',
  //         menuShow: true
  //       },
  //       {
  //         path: '/statistics/commodity',
  //         component: _import('statistics/pages/statis-list'),
  //         name: '商品统计',
  //         menuShow: true
  //       },
  //       {
  //         path: '/statistics/vip',
  //         component: _import('statistics/pages/statis-list'),
  //         name: '会员统计',
  //         menuShow: true
  //       },
  //       {
  //         path: '/statistics/search',
  //         component: _import('statistics/pages/statis-list'),
  //         name: '搜索统计',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // },
  // {
  //   path: '/financeManager',
  //   type: 'enterprise',
  //   name: 'finance',
  //   component: Layout,
  //   title: '财务',
  //   icon: 'iconFinance',
  //   redirect: '/report/synthesize',
  //   menuShow: true,
  //   children: [{
  //     path: '/reportformList',
  //     components: {
  //       default: index
  //     },
  //     name: 'reportform',
  //     title: '财务报表',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/report/synthesize',
  //         component: _import('finance/pages/synthesize-list'),
  //         name: '综合统计',
  //         menuShow: true
  //       },
  //       {
  //         path: '/report/sale',
  //         component: _import('finance/pages/synthesize-list'),
  //         name: '销售统计',
  //         menuShow: true
  //       }
  //     ]
  //   }, {
  //     path: '/reconciliationList',
  //     components: {
  //       default: index
  //     },
  //     name: 'reconciliation',
  //     title: '对账管理',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/reconciliation/list',
  //         component: _import('finance/pages/synthesize-list'),
  //         name: '对账列表',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // },
  // {
  //   path: '/setingManager',
  //   type: 'enterprise',
  //   name: 'seting',
  //   component: Layout,
  //   title: '财务',
  //   icon: 'iconFinance',
  //   redirect: '/seting/list',
  //   menuShow: true,
  //   children: [{
  //     path: '/setingList',
  //     components: {
  //       default: index
  //     },
  //     name: 'seting',
  //     title: '财务报表',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/seting/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '平台信息',
  //         menuShow: true
  //       },
  //       {
  //         path: '/seting/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '基本设置',
  //         menuShow: true
  //       },
  //       {
  //         path: '/seting/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '消息提醒',
  //         menuShow: true
  //       },
  //       {
  //         path: '/seting/list',
  //         component: _import('details/pages/seniorDetails'),
  //         name: '验证码设置',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // },
  // {
  //   path: '/setManager',
  //   type: 'enterprise',
  //   name: 'set',
  //   component: Layout,
  //   title: '设置',
  //   icon: 'iconJurisdiction',
  //   redirect: '/set/platformInfo',
  //   menuShow: true,
  //   children: [{
  //     path: '/set',
  //     components: {
  //       default: index
  //     },
  //     name: 'set',
  //     title: '平台设置',
  //     iconCls: 'el-icon-menu', // 图标样式class
  //     menuShow: true,
  //     children: [{
  //         path: '/set/platformInfo',
  //         component: _import('set/pages/platform-info'),
  //         name: '平台信息',
  //         menuShow: true
  //       },
  //       {
  //         path: '/set/basicset',
  //         component: _import('set/pages/platform-info'),
  //         name: '基本设置',
  //         menuShow: true
  //       },
  //       {
  //         path: '/set/messagereminder',
  //         component: _import('set/pages/platform-info'),
  //         name: '消息提醒',
  //         menuShow: true
  //       },
  //       {
  //         path: '/set/codeset',
  //         component: _import('set/pages/platform-info'),
  //         name: '验证码设置',
  //         menuShow: true
  //       }
  //     ]
  //   }]
  // }

]

/**
 * 配置路由
 **/
let router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

// router.beforeEach((to, from, next) => {
//   NProgress.start() // start progress bar
//   if (getToken()) {
//     // determine if there has token
//     /* has token */

//     if (to.path === '/login') {
//       next({path: '/'})
//       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//     } else {

//       if (store.getters.roles.length === 0) {
//         // 判断当前用户是否已拉取完user_info信息
//         store
//           .dispatch('GetUserInfo')
//           .then(res => {
//             // 拉取user_info
//             const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
//             store.dispatch('GenerateRoutes', {roles}).then(() => {
//               // 根据roles权限生成可访问的路由表
//               router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//               next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//             })
//           })
//           .catch(() => {
//             store.dispatch('FedLogOut').then(() => {
//               Message.error('验证失败, 请重新登录')
//               next({path: '/login'})
//             })
//           })
//       } else {
//         next()
//       }
//     }
//   } else {
//     /* has no token */
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 在免登录白名单，直接进入
//       next()
//     } else {
//       next('/login') // 否则全部重定向到登录页
//       NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
//     }
//   }
// })

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * 导出 基础路由
 **/
export default router

/**
 * 导出 业务路由
 **/
export let asyncRouterMap = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]
