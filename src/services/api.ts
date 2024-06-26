import request from 'umi-request';

export async function getDict() {
    return request('/api/dict', {
        method: 'GET',
    });
}

export async function saveDict(dict:any) {
    return request('/api/dict/save', {
        method: 'POST',
        data: {'dict': dict },
    });
}

export async function deleteDict(id:string) {
    return request('/api/dict/delete', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function getValidationType() {
    return request('/api/validationtype', {
        method: 'GET',
    });
}

export async function getRepairType() {
    return request('/api/repairtype', {
        method: 'GET',
    });
}

export async function getAllValidator() {
    return request('/api/validator', {
        method: 'GET',
    });
}

export async function saveValidator(validator:any) {
    return request('/api/validator/save', {
        method: 'POST',
        data: {'code': validator.code, 'name': validator.name },
    });
}

export async function deleteValidator(id:string) {
    return request('/api/validator/delete', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function getValidatorInfo(id:string) {
    return request('/api/validator/info', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function saveValidatorInfo(validatorInfo:any) {
    return request('/api/validator/info', {
        method: 'POST',
        data: {'validatorInfos': validatorInfo },
    });
}

export async function copyValidatorInfo(id:string) {
    return request('/api/validator/copy', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function updateExecuteFiles(id:string) {
    return request('/api/execute/upload/file', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function saveExecuteInfo(executeInfo:any) {
    return request('/api/execute/info/save', {
        method: 'POST',
        data: {'executeInfo': executeInfo},
    });
}

export async function getExecuteInfo(executeInfo:any) {
    return request('/api/execute/info/save', {
        method: 'POST',
        data: {'executeInfo': executeInfo},
    });
}
