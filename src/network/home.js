// 左侧菜单接口
import {
    request
} from "./request";

export function menuList() {
    return request({
        url: '/menus'
    })
}

// 用户管理接口
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

export function rolesData() {
    return request({
        url: '/roles'
    })
}

export function upUserRoles(id, rid) {
    return request({
        url: `users/${id}/role`,
        method: 'put',
        data: {
            rid
        }
    })
}

// 权限管理接口
export function rightsListData() {
    return request({
        url: 'rights/list'
    })
}

export function rightsListDataTree() {
    return request({
        url: 'rights/tree'
    })
}

export function RolesListData() {
    return request({
        url: '/roles'
    })
}

export function removeRightData(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

export function upRightData(roleId, idStr) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids: idStr
        }
    })
}

export function addRolesData(roleName, roleDesc) {
    return request({
        url: '/roles',
        method: 'post',
        data: {
            roleName,
            roleDesc
        }
    })
}

export function rolesEdit(id) {
    return request({
        url: `roles/${id}`
    })
}

export function rolesEditModify(id, roleName, roleDesc) {
    return request({
        url: `roles/${id}`,
        method: 'put',
        data: {
            roleName,
            roleDesc
        }
    })
}

export function rolesDelete(id) {
    return request({
        url: `roles/${id}`,
        method: 'delete'
    })
}