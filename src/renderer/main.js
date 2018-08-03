import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'
import router from './router'
import store from './store'

import $ from 'jquery'
import 'font-awesome/css/font-awesome.css'
import {Button, message, Steps, Input , Form, Icon, Select, Spin, Alert, Modal, Slider,
  Row, Col, InputNumber, Layout, Menu, Breadcrumb, Checkbox} from 'vue-antd-ui'

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

import VueI18n from 'vue-i18n'
import LangStorage from '../core/lang'
import zh from '../common/lang/zh'
import en from '../common/lang/en'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: LangStorage.getLang('en'),  // 语言标识
  messages: {
    'zh': zh,
    'en': en
  }
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueAxios, axios)

//vue-antd-ui
Vue.component(Button.name, Button)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Icon.name, Icon)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Spin.name, Spin)
Vue.component(Alert.name, Alert)
Vue.component(Input.Search.name, Input.Search)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Modal.name, Modal)
Vue.component(Slider.name, Slider)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Footer.name, Layout.Footer)
Vue.component(Layout.Sider.name, Layout.Sider)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Menu.SubMenu.name, Menu.SubMenu)
Vue.component(Menu.Divider.name, Menu.Divider)
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
Vue.component(Checkbox.name, Checkbox)
Vue.prototype.$message = message
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
