import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'
import router from './router'
import store from './store'


import 'font-awesome/css/font-awesome.css'
import {Button, message, Steps, Input ,Form, Icon, Select, Spin, Alert, Modal, Slider,Radio, Pagination,Switch, DatePicker, TimePicker,
  Row, Col, InputNumber, Layout, Menu, Breadcrumb, Checkbox, Tooltip, Table, Dropdown, Card, Tabs} from 'ant-design-vue'

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

import i18n from './lang'
import VeeValidate from 'vee-validate'
import { VALIDATE_DICTIONARY } from './core/consts'
import validationMessages_en from 'vee-validate/dist/locale/en';
import validationMessages_zh from 'vee-validate/dist/locale/zh_CN';

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
      en: Object.assign({},validationMessages_en, VALIDATE_DICTIONARY.en),
      zh: Object.assign({},validationMessages_zh, VALIDATE_DICTIONARY.zh)
  }
})
import service from './core/utils'
Vue.prototype.httpService = service;

import { VOTE_ROLE } from './core/consts'
const mixin = {
    data () {
        return {
            VOTE_ROLE: VOTE_ROLE
        }
    }
}
Vue.mixin(mixin)


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueAxios, axios)


Vue.component(Button.name, Button)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Input.name, Input)
Vue.component(Input.TextArea.name, Input.TextArea)
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
Vue.component(Radio.name, Radio)
Vue.component(Radio.Group.name, Radio.Group)
Vue.component(Radio.Button.name, Radio.Button)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Table.name, Table)
Vue.component(Dropdown.name, Dropdown)
Vue.component(Pagination.name, Pagination)
Vue.component(Switch.name, Switch)
Vue.component(Card.name, Card)
Vue.component(DatePicker.name, DatePicker)
Vue.component(TimePicker.name, TimePicker)
Vue.use(Tabs)

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success
Vue.prototype.$info = Modal.info

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
