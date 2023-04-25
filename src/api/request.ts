import axios, { ResponseType } from 'axios'
import { message } from 'antd'

const service = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('task-token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    let errMessage = ''
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          errMessage = '错误请求'
          break
        case 401:
          errMessage = '未授权，请重新登录'
          window.location.pathname = '/login'
          break
        case 403:
          errMessage = '没有访问权限，拒绝访问'
          break
        case 404:
          errMessage = '请求错误,未找到该资源'
          break
        case 405:
          errMessage = '请求方法未允许'
          break
        case 408:
          errMessage = '请求超时'
          break
        case 500:
          errMessage = '服务器错误'
          break
        case 501:
          errMessage = '网络未实现'
          break
        case 502:
          errMessage = '网络错误'
          break
        case 503:
          errMessage = '服务不可用'
          break
        case 504:
          errMessage = '网络超时'
          break
        default:
          errMessage = `连接错误${err.response.msg}`
      }
    } else {
      errMessage = '连接到服务器失败'
    }
    message.error(errMessage)
    return Promise.reject(err.response)
  }
)

interface IResponseData<T> {
  data: T
  code: number
  msg: string
  total?: number
}

//get请求
export function get<T>(
  url: string,
  params?: any,
  responseType?: ResponseType,
  headers?: any
): Promise<IResponseData<T>> {
  return service.get(url, {
    params: params ?? {},
    headers: {
      ...(headers || {})
    },
    responseType
  })
}
// post请求
export function post<T>(url: string, params?: any, _object = {}): Promise<IResponseData<T>> {
  return service.post(url, params, { ..._object })
}
export function postFormData<T>(url: string, params?: any): Promise<IResponseData<T>> {
  return service.post(
    url,
    {
      ...params
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
export function put<T>(url: string, params?: any, _object = {}): Promise<IResponseData<T>> {
  return service.put(url, params)
}
export function patch<T>(url: string, params?: any, _object = {}): Promise<IResponseData<T>> {
  return service.patch(url, params)
}
export function remove<T>(url: string, params?: any, _object = {}): Promise<IResponseData<T>> {
  return service.delete(url, {
    params: params,
    ..._object
  })
}
