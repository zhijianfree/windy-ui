import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import utils from './lib/utils'
import VuePipeline from 'vue-pipeline'
import './lib/filter'
import i18n from './assets/i18n/i18n'

Vue.prototype.$utils = utils
Vue.use(ElementUI)
Vue.use(VuePipeline)

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
