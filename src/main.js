import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import utils from './lib/utils'
import VuePipeline from 'vue-pipeline'
import './lib/filter'
import Contextmenu from 'vue-contextmenujs'
import store from './store/index'

Vue.use(Contextmenu)
Vue.prototype.$utils = utils
Vue.use(ElementUI)
Vue.use(VuePipeline)

Vue.config.productionTip = false
Vue.directive('clickOnce', {
  inserted(el) {
    el.addEventListener('click', () => {
      el.classList.add('is-disabled')
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
        el.classList.remove('is-disabled')
      }, 2000)
    })
  },
})

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
