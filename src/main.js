import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)
Vue.config.productionTip = false
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

new Vue({
  render: h => h(App)
}).$mount('#app')
