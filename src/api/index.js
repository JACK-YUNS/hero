/**
 * @file: index.
 * @intro: api请求索引.
 * @author: zzmhot.
 * @email: zzmhot@163.com.
 * @Date: 2017/5/8 15:31.
 * @Copyright(©) 2017 by zzmhot.
 *
 */

//导入模块
import * as api_file from './file'
import * as api_table from './table'
import * as api_user from './user'
import * as api_wechat from './wechat'
import * as api_qiniu from './qiniu'
import * as api_wisdom from './wisdom'
import * as api_knowledge from './knowledge'
import * as api_journal from './journal'
import * as api_record from './record'
import * as api_verbal from './verbal'
import * as api_feedback from './feedback'
import * as api_system from './system'
import * as api_theme from './theme'
import * as api_cloudDisk from './cloudDisk'

const apiObj = {
  api_file,
  api_table,
  api_user,
  api_wechat,
  api_qiniu,
  api_wisdom,
  api_knowledge,
  api_journal,
  api_record,
  api_verbal,
  api_feedback,
  api_system,
  api_theme,
  api_cloudDisk
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  //定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}
