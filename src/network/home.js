import {
    request
} from "./request";

export function menuList() {
    return request({
        url: '/menus'
    })
}

export function usersList(query, pagenum, pagesize) {
    return request({
        url: '/users',
        params: {
            query: query,
            pagenum: pagenum,
            pagesize: pagesize
        }
    })
}

export function userState(uId, type) {
    return request({
        url: `users/${uId}/state/${type}`,
        method: 'put'
    })
}

export function addUserData(addForm) {
    return request({
        url: '/users',
        method: 'post',
        data: {
            username: addForm.username,
            password: addForm.password,
            email: addForm.email,
            mobile: addForm.mobile,
        }
    })
}

export function userEdit(id) {
    return request({
        url: `users/${id}`,
        method: 'get'
    })
}

export function userEditModify(id, email, mobile) {
    return request({
        url: `users/${id}`,
        method: 'put',
        data: {
            email: email,
            mobile: mobile
        }
    })
}

export function userDelete(id) {
    return request({
        url: `users/${id}`,
        method: 'delete'
    })
}