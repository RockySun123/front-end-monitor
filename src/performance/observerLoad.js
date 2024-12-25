import { lazyReportBatch } from "../report"
// 统计页面加载时间 load
export default function observerLoad() {
    window.addEventListener('pageshow', function (event) {
        requestAnimationFrame(() => {
            ['load'].forEach((type) => {
                const reportData = {
                    type: 'performance',
                    subType: type,
                    pageUrl: window.location.href,
                    startTime: performance.now() - event.timeStamp
                }
                lazyReportBatch(reportData)
            })
        }, true)
    })
}