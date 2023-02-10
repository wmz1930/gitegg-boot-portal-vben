import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

export function checkSmsCodePre(query) {
  return defHttp.get({
    url: '/extension/sms/check/code/pre',
    params: query,
  });
}

export function checkSmsCode(query) {
  return defHttp.get({
    url: '/extension/sms/check/code',
    params: query,
  });
}

export function sendSmsCode(data) {
  return defHttp.post({
    url: '/extension/sms/code/send',
    data: data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
