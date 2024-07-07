import request from 'umi-request';
import {ValidatorProps} from "@/types/validator";
import {ExecutorProps} from "@/types/executor";

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
    return request('/api/validator/all', {
        method: 'GET',
    });
}

export async function saveValidator(validator:ValidatorProps) {
    return request('/api/validator', {
        method: 'POST',
        data: validator,
    });
}

export async function deleteValidator(id:string) {
    return request('/api/validator/delete', {
        method: 'POST',
        data: {'id': id},
    });
}

export async function getValidator(id:string) {
    return request('/api/validator', {
        method: 'GET',
        params: {'id': id},
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

export async function saveExecutor(executor:ExecutorProps) {
    return request('/api/executor', {
        method: 'POST',
        data: executor,
    });
}

export async function getExecutor(id:string) {
    return request('/api/executor', {
        method: 'GET',
        params: {'id': id},
    });
}

export async function getAllExecutors(id:string) {
    return request('/api/executor/all', {
        method: 'GET',
        params: {'id': id},
    });
}

export async function getFileEntities(id:string) {
    return request('/api/executor/file/entities', {
        method: 'POST',
        data: {id: id},
    });
}
