import { defHttp } from '/@/utils/http/axios';

export function getUserList(query) {
  return defHttp.get({
    url: '/system/user/list',
    params: query,
  });
}

export function createUser(params) {
  return defHttp.post({
    url: '/system/user/create',
    params,
  });
}

export function updateUser(data) {
  return defHttp.post({
    url: '/system/user/update',
    data,
  });
}

export function updateUserInfo(data) {
  return defHttp.post({
    url: '/system/user/update/info',
    data,
  });
}

export function queryUserInfo(data) {
  return defHttp.get({
    url: '/system/auth/user/info',
    data,
  });
}

export function updatePwd(data) {
  return defHttp.post({
    url: '/system/user/password/change',
    data,
  });
}

export function resetUserPassword(id) {
  return defHttp.post({
    url: '/system/user/password/reset/' + id,
  });
}

export function updateUserStatus(userId, status) {
  return defHttp.post({
    url: '/system/user/status/' + userId + '/' + status,
  });
}

export function deleteUser(id) {
  return defHttp.post({
    url: '/system/user/delete/' + id,
  });
}

export function batchDeleteUser(data) {
  return defHttp.post({
    url: '/system/user/batch/delete',
    data,
  });
}

export function updateUserDataPermission(data) {
  return defHttp.post({
    url: '/system/user/update/organization/data/permission',
    data,
  });
}

export function checkUserExist(data) {
  return defHttp.post({
    url: '/system/user/check',
    data,
  });
}

export function getOrganizationDataList(query) {
  return defHttp.get({
    url: '/system/user/organization/data/permission/list',
    params: query,
  });
}

export function batchDeleteOrganizationData(data) {
  return defHttp.post({
    url: '/system/user/organization/data/permission/batch/delete',
    data,
  });
}

export function exportUserList(data) {
  return defHttp.post({
    url: '/system/user/export',
    responseType: 'blob',
    data,
  });
}

export function importUserList(formData) {
  return defHttp.post({
    url: '/system/user/import',
    data: formData,
  });
}

export function downloadUserTemplate(query) {
  return defHttp.get({
    url: '/system/user/download/template',
    responseType: 'blob',
    params: query,
  });
}
