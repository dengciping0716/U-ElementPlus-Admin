import { AxiosRequestConfig } from 'axios'

declare module 'axios' {

  export interface AxiosRequestConfig {
    _not_require_auth?: boolean
  }
}