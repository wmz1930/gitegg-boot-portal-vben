<template>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLoginValid"
  >
    <FormItem name="phoneNumber" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.phoneNumber"
        :placeholder="t('sys.login.mobile')"
        class="fix-auto-fill"
      >
        <template #prefix>
          <icon icon="ant-design:mobile-outlined" />
        </template>
      </Input>
    </FormItem>

    <FormItem name="captcha_code" v-if="captchaState.loginCaptchaType === 'image'">
      <ARow class="enter-x">
        <ACol :span="15">
          <Input
            size="large"
            v-model:value="formData.captcha_code"
            class="v-code-img-input"
            :placeholder="t('sys.login.captcha')"
          />
        </ACol>
        <ACol :span="1" />
        <ACol :span="8">
          <img
            :src="captchaState.captchaImage"
            alt=""
            @click="refreshImageCode"
            class="v-code-img"
          />
        </ACol>
      </ARow>
    </FormItem>

    <FormItem name="captcha" class="enter-x">
      <CountdownInput
        size="large"
        class="fix-auto-fill send-captcha"
        v-model:value="formData.captcha"
        :sendCodeApi="captchaVerifySendSms"
        :placeholder="t('sys.login.smsCode')"
        :loading="sendSmsLoading"
        ref="countButtonInput"
      >
        <template #prefix>
          <icon icon="ant-design:mail-outlined" />
        </template>
      </CountdownInput>
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="formData.rememberMobile" size="small">
            {{ t('sys.login.rememberMobile') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <!-- <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button> -->
        </FormItem>
      </ACol>
    </ARow>
  </Form>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, computed, onMounted } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import { Icon } from '/@/components/Icon';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import {
    LoginStateEnum,
    useLoginState,
    useCaptchaState,
    useFormRules,
    useFormValid,
    loginRememberMobile,
  } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAuthCacheWithTimeOut } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { NO_CLEAR_START_KEY } from '/@/enums/cacheEnum';
  import { getSmsCaptcha } from '/@/api/login';

  export default defineComponent({
    name: 'LoginForm',
    components: {
      [Col.name]: Col,
      [Row.name]: Row,
      Checkbox,
      Form,
      FormItem: Form.Item,
      Input,
      Icon,
      CountdownInput,
      Button,
    },
    emits: ['show-verify', 'refresh-image-code'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { notification, createErrorModal, createMessage } = useMessage();
      const { prefixCls } = useDesign('login');
      const userStore = useUserStore();
      const globSetting = useGlobSetting();

      const { setLoginState, getLoginState, setLoginLoading } = useLoginState();
      const { getCaptchaState } = useCaptchaState();
      const { getFormRules } = useFormRules();

      const formRef = ref();
      const loading = ref(false);
      const verify = ref();
      const rememberMobile = ref(false);

      const sendSmsLoading = ref(false);

      const formData = reactive({
        phoneNumber: '',
        captcha: '',
        grant_type: 'sms_captcha',
        captcha_key: '',
        captcha_code: '',
        rememberMobile: false,
      });

      const { validForm } = useFormValid(formRef);

      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

      const captchaState = computed(() => unref(getCaptchaState));

      // ???????????????????????????????????????
      onMounted(() => {
        const rememberAccountStartKey =
          NO_CLEAR_START_KEY + globSetting.tenantId + '_' + globSetting.clientId;
        const rememberMobile = getAuthCacheWithTimeOut(
          rememberAccountStartKey + '_REMEMBER_ME',
        ) as boolean;
        if (rememberMobile) {
          const phoneNumber = getAuthCacheWithTimeOut(
            rememberAccountStartKey + '_PHONE_NUMBER',
          ) as string;
          if (phoneNumber !== '') {
            formData.phoneNumber = phoneNumber;
            formData.rememberMobile = rememberMobile;
          }
        }
      });

      // ?????????????????????????????????????????????????????????
      async function captchaVerifySendSms(): Promise<boolean> {
        sendSmsLoading.value = true;
        const data = await formRef.value.validateFields('phoneNumber');
        if (!data) return false;
        if (captchaState.value.loginCaptchaType === 'sliding') {
          emit('show-verify', { verifyType: 'sendSms' });
        } else {
          verifySendSmsSuccess(undefined);
        }
        return false;
      }

      // ??????????????????????????????????????????
      async function verifySendSmsSuccess(params) {
        // params ???????????????????????????, ???????????????????????????????????????????????????????????????????????????
        const data = await formRef.value.validateFields('phoneNumber');
        if (!data) return;
        const loginParams = {} as any;
        loginParams.grant_type = 'sms_captcha';
        loginParams.phoneNumber = formData.phoneNumber;
        loginParams.code = formData.captcha;
        loginParams.smsCode = 'sms_login_code';
        // ?????????????????????????????????????????????
        if (captchaState.value.loginCaptchaType === 'sliding') {
          loginParams.captcha_type = 'sliding';
          loginParams.sliding_type = captchaState.value.slidingCaptchaType;
          loginParams.captcha_verification = params.captchaVerification;
        } else if (captchaState.value.loginCaptchaType === 'image') {
          loginParams.captcha_type = 'image';
          loginParams.captcha_key = captchaState.value.captchaKey;
          loginParams.captcha_code = formData.captcha_code;
        }
        getCaptcha(loginParams);
      }

      function getCaptcha(loginParams) {
        createMessage.loading({
          content: '??????????????????...',
          duration: 0,
          key: 'sendSmsLoading',
        });
        loginParams.phoneNumber = formData.phoneNumber;
        loginParams.smsCode = 'sms_login_code';
        getSmsCaptcha(loginParams)
          .then((response) => {
            if (response && response.success) {
              // ????????????????????????????????????
              immediateStart();
              createMessage.success(`??????????????????`);
            } else {
              createMessage.error(`????????????????????????${response.msg}`);
            }
          })
          .finally(() => {
            sendSmsLoading.value = false;
            createMessage.destroy('sendSmsLoading');
          });
      }

      // ???????????????, ??????????????????????????????
      const countButtonInput = ref();
      async function immediateStart() {
        countButtonInput.value.immediateStart(true);
      }

      // ???loginCaptchaType = image?????????????????????????????????
      function refreshImageCode() {
        emit('refresh-image-code', {});
      }

      async function handleLoginValid() {
        const data = await validForm();
        if (!data) return;
        // ???????????????????????????????????????????????????????????????????????????????????????
        if (
          formData.grant_type === 'sms_captcha' &&
          captchaState.value.loginCaptchaType === 'sliding'
        ) {
          emit('show-verify', { verifyType: 'login' });
        } else {
          handleLoginSubmit(undefined);
        }
      }

      // ??????????????????????????????????????????
      async function handleLoginSubmit(params) {
        // params ???????????????????????????, ???????????????????????????????????????????????????????????????????????????
        try {
          loading.value = true;
          const userInfo = await userStore.login({
            phoneNumber: formData.phoneNumber,
            code: formData.captcha, //????????????????????????
            smsCode: 'sms_login_code',
            grant_type: 'sms_captcha',
            captcha_type: captchaState.value.loginCaptchaType,
            captcha_key: captchaState.value.captchaKey,
            captcha_code: formData.captcha_code, //????????????????????????
            sliding_type: captchaState.value.slidingCaptchaType,
            captcha_verification: params ? params?.captchaVerification : undefined,
            mode: 'none', //???????????????????????????
          });

          if (userInfo) {
            // ???????????????????????????????????????
            const rememberMobile = formData.rememberMobile;
            const phoneNumber = formData.phoneNumber;
            loginRememberMobile(rememberMobile, phoneNumber, globSetting);
            notification.success({
              message: t('sys.login.loginSuccessTitle'),
              description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickname}`,
              duration: 3,
            });
          }
        } catch (error) {
          const errMsg = (error as unknown as Error).message || t('sys.api.networkExceptionMsg');
          if (errMsg?.indexOf('?????????:427') !== -1) {
            // ?????????????????????????????????????????????????????????????????????
            formData.grant_type = 'sms_captcha';
            // ????????????????????????????????????????????????????????????
            if (captchaState.value.loginCaptchaType === 'sliding') {
              emit('show-verify', { verifyType: 'login' });
            }
          } else {
            createErrorModal({
              title: t('sys.api.errorTip'),
              content: errMsg,
              getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
            });
          }
        } finally {
          setLoginLoading(false);
          loading.value = false;
        }
      }

      return {
        t,
        prefixCls,
        formRef,
        formData,
        getFormRules,
        rememberMobile,
        useCaptchaState,
        handleLoginValid,
        handleLoginSubmit,
        loading,
        sendSmsLoading,
        setLoginState,
        LoginStateEnum,
        getShow,
        refreshImageCode,
        captchaState,
        verify,
        captchaVerifySendSms,
        verifySendSmsSuccess,
        immediateStart,
        countButtonInput,
      };
    },
  });
</script>
