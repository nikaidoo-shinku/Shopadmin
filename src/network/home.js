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

// 商品管理接口
export function cateListData(querInfo) {
    return request({
        url: '/categories',
        params: {
            type: querInfo.type,
            pagenum: querInfo.pagenum,
            pagesize: querInfo.pagesize
        }
    })
}

export function ParentCateListData() {
    return request({
        url: '/categories',
        params: {
            type: 2,
        }
    })
}

export function addCateData(addCateForm) {
    return request({
        url: '/categories',
        method: 'post',
        data: {
            cat_pid: addCateForm.cat_pid,
            cat_name: addCateForm.cat_name,
            cat_level: addCateForm.cat_level
        }
    })
}

export function paramsCateListData() {
    return request({
        url: '/categories'
    })
}

export function paramsManageCateListData(cateId, activeName) {
    return request({
        url: `categories/${cateId}/attributes`,
        params: {
            sel: activeName
        }
    })
}

export function addParamsData(cateId, attr_name, attr_sel) {
    return request({
        url: `categories/${cateId}/attributes`,
        method: 'post',
        data: {
            attr_name,
            attr_sel
        }
    })
}

export function queryParamsData(id, attrId, activeName) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        params: {
            attr_sel: activeName
        }
    })
}

export function editParamsData(id, attrId, attr_name, attr_sel) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'put',
        data: {
            attr_name,
            attr_sel
        }
    })
}

export function deleteParamsData(id, attrId) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'delete'
    })
}

export function editManyParamsData(id, attrId, attr_name, attr_sel, attr_vals) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'put',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}

export function goodsListData(queryInfo) {
    return request({
        url: '/goods',
        params: {
            query: queryInfo.query,
            pagenum: queryInfo.pagenum,
            pagesize: queryInfo.pagesize
        }
    })
}

export function deleteGoodsListData(id) {
    return request({
        url: `goods/${id}`,
        method: 'delete'
    })
}

export function addGoodsData(form) {
    return request({
        url: '/goods',
        method: 'post',
        data: {
            goods_name: form.goods_name,
            goods_cat: form.goods_cat,
            goods_price: form.goods_price,
            goods_number: form.goods_number,
            goods_weight: form.goods_weight,
            goods_introduce: form.goods_introduce,
            pics: form.pics,
            attrs: form.attrs
        }
    })
}