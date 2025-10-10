import { message } from "antd";

// API 服务层 - 统一管理微服务接口调用

const API_BASE_URL = "";

// 通用请求方法
export const request = async (url: string, options: RequestInit = {}) => {
  // 通用请求配置
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") || "",
  };

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    message.error(response.statusText);
  }

  if (response?.status === 401) {
    localStorage.removeItem("token");
    window.location.replace("/login");
  }

  const res = await response.json();

  if (res?.code !== 200) {
    message.error(res?.message);
    return Promise.reject(res);
  }

  return res;
};

// 用户服务 API
export const userApi = {
  // 用户登录
  login: (loginData: { username: string; password: string }) => {
    return request("/api/user/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },

  // 获取用户列表
  getList: (params: {
    pageNum: number;
    pageSize: number;
    username?: string;
  }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.username && { username: params.username }),
    });
    return request(`/api/user/list?${searchParams}`);
  },

  // 获取用户详情
  getDetail: (id: number) => {
    return request(`/api/user/${id}`);
  },

  // 获取当前用户信息
  getCurrent: () => {
    return request("/api/user/current");
  },

  // 创建用户
  create: (userData: any) => {
    return request("/api/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // 更新用户
  update: (userData: any) => {
    return request("/api/user/update", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // 修改密码
  updatePassword: (passwordData: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return request("/api/user/updatePassword", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },

  // 检查用户名是否存在
  checkUsername: (username: string) => {
    return request(`/api/user/checkUsername?username=${username}`);
  },

  // 检查手机号是否存在
  checkPhone: (phone: string) => {
    return request(`/api/user/checkPhone?phone=${phone}`);
  },

  // 检查邮箱是否存在
  checkEmail: (email: string) => {
    return request(`/api/user/checkEmail?email=${email}`);
  },

  // 更新用户状态 - 注意：monolith 中没有此接口，需要添加
  updateStatus: (id: number, status: number) => {
    return request("/api/user/updateStatus", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
    });
  },
};

// 商品服务 API
export const productApi = {
  // 获取商品列表
  getList: (params: {
    pageNum: number;
    pageSize: number;
    keyword?: string;
  }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.keyword && { keyword: params.keyword }),
    });
    return request(`/api/product/list?${searchParams}`);
  },

  // 获取商品详情
  getDetail: (id: number) => {
    return request(`/api/product/${id}`);
  },

  // 创建商品
  create: (productData: any) => {
    return request("/api/product/create", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  // 更新商品
  update: (productData: any) => {
    return request("/api/product/update", {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  // 删除商品
  delete: (id: number) => {
    return request(`/api/product/${id}`, {
      method: "DELETE",
    });
  },

  // 更新商品库存
  updateStock: (id: number, count: number) => {
    return request(`/api/product/stock/${id}?count=${count}`, {
      method: "PUT",
    });
  },

  // 批量更新商品库存
  batchUpdateStock: (productIds: number[], counts: number[]) => {
    return request("/api/product/stock/batch", {
      method: "PUT",
      body: JSON.stringify({ productIds, counts }),
    });
  },

  // 更新商品状态 - 注意：monolith 中没有此接口，需要添加
  updateStatus: (id: number, status: number) => {
    return request("/api/product/updateStatus", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
    });
  },
};

// 分类服务 API - 基础版本
export const categoryApi = {
  // 获取分类列表
  getList: () => {
    return request("/api/category/list");
  },
};

// 订单服务 API
export const orderApi = {
  // 获取订单列表
  getList: (params: {
    pageNum: number;
    pageSize: number;
    keyword?: string;
  }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.keyword && { keyword: params.keyword }),
    });
    return request(`/api/order/list?${searchParams}`);
  },

  // 获取订单详情
  getDetail: (orderSn: string) => {
    return request(`/api/order/${orderSn}`);
  },

  // 获取用户订单列表
  getUserOrders: (
    userId: number,
    pageNum: number = 1,
    pageSize: number = 10
  ) => {
    return request(
      `/api/order/user/${userId}?pageNum=${pageNum}&pageSize=${pageSize}`
    );
  },

  // 创建订单
  create: (orderData: any) => {
    return request("/api/order/create", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // 取消订单
  cancel: (orderSn: string) => {
    return request(`/api/order/cancel/${orderSn}`, {
      method: "POST",
    });
  },

  // 删除订单
  delete: (orderSn: string) => {
    return request(`/api/order/${orderSn}`, {
      method: "DELETE",
    });
  },

  // 支付订单
  pay: (orderSn: string) => {
    return request(`/api/order/pay/${orderSn}`, {
      method: "POST",
    });
  },

  // 确认收货
  confirmReceive: (orderSn: string) => {
    return request(`/api/order/confirm/${orderSn}`, {
      method: "POST",
    });
  },

  // 订单发货 - 注意：monolith 中没有此接口，需要添加
  delivery: (deliveryData: any) => {
    return request("/api/order/delivery", {
      method: "POST",
      body: JSON.stringify(deliveryData),
    });
  },
};

// 优惠券服务 API
export const couponApi = {
  // 获取优惠券列表
  getList: (pageNum: number = 1, pageSize: number = 10) => {
    return request(`/api/coupon/list?pageNum=${pageNum}&pageSize=${pageSize}`);
  },

  // 获取优惠券详情
  getDetail: (id: number) => {
    return request(`/api/coupon/${id}`);
  },

  // 创建优惠券
  create: (couponData: any) => {
    return request("/api/coupon/create", {
      method: "POST",
      body: JSON.stringify(couponData),
    });
  },

  // 更新优惠券
  update: (couponData: any) => {
    return request("/api/coupon/update", {
      method: "PUT",
      body: JSON.stringify(couponData),
    });
  },

  // 删除优惠券
  delete: (id: number) => {
    return request(`/api/coupon/${id}`, {
      method: "DELETE",
    });
  },

  // 领取优惠券
  receive: (couponId: number, userId: number) => {
    return request(`/api/coupon/receive/${couponId}?userId=${userId}`, {
      method: "POST",
    });
  },

  // 使用优惠券
  use: (couponId: number, userId: number, orderSn: string) => {
    return request("/api/coupon/use", {
      method: "POST",
      body: JSON.stringify({ couponId, userId, orderSn }),
    });
  },

  // 获取用户优惠券列表
  getUserCoupons: (userId: number) => {
    return request(`/api/coupon/user/${userId}`);
  },

  // 获取用户可用优惠券
  getUserAvailableCoupons: (userId: number, totalAmount: number) => {
    return request(
      `/api/coupon/user/${userId}/available?totalAmount=${totalAmount}`
    );
  },

  // 更新优惠券状态 - 注意：monolith 中没有此接口，需要添加
  updateStatus: (id: number, status: number) => {
    return request("/api/coupon/updateStatus", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
    });
  },
};

// 物流服务 API
export const deliveryApi = {
  // 获取物流列表
  getList: (params: {
    pageNum: number;
    pageSize: number;
    keyword?: string;
  }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.keyword && { keyword: params.keyword }),
    });
    return request(`/api/delivery/list?${searchParams}`);
  },

  // 获取物流详情
  getDetail: (id: number) => {
    return request(`/api/delivery/${id}`);
  },

  // 获取订单物流信息
  getByOrderSn: (orderSn: string) => {
    return request(`/api/delivery/order/${orderSn}`);
  },

  // 创建物流订单
  create: (deliveryData: any) => {
    return request("/api/delivery/create", {
      method: "POST",
      body: JSON.stringify(deliveryData),
    });
  },

  // 更新物流订单
  update: (deliveryData: any) => {
    return request("/api/delivery/update", {
      method: "PUT",
      body: JSON.stringify(deliveryData),
    });
  },

  // 删除物流订单
  delete: (id: number) => {
    return request(`/api/delivery/${id}`, {
      method: "DELETE",
    });
  },

  // 确认收货
  confirmReceive: (orderSn: string) => {
    return request(`/api/delivery/confirm/${orderSn}`, {
      method: "POST",
    });
  },

  // 获取物流轨迹
  getTrace: (orderSn: string) => {
    return request(`/api/delivery/trace/${orderSn}`);
  },

  // 同步物流轨迹
  syncTrace: (orderSn: string) => {
    return request(`/api/delivery/trace/sync/${orderSn}`, {
      method: "POST",
    });
  },

  // 生成电子面单
  generateWaybill: (orderSn: string) => {
    return request(`/api/delivery/waybill/${orderSn}`, {
      method: "POST",
    });
  },
};

