/* 首页配置下的接口管理 */
import http from "./http";
/* 轮播图 */
// 获取轮播图列表
const carousels = (pageNumber = 1, pageSize = 10) => {
    return http.get("/carousels", {
        params: {
            pageNumber,
            pageSize,
        },
    });
};
// 获取轮播图详细信息
const carouselsInfo = id => {
    return http.get(`/carousels/${id}`);
};
// 删除轮播图信息
const carouselsRemove = ids => {
    return http.delete("/carousels", {
        data: ids,
    });
};

// 修改轮播图信息
const carouselsUpdate = data => {
    return http.put("/carousels", data);
};
// 新增轮播图信息
const carouselsInsert = data => {
    return http.post("/carousels", data);
};

/* 热销商品 */
// 获取热销商品配置列表
const getGoodsList = (pageNumber = 1, pageSize = 10, configType = 3) => {
    return http.get("/indexConfigs", {
        params: {
            pageNumber,
            pageSize,
            configType,
        },
    });
};
// 获取热销商品详细信息
const getGoodsInfo = id => {
    return http.get(`/indexConfigs/${id}`);
};
// 删除热销商品信息「未开放」
const delGoodsInfo = ids => {
    return http.delete("/indexConfigs", {
        ids,
    });
};
// 修改热销商品信息
const alterGoodsInfo = data => {
    return http.put("/indexConfigs", {
        configType: 3,
        ...data
    });
};
// 新增热销商品信息
const goodsInsert = data => {
    return http.post("/indexConfigs", {
        configType: 3,
        ...data
    });
};
/* 新品上线 */
// 获取新增商品配置列表
const getNewGoodsList = (pageNumber = 1, pageSize = 10, configType = 4) => {
    return http.get("/indexConfigs", {
        params: {
            pageNumber,
            pageSize,
            configType,
        },
    });
};
// 获取新增商品详细信息
const getNewGoodsInfo = id => {
    return http.get(`/indexConfigs/${id}`);
};
// 删除新增商品信息「未开放」
const delNewGoodsInfo = ids => {
    return http.delete("/indexConfigs", {
        ids,
    });
};
// 修改新增商品信息
const alterNewGoodsInfo = data => {
    return http.put("/indexConfigs", {
        configType: 4,
        ...data
    });
};
// 新增商品信息
const newGoodsInsert = data => {
    return http.post("/indexConfigs", {
        configType: 4,
        ...data
    });
};
/* 为你推荐 */
// 获取配置列表
const getRecommendGoodsList = (pageNumber = 1, pageSize = 10, configType = 5) => {
    return http.get("/indexConfigs", {
        params: {
            pageNumber,
            pageSize,
            configType,
        },
    });
};
// 获取详细信息
const getRecommendGoodsInfo = id => {
    return http.get(`/indexConfigs/${id}`);
};
// 删除商品信息「未开放」
const delRecommendGoodsInfo = ids => {
    return http.delete("/indexConfigs", {
        ids,
    });
};
// 修改商品信息
const alterRecommendGoodsInfo = data => {
    return http.put("/indexConfigs", {
        configType: 5,
        ...data
    });
};
// 新增商品信息
const recommendGoodsInsert = data => {
    return http.post("/indexConfigs", {
        configType: 5,
        ...data
    });
};
//模块管理
//商品管理
const getGoodsManagerList = (pageNumber = 1, pageSize = 10) => {
    return http.get('/goods/list', {
        params: {
            pageNumber,
            pageSize
        }
    })
}
//会员管理
const getMemberManagerList = (pageNumber = 1, pageSize = 10) => {
    return http.get('/users', {
        params: {
            pageNumber,
            pageSize
        }
    })
}
const handleSolve = (ids) => {
    return http.put('/users/0', {
        ids
    })
}
const handleForbid = (ids) => {
    return http.put('/users/1', {
        ids
    })
}
//订单管理
const getOrderManagerList = (pageNumber = 1, pageSize = 10, orderNo, orderStatus) => {
    return http.get('/orders', {
        params: {
            pageNumber,
            pageSize,
            orderNo,
            orderStatus
        }
    })
}
//配货完成
const checkDone = (ids) => {
    return http.put('/orders/checkDone', {
        ids
    })
}
//出库
const checkOut = (ids) => {
    return http.put('/orders/checkOut', {
        ids
    })
}
const getOrderDetail = id => {
    return http.get(`/orders/${id}`)
}

export default {
    // #region
    // 轮播图
    carousels,
    carouselsInfo,
    carouselsRemove,
    carouselsUpdate,
    carouselsInsert,
    // 热销商品
    getGoodsList,
    getGoodsInfo,
    delGoodsInfo,
    alterGoodsInfo,
    goodsInsert,
    // 新增商品
    getNewGoodsList,
    getNewGoodsInfo,
    delNewGoodsInfo,
    alterNewGoodsInfo,
    newGoodsInsert,
    // 为你推荐
    getRecommendGoodsList,
    getRecommendGoodsInfo,
    delRecommendGoodsInfo,
    alterRecommendGoodsInfo,
    recommendGoodsInsert,
    //商品管理
    getGoodsManagerList,
    //会员管理
    getMemberManagerList,
    handleSolve,
    handleForbid,
    //订单管理
    getOrderManagerList,
    checkDone,
    checkOut,
    getOrderDetail
};