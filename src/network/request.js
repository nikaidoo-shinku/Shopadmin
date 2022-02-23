import axios from 'axios'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 5000
    })

    instance.interceptors.request.use(config => {
        // 在request拦截器中，展示进度条nProgress.start()
        nProgress.start()

        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    }), err => {

    }

    instance.interceptors.response.use(res => {
        // 在response拦截器中，隐藏进度条nProgress.done()
        nProgress.done()

        return res.data
    }, err => {
        console.log(err);
    })

    return instance(config)
}