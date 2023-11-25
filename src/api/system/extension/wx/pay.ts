import { defHttp } from '/@/utils/http/axios';

export function getPayList(query) {
  return defHttp.get({
    url: '/extension/wx/pay/list',
    params: query,
  });
}

export function createPay(data) {
  return defHttp.post({
    url: '/extension/wx/pay/create',
    data,
  });
}

export function updatePay(data) {
  return defHttp.post({
    url: '/extension/wx/pay/update',
    data,
  });
}

export function updatePayStatus(payId, status) {
  return defHttp.post({
    url: '/extension/wx/pay/status/' + payId + '/' + status,
  });
}

export function batchDeletePay(data) {
  return defHttp.post({
    url: '/extension/wx/pay/batch/delete',
    data,
  });
}

export function deletePay(id) {
  return defHttp.post({
    url: '/extension/wx/pay/delete/' + id,
  });
}

export function checkPayExist(data) {
  return defHttp.post({
    url: '/extension/wx/pay/check',
    params: data,
  });
}

export function exportPayList(query) {
  return defHttp.post({
    url: '/extension/wx/pay/export',
    responseType: 'blob',
    params: query,
  });
}

export function importPayList(formData) {
  return defHttp.post({
    url: '/extension/wx/pay/import',
    data: formData,
  });
}

export function downloadPayTemplate(query) {
  return defHttp.get({
    url: '/extension/wx/pay/download/template',
    responseType: 'blob',
    params: query,
  });
}