// 支付服务 API
export const paymentApi = {
  // 创建支付订单
  pay: (paymentData: any) => {
    return request("/api/payment/pay", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  // 查询支付状态
  getStatus: (orderSn: string) => {
    return request(`/api/payment/status/${orderSn}`);
  },

  // 关闭支付订单
  close: (orderSn: string) => {
    return request(`/api/payment/close/${orderSn}`, {
      method: "POST",
    });
  },

  // 退款
  refund: (orderSn: string, refundAmount: number) => {
    return request(
      `/api/payment/refund/${orderSn}?refundAmount=${refundAmount}`,
      {
        method: "POST",
      }
    );
  },

  // 支付宝支付回调
  handleAlipayCallback: (callbackContent: string) => {
    return request("/api/payment/alipay/callback", {
      method: "POST",
      body: callbackContent,
    });
  },

  // 微信支付回调
  handleWechatPayCallback: (callbackContent: string) => {
    return request("/api/payment/wechat/callback", {
      method: "POST",
      body: callbackContent,
    });
  },
};

// 搜索服务 API
export const searchApi = {
  // 导入所有商品到ES
  importAll: () => {
    return request("/api/search/importAll", {
      method: "POST",
    });
  },

  // 根据id删除商品
  delete: (id: number) => {
    return request(`/api/search/${id}`, {
      method: "DELETE",
    });
  },

  // 根据id创建商品
  create: (id: number) => {
    return request(`/api/search/create/${id}`, {
      method: "POST",
    });
  },

  // 批量删除商品
  batchDelete: (ids: number[]) => {
    return request("/api/search/delete/batch", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  },

  // 简单搜索
  search: (params: { keyword?: string; pageNum: number; pageSize: number }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.keyword && { keyword: params.keyword }),
    });
    return request(`/api/search/simple?${searchParams}`);
  },

  // 高级搜索
  advanceSearch: (params: {
    keyword?: string;
    categoryId?: number;
    brandName?: string;
    minPrice?: number;
    maxPrice?: number;
    pageNum: number;
    pageSize: number;
    sort?: number;
  }) => {
    const searchParams = new URLSearchParams({
      pageNum: params.pageNum.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.categoryId && { categoryId: params.categoryId.toString() }),
      ...(params.brandName && { brandName: params.brandName }),
      ...(params.minPrice && { minPrice: params.minPrice.toString() }),
      ...(params.maxPrice && { maxPrice: params.maxPrice.toString() }),
      ...(params.sort && { sort: params.sort.toString() }),
    });
    return request(`/api/search/advance?${searchParams}`);
  },

  // 根据商品id推荐相似商品
  recommend: (id: number, pageSize: number = 10) => {
    return request(`/api/search/recommend/${id}?pageSize=${pageSize}`);
  },

  // 获取热门搜索词
  getHotKeywords: () => {
    return request("/api/search/hot");
  },
};

// 上传服务 API
export const uploadApi = {
  // 上传文件
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/api/upload", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
      body: formData,
    });
  },
};

// 扩展分类服务 API - 注意：monolith 中没有分类控制器，需要添加
export const categoryApiExtended = {
  // 获取分类详情
  getDetail: (id: number) => {
    return request(`/api/category/${id}`);
  },

  // 创建分类
  create: (categoryData: any) => {
    return request("/api/category/create", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  // 更新分类
  update: (categoryData: any) => {
    return request("/api/category/update", {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },

  // 删除分类
  delete: (id: number) => {
    return request(`/api/category/${id}`, {
      method: "DELETE",
    });
  },
};
