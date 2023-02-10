import { defHttp } from '/@/utils/http/axios';

export function queryJustAuthSocialList(query) {
  return defHttp.get({
    url: '/extension/justauth/social/list',
    params: query,
  });
}

export function createJustAuthSocial(data) {
  return defHttp.post({
    url: '/extension/justauth/social/create',
    data,
  });
}

export function updateJustAuthSocial(data) {
  return defHttp.post({
    url: '/extension/justauth/social/update',
    data,
  });
}

export function batchDeleteJustAuthSocial(data) {
  return defHttp.post({
    url: '/extension/justauth/social/batch/delete',
    data,
  });
}

export function deleteJustAuthSocial(id) {
  return defHttp.post({
    url: '/extension/justauth/social/delete/' + id,
  });
}

export function checkJustAuthSocialExist(data) {
  return defHttp.post({
    url: '/extension/justauth/social/check',
    params: data,
  });
}

export function downloadJustAuthSocialList(query) {
  return defHttp.get({
    url: '/extension/justauth/social/download',
    responseType: 'blob',
    params: query,
  });
}
