import Vue from 'vue'
import VueRouter from 'vue-router'
import notfound from '@/views/notfound'
import calendar from '@/views/main'
import welcome from '@/views/welcome'
import oauth2View from '@/views/oauth2View'

Vue.use(VueRouter)

const routes = [
  {
    path: '/oauth2',
    name: 'oauth2',
    component: oauth2View
  },
  {
    path: '/dcalendar',
    name: 'dcalendar',
    component: calendar
  },
  {
    path: '/',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/login',
    name: 'root',
    component: welcome
  },
  {
    path: '*',
    name: 'notfound',
    component: notfound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URqL,
  routes
})

export default router
