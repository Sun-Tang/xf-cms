export function localGet(key) {
    const value = window.localStorage.getItem(key);
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
        return value;
    }
}

export function localSet(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function localRemove(key) {
    window.localStorage.removeItem(key);
}
// 格式化时间
export const formatTime = function formatTime(time, temp = "{0}年{1}月{2}日") {
    if (typeof time !== "string") throw new TypeError("time is not a string");
    if (typeof temp !== "string") throw new TypeError("temp is not a string");
    let arr = time.match(/\d+/g);
    return temp.replace(/\{(\d+)\}/g, (_, $1) => {
        let item = arr[$1] || "00";
        if (item.length < 2) item = "0" + item;
        return item;
    });
};

export const pathMap = {
    index: "首页",
    login: "登录",
    add: "添加商品",
    bannersetting: "轮播图设置",
    goodssetting: "热销商品设置",
    productsetting: "新品上线设置",
    recommendsetting: "为你推荐设置",
    alteruser: "修改账户",
};
