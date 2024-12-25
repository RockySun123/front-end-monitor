
import { lazyReportBatch } from "../report";
// LCP页面中最大的可见内容（通常是图像，视频货块级文本），开始渲染并完成绘制的时间
// LCP 直接影响用户感知到页面内容加载的速度。一个较早的LCP 表示主要内容更快加载完毕

// 影响SEO：LCP 是一个重要的指标，它反映了网站在搜索引擎中的排名。一个较早的 LCP 值可以表明该页面加载速度更快，从而提升其在搜索结果中的可见性
export default function observerLCP() {
    const entryHandler = (list) => {
        if (observer) {
            observer.disconnect()
        }
        for (const entry of list.getEntries()) {
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
    // 统计和计算FLP的时间
    const observer = new PerformanceObserver(entryHandler)
    //buffered :true, 确保观察到所有 paint 事件
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
}