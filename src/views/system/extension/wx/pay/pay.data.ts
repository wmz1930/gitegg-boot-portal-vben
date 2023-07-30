import { BasicColumn, FormSchema } from '/@/components/Table';

import { renderStatusSwitch } from '/@/utils/gitegg/formUtils';
import { updatePayStatus, checkPayExist } from '/@/api/system//extension/wx/pay';
import { getDictBusinessCache } from '/@/utils/gitegg/dictUtils';

// 数据表格Column定义
export const columns: BasicColumn[] = [
  {
    title: '微信名称',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'name',
  },
  {
    title: 'appid',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'appId',
  },
  {
    title: '商户号',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'mchId',
  },
  {
    title: '状态',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'status',
    customRender: ({ record }) => {
      return renderStatusSwitch(record, updatePayStatus, 'status', '状态');
    },
  },
  {
    title: '描述',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'comments',
  },
  {
    title: '创建时间',
    align: 'center',
    width: 200,
    ellipsis: true,
    dataIndex: 'createTime',
  },
];

// 查询条件表单定义
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '微信名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'appId',
    label: 'appid',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'mchId',
    label: '商户号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'ApiSelect',
    componentProps: {
      api: getDictBusinessCache,
      params: { dictCode: 'ENABLE_OR_NOT' },
      resultField: 'dictList',
      labelField: 'dictName',
      valueField: 'dictCode',
    },
    colProps: { span: 6 },
  },
];

// 新增/修改表单定义
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '主键',
    show: false,
    component: 'Input',
  },
  {
    field: 'name',
    label: '微信名称',
    component: 'Input',
    dynamicRules: ({ model }) => {
      return [
        { required: true, message: '微信名称不能为空！' },
        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
        {
          trigger: 'blur',
          message: '微信名称已存在',
          validator: (_, value) => {
            return new Promise((resolve, reject) => {
              const keyData = {
                id: model.id,
                checkField: 'name',
                checkValue: value,
              };
              checkPayExist(keyData)
                .then((response) => {
                  if (!response) {
                    reject('微信名称已存在');
                  } else {
                    resolve();
                  }
                })
                .catch((err) => {
                  reject(err.message || '验证失败');
                });
            });
          },
        },
      ];
    },
    colProps: { span: 24 },
  },
  {
    field: 'appId',
    label: 'appid',
    component: 'Input',
    rules: [
      { required: true, message: 'appid不能为空！' },
      { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
    ],
    colProps: { span: 24 },
  },
  {
    field: 'mchId',
    label: '商户号',
    component: 'Input',
    rules: [
      { required: true, message: '商户号不能为空！' },
      { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
    ],
    colProps: { span: 24 },
  },
  {
    field: 'mchKey',
    label: '商户密钥',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  // {
  //   field: 'entPayKey',
  //   label: '企业支付密钥',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  {
    field: 'subAppId',
    label: '子商户appid',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'subMchId',
    label: '子商户号',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'keyPath',
    label: 'keyPath',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'serviceId',
    label: 'serviceId',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'certSerialNo',
    label: '证书序列号',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'apiV3Key',
    label: 'apiV3秘钥',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'payScoreNotifyUrl',
    label: '支付分回调地址',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'payScorePermissionNotifyUrl',
    label: '支付分授权回调地址',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'privateKeyPath',
    label: 'apiv3商户key',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  {
    field: 'privateCertPath',
    label: 'apiv3商户cert',
    component: 'Input',
    rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  // {
  //   field: 'privateKeyContent',
  //   label: 'apiclient_key.pem',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'privateCertContent',
  //   label: 'piclient_cert.pem',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'signType',
  //   label: '签名方式',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  {
    field: 'notifyUrl',
    label: '微信支付异步回调地址',
    component: 'Input',
    rules: [{ min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
  // {
  //   field: 'httpTimeout',
  //   label: 'http请求数据读取等待时间',
  //   defaultValue: '10000',
  //   component: 'Input',
  //   rules: [
  //     { min: 0, max: 2147483647, message: '数值大小在 0 到 2147483647 之间', trigger: 'blur' },
  //     { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
  //   ],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'httpConnectionTimeout',
  //   label: 'http请求连接超时时间',
  //   defaultValue: '5000',
  //   component: 'Input',
  //   rules: [
  //     { min: 0, max: 2147483647, message: '数值大小在 0 到 2147483647 之间', trigger: 'blur' },
  //     { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
  //   ],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'httpProxyHost',
  //   label: 'http_proxy_host',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'httpProxyPort',
  //   label: 'http_proxy_port',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'httpProxyUsername',
  //   label: 'http_proxy_username',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'httpProxyPassword',
  //   label: 'http_proxy_password',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'useSandboxEnv',
  //   label: '是否测试',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 1, message: '长度在 1 到 1 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'ifSaveApiData',
  //   label: '是否将接口请求日志信息保存到threadLocal中',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 1, message: '长度在 1 到 1 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'keyContent',
  //   label: 'p12证书文件内容的字节数组',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  {
    field: 'status',
    label: '状态',
    defaultValue: '1',

    component: 'ApiRadioGroup',
    componentProps: {
      api: getDictBusinessCache,
      params: { dictCode: 'ENABLE_OR_NOT' },
      resultField: 'dictList',
      labelField: 'dictName',
      valueField: 'dictCode',
    },
    rules: [
      { required: true, message: '状态不能为空！' },
      { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
    ],
    colProps: { span: 24 },
  },
  // {
  //   field: 'md5',
  //   label: 'MD5',
  //   component: 'Input',
  //   rules: [{ min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }],
  //   colProps: { span: 24 },
  // },
  {
    field: 'comments',
    label: '描述',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入微信支付描述信息',
    },
    rules: [{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }],
    colProps: { span: 24 },
  },
];
