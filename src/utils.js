//深度克隆
export function deepCopy(target) {
    if (typeof target === 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] === 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }
        return result
    }
    return target
}

//生成唯一的ID
export function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
}