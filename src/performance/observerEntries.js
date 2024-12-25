//统计所有静态资源的时间
import { lazyReportBatch } from '../report'

export default function observerEntries() {
    if (document.readyState === 'complete') {//页面加载完成后调用
        observerEvent()
    } else {
        const onLoad = () => {
            observerEvent()//页面加载完成后调用
            window.removeEventListener('load', onLoad, true)
        }
        window.addEventListener(
            'load',
            onLoad,
            true//捕获阶段就可以了，没必要冒泡
        )
    }
}
export function observerEvent() {
    console.log('observerEvent')
    const entryHandler = (list) => {
        const data = list.getEntries()
        for (const entry of data) {
            if (observer) {
                observer.disconnect()
            }

            const reportData = {
                name: entry.name,// 资源名称
                type: 'performance',// 类型
                subType: entry.entryType,//子类型
                sourceType: entry.initiatorType,//资源类型
                duration: entry.duration,//加载时间
                dns: entry.domainLookupEnd - entry.domainLookupStart,//dns解析时间
                tcp: entry.connectEnd - entry.connectStart,// tcp 链接时间
                redirect: entry.redirectEnd - entry.redirectStart,//重定向时间
                ttfb: entry.responseStart,//ttfb -- 服务器响应时间 -- 接收到首字节的时间
                protocol: entry.nextHopProtocol,// 请求协议
                responseBodySize: entry.encodedBodySize,// 响应内容大小，可能为0，从缓存中取
                responseHeaderSize: entry.transferSize - entry.encodedBodySize,//响应头大小
                resourceSize: entry.decodedBodySize,//资源解压后的大小，可能为0，从缓存中取
                transferSize: entry.transferSize,//真实请求内容大小 可能为0，从缓存中取
                startTime: performance.now()

            }
            lazyReportBatch(reportData)
        }
    }
    let observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: 'resource', buffered: true });
}