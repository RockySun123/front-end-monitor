import { lazyReportBatch } from "../report";

//FCP -- 页面首次渲染 文本、图像（包括北背景图）、SVG等“有意义内容”的时间
export default function observerFCP() {
    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {//FP
                observer.disconnect();//取消监听
                const json = entry.toJSON();

                //上报数据
                const reportData = {
                    ...json,
                    type: 'performance',
                    subType: entry.name,
                    pageUrl: window.location.href //当前页面的路径--哪个页面的监控
                }
                // console.log(reportData)
                //发送数据  todo
                lazyReportBatch(reportData)
            }
        }
    }
    // 统计和计算FCP的时间
    const observer = new PerformanceObserver(entryHandler)
    //buffered :true, 确保观察到所有 paint 事件
    observer.observe({ type: 'paint', buffered: true })
}