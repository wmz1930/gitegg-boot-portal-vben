<template>
  <div>
    <BasicTable
      @register="registerTable"
      :searchInfo="searchInfo"
      :rowSelection="{
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true,
      }"
    >
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" class="mr-2">
          <icon icon="ant-design:plus-outlined" /> 新增微信支付
        </a-button>
        <Dropdown
          v-if="checkedKeys.length > 0"
          :trigger="['hover']"
          :dropMenuList="[
            {
              icon: 'ant-design:delete-outlined',
              text: '批量删除',
              event: '1',
              popConfirm: {
                title: '是否确认删除',
                placement: 'right',
                confirm: handleBatchDelete.bind(null),
              },
            },
          ]"
          popconfirm
        >
          <slot name="more"></slot>
          <a-button v-if="!$slots.more">
            批量操作
            <icon icon="ant-design:down-outlined" />
          </a-button>
        </Dropdown>
      </template>
      <template #toolbar>
        <Upload accept=".xls,.xlsx" :showUploadList="false" :beforeUpload="beforeImportPayList">
          <a-button type="primary"> <icon icon="ant-design:upload-outlined" /> 数据导入 </a-button>
        </Upload>
        <Dropdown
          class="mr-2"
          :trigger="['hover']"
          :dropMenuList="[
            {
              icon: 'ant-design:check-circle-outlined',
              text: '导出选中',
              event: '1',
              disabled: checkedKeys.length === 0,
              onClick: handleExportPayList.bind(null, true),
            },
            {
              icon: 'ant-design:check-circle-twotone',
              text: '导出全部',
              event: '1',
              onClick: handleExportPayList.bind(null, false),
            },
          ]"
          popconfirm
        >
          <slot name="more"></slot>
          <a-button v-if="!$slots.more">
            数据导出
            <icon icon="ant-design:down-outlined" />
          </a-button>
        </Dropdown>
        <a-button type="link" @click="handleDownloadTemplate">下载模板</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
            ]"
            :dropDownActions="[
              {
                label: '删除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PayDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { Upload } from 'ant-design-vue';
  import { merge } from 'lodash-es';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getPayList,
    deletePay,
    batchDeletePay,
    exportPayList,
    importPayList,
    downloadPayTemplate,
  } from '/@/api/system/extension/wx/pay';

  import { useDrawer } from '/@/components/Drawer';
  import PayDrawer from './PayDrawer.vue';

  import { columns, searchFormSchema } from './pay.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { Dropdown } from '/@/components/Dropdown';
  import Icon from '@/components/Icon/Icon.vue';

  import { handleDownloadBlod } from '/@/utils/file/download';
  import { useLoading } from '/@/components/Loading';

  export default defineComponent({
    name: 'PayManagement',
    components: { BasicTable, PayDrawer, TableAction, Dropdown, Icon, Upload },
    setup() {
      const checkedKeys = ref(Array<string | number>());
      const { createMessage } = useMessage();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '',
      });
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord, getForm }] = useTable({
        title: '微信支付列表',
        api: getPayList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        clickToRowSelect: false,
        handleSearchInfoFn(info) {
          return info;
        },
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        handlePayRecord(record);
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        deletePay(record.id)
          .then(() => {
            createMessage.success(`微信支付删除成功`);
            reload();
          })
          .catch(() => {
            createMessage.error('微信支付删除失败');
          })
          .finally(() => {});
      }

      function handleBatchDelete() {
        batchDeletePay(checkedKeys.value)
          .then(() => {
            createMessage.success(`微信支付删除成功`);
            checkedKeys.value = [];
            reload();
          })
          .catch(() => {
            createMessage.error('微信支付删除失败');
          })
          .finally(() => {});
      }

      function handleSuccess({ isUpdate, values }) {
        createMessage.success(`操作成功`);
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          reload();
        }
      }

      // 状态等数据展示前的转换
      function handlePayRecord(record: Recordable) {
        // 数据字典配置的都是字符串，这个在后台返回状态Number类型时需要进行转换
        record.status = `${record.status}`;
      }

      // 跨页选中
      function onSelectChange(selectedRowKeys: (string | number)[]) {
        checkedKeys.value = selectedRowKeys;
      }

      function getSearchParams() {
        const params: Recordable = merge(getForm()?.getFieldsValue(), searchInfo);
        return params;
      }

      //数据导出
      function handleExportPayList(exportChecked: boolean) {
        openFullLoading();
        let params = getSearchParams();
        if (exportChecked) {
          params.payIds = checkedKeys.value as string[];
        }
        exportPayList(params)
          .then((response) => {
            handleDownloadBlod('微信支付数据列表.xlsx', response);
            closeFullLoading();
          })
          .catch((err) => {
            createMessage.error('微信支付数据导出失败:' + err);
          })
          .finally(() => {
            closeFullLoading();
          });
      }

      // 数据导入
      function beforeImportPayList(file) {
        handleUploadPayList(file);
        return false;
      }

      function handleUploadPayList(file) {
        const formData = new FormData();
        formData.append('uploadFile', file);
        openFullLoading();
        importPayList(formData)
          .then(() => {
            createMessage.success(`微信支付数据导入成功`);
            reload();
          })
          .catch((err) => {
            createMessage.error(`微信支付数据导入失败: ` + err);
          })
          .finally(() => {
            closeFullLoading();
          });
      }

      // 下载导入模板
      function handleDownloadTemplate() {
        openFullLoading();
        downloadPayTemplate(searchInfo)
          .then((response) => {
            handleDownloadBlod('微信支付批量导入模板.xlsx', response);
          })
          .catch((err) => {
            createMessage.error(`下载导入模板失败: ` + err);
          })
          .finally(() => {
            closeFullLoading();
          });
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleBatchDelete,
        handleSuccess,
        handlePayRecord,
        onSelectChange,
        checkedKeys,
        searchInfo,
        handleExportPayList,
        beforeImportPayList,
        handleDownloadTemplate,
      };
    },
  });
</script>
