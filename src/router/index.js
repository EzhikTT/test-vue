/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import TableGenerator from '@/components/TableGenerator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TableGenerator',
      component: TableGenerator
    }
  ]
})
