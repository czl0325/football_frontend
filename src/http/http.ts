import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { EAxios } from '@/http/EAxios.ts'
import { showToast } from "vant"
import { API_URL } from "../config.ts"

interface BaseResponseData<T> {
  timestamp: number;
  msg: string;
  data: T;
  code: number;
  success: boolean;
}

export type RequestType = "post" | "get" | "put" | "delete"

export interface PageModel<T> {
  data: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface PaginationInfo {
  loading: boolean;
  pageNum: number;
  total: number;
  pageSize: number;
}

export const defaultPagination = {
  loading: false,
  pageNum: 1,
  total: 0,
  pageSize: 10
}

export class HttpService {
  myAxios: AxiosInstance
  public baseUrl: string = API_URL

  constructor () {
    this.myAxios = new EAxios(this.baseUrl).getInterceptors()
  }

  get<T> (url: string, params: object = {}, showError = true) {
    return new Promise<T>((resolve, reject) => {
      this.myAxios.get(url, {
        params: params
        //@ts-ignore
      }).then((res: BaseResponseData<T>) => {
        if (res.code === 200) {
          resolve(res.data as T)
        } else {
          if (showError) {
            showToast({
              message: res.msg,
              position: 'bottom',
            })
          }
          reject(res)
        }
      }).catch((err: { message: any }) => {
        reject(err.message || '请求失败')
      })
    })
  }

  postWithConfig<T> (url: string, params: object = {}, config: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      this.myAxios.post(url, params, config)
        // @ts-ignore
        .then((res: BaseResponseData<T>) => {
          if (res.code === 200) {
            resolve(res.data as T)
          } else {
            showToast({
              message: res.msg,
              position: 'bottom',
            })
            reject(res)
          }
        }).catch((err: { message: any }) => {
        reject(err.message || '请求失败')
      })
    })
  }

  post<T> (url: string, params: object = {}) {
    return this.postWithConfig<T>(url, params, {})
  }
}

export const http1 = new HttpService()
