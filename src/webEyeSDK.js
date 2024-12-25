import performance from "./performance";
import error from "./error";
import behavior from "./behavior";

import { setConfig } from './config'
import { lazyReportBatch } from "./report";

//针对 vue / react 的 收集
//在window上面定义
window.__webEyeSDK__ = {
    version: '0.0.1'
}

//针对Vue项目的错误处理
export function install(Vue, options) {
    if (__webEyeSDK__.vue) return//说明vue已经注册过了
    __webEyeSDK__.vue = true


    setConfig(options)

    const handler = Vue.config.errorHandler;
    //vue 项目中通过 Vue.config.errorHandler 捕获错误
    Vue.config.errorHandler = function (err, vm, info) {
        const reportData = {
            info,
            error: err.stack,
            subType: 'vue',
            type: 'error',
            startTime: window.performance.now(),
            pageUrl: window.location.href
        }
        console.log('vue 监控初始化', reportData)
        lazyReportBatch(reportData)
        if (handler) {
            handler.call(this, err, vm, info)
        }
    }
}

//针对React项目的错误处理
function errorBoundary(err, info) {
    if (__webEyeSDK__.react) return//说明react已经注册过了
    __webEyeSDK__.react = true
    //todo: 上报具体的错误信息
    const reportData = {
        error: err?.stack,
        info,
        subType: 'react',
        type: 'error',
        startTime: window.performance.now(),
        pageUrl: window.location.href
    }
    lazyReportBatch(reportData)
}

//初始化
/**
 * 初始化
 * @param { Object } options
 * @property {string} url 上传数据的url地址
 * @property {string} projectName 监控的项目名称
 * @property {number} batchSize 每次批量上传数据的数量
 * @property {boolean} isImageUpload 是否启用图片上传
 * 
*/
export function init(options) {
    setConfig(options)
    performance()
    error()
    behavior()
}

export default {
    install,
    errorBoundary,
    performance,
    error,
    behavior,
    init
}