import request from 'umi-request';


export async function login(user: string, password: string) {
    return request('/api/auth/product', {
        method: 'POST',
        data: {'code1': user, 'code2': password },
    });
}

export async function getAllConditionOperate() {
    return request('/api/base/conditionOperate/all', {
        method: 'GET',
    });
}
