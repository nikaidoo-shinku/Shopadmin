import { request } from "./request";

export function loginFormPost(loginForm) {
    return request({
        url: '/login',
        method: 'post',
        data: {
            username: loginForm.username,
            password: loginForm.password
        }
    })
}