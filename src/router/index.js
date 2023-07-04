import Vue from 'vue'
import VueRouter from 'vue-router'
import TestCase from '../views/feature/test-case.vue'
import Feature from '../views/feature/feature.vue'
import Template from '../views/feature/template.vue'
import Task from '../views/feature/task-manage.vue'
import RecordDetail from '../views/feature/record-detail.vue'
import Service from '../views/service/service.vue'
import System from '../views/service/system.vue'
import Monitor from '../views/service/monitor.vue'
import Pipeline from '../views/pipeline/pipeline.vue'
import PipeAction from '../views/pipeline/action.vue'
import CodeChange from '../views/pipeline/codechange.vue'
import Test from '../views/pipeline/comp/pipeline-config.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'TestCase',
    component: TestCase,
  },
  {
    path: '/feature',
    name: 'Feature',
    component: Feature,
  },
  {
    path: '/template',
    name: 'Template',
    component: Template,
  },
  {
    path: '/task',
    name: 'Task',
    component: Task,
  },
  {
    path: '/record/detail',
    name: 'RecordDetail',
    component: RecordDetail,
  },
  {
    path: '/service',
    name: 'Service',
    component: Service,
  },
  {
    path: '/pipeline',
    name: 'Pipeline',
    component: Pipeline,
  },
  {
    path: '/code/change',
    name: 'CodeChange',
    component: CodeChange,
  },
  {
    path: '/pipe/action',
    name: 'PipeAction',
    component: PipeAction,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/system',
    name: 'System',
    component: System,
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: Monitor,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
