import config from './config'
import { getCaches, addCache, clearCaches } from './cache'
import { generateId } from './utils'
//重新定义 xhr
export const originalProto = XMLHttpRequest.prototype
export const originalOpen = originalProto.open
export const originalSend = originalProto.send

//检测 sendBeacon是否支持
export function isSupportSendBeacon() {
    return 'sendBeacon' in navigator
}

//数据上报逻辑

export function report(data) {
    if (!config.url) {
        console.error('请设置上传 url 地址')
        return
    }
    const reportData = JSON.stringify({
        id: generateId(),
        data
    })

    //上报数据使用图片的方式
    if (config.isImageUpload) {
        console.log('使用图片方式上报数据')
        imgRequest(reportData)
    } else {
        //发送数据,优先使用 sendBeacon
        if (window.navigator.sendBeacon) {
            console.log('使用 sendBeacon 方式上报数据')
            beaconRequest(reportData)
        } else {
            console.log('使用 xhr 方式上报数据')
            xhrRequest(reportData)
        }
    }

}

//批量上报数据
export function lazyReportBatch(data) {
    addCache(data)
    const cachesData = getCaches()
    console.log('cachesData', cachesData)
    if (cachesData.length && cachesData.length > config.batchSize) {
        report(cachesData)
        clearCaches()
    }
}


//img 上报
export function imgRequest(data) {
    const img = new Image();
    //使用图片发送数据 http://127.0.0.1:8080/api?data=xxxxx
    img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}

//xhr上报
export function xhrRequest(data) {
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            const xhr = new XMLHttpRequest();
            originalOpen.call(xhr, 'post', config.url)
            originalSend.call(xhr, JSON.stringify(data))
        }, { timeout: 3000 })
    } else {
        setTimeout(() => {
            const xhr = new XMLHttpRequest();
            originalOpen.call(xhr, 'post', config.url)
            originalSend.call(xhr, JSON.stringify(data))
        })
    }
}




//sendBeacon 上报
export function beaconRequest(data) {
    // //浏览器空闲时发送数据
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            navigator.sendBeacon(config.url, data)
        }, {
            timeout: 3000 //最大延迟3s,3s内的空闲时间上报
        })
    } else {
        setTimeout(() => {
            navigator.sendBeacon(config.url, data)
        })
    }
}



