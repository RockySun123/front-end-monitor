import { lazyReportBatch } from "../report";
// FP -- 浏览器在屏幕上渲染第一个像素的时间，（背景颜色，边框显示，页面中非内容元素）
// 用户输入url 到页面展示的时间

export default function observerPaint() {

    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {//FP
                observer.disconnect();//取消监听
                const json = entry.toJSON();
                // {
                //     duration: 0,
                //     entryType: "paint",
                //     nam: "first-paint",
                //     startTime: 1095.800000011921, 就是首页白屏时间
                // }

                //上报数据
                const reportData = {
                    ...json,
                    type: 'performance',
                    subType: entry.name,
                    pageUrl: window.location.href //当前页面的路径--哪个页面的监控
                }
                //发送数据  todo
                lazyReportBatch(reportData)
            }
        }
    }
    // 统计和计算FP的时间
    const observer = new PerformanceObserver(entryHandler)
    //buffered :true, 确保观察到所有 paint 事件
    observer.observe({ type: 'paint', buffered: true })
}