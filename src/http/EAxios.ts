import axios, { AxiosInstance } from 'axios'
import { showToast } from "vant"

export class EAxios {
  instance: AxiosInstance;

  constructor (url: string) {
    this.instance = axios.create({
      baseURL: url || '',
      timeout: 120000
    })
    this.init()
  }

  getInterceptors () {
    return this.instance
  }

  // 初始化拦截器
  init () {
    // 请求接口拦截器
    this.instance.interceptors.request.use(
      config => {
        config.headers["Content-Type"] = 'application/json;'
        if (localStorage.getItem("token")) {
          config.headers["Authorization"] = localStorage.getItem("token")
        }
        return config
      },
      err => {
        console.error(err)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      response => {
        if (response.status === 200) {
          return Promise.resolve(response.data)
        } else {
          return Promise.reject(response)
        }
      },
      err => {
        const { response } = err
        if (response) {
          showToast({
            message: `错误：${response.status}`,
            position: 'bottom',
          })
          return Promise.reject(err)
        } else {
          showToast({
            message: "网络连接异常,请稍后再试!",
            position: 'bottom',
          })
        }
      })
  }
}
