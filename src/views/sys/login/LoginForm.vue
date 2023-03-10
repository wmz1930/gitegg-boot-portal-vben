<template>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLoginValid"
  >
    <FormItem name="username" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.username"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      >
        <template #prefix>
          <icon icon="ant-design:user-outlined" />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      >
        <template #prefix>
          <icon icon="ant-design:lock-outlined" />
        </template>
      </InputPassword>
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

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="formData.rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="openRecover">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>
  </Form>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, computed, onMounted } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import { encryptByMd5 } from '/@/utils/cipher';
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
    loginRememberMe,
  } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAuthCacheWithTimeOut } from '/@/utils/auth';
  import { NO_CLEAR_START_KEY } from '/@/enums/cacheEnum';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'LoginForm',
    components: {
      [Col.name]: Col,
      [Row.name]: Row,
      Checkbox,
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      InputPassword: Input.Password,
      Icon,
    },
    emits: ['show-verify', 'refresh-image-code'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('login');
      const userStore = useUserStore();
      const globSetting = useGlobSetting();

      const { setLoginState, getLoginState, setLoginLoading } = useLoginState();
      const { getCaptchaState } = useCaptchaState();
      const { getFormRules } = useFormRules();

      const formRef = ref();
      const loading = ref(false);
      const verify = ref();
      // const rememberMe = ref(false);

      const formData = reactive({
        username: '',
        password: '',
        grant_type: 'password',
        captcha_key: '',
        captcha_code: '',
        rememberMe: false,
      });

      const { validForm } = useFormValid(formRef);

      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

      const captchaState = computed(() => unref(getCaptchaState));

      // ?????????????????????????????????????????????????????????????????????????????????
      onMounted(() => {
        const rememberAccountStartKey =
          NO_CLEAR_START_KEY + globSetting.tenantId + '_' + globSetting.clientId;
        const rememberMe = getAuthCacheWithTimeOut(
          rememberAccountStartKey + '_REMEMBER_ME',
        ) as boolean;
        if (rememberMe) {
          const username = getAuthCacheWithTimeOut(rememberAccountStartKey + '_USERNAME') as string;
          const password = getAuthCacheWithTimeOut(rememberAccountStartKey + '_PASSWORD') as string;
          if (username !== '' && password !== '') {
            formData.username = username;
            formData.password = password;
            formData.rememberMe = rememberMe;
          }
        }
      });

      // ???loginCaptchaType = image?????????????????????????????????
      function refreshImageCode() {
        emit('refresh-image-code', {});
      }

      async function handleLoginValid() {
        const data = await validForm();
        if (!data) return;
        // ???????????????????????????????????????????????????????????????????????????????????????
        if (
          formData.grant_type === 'captcha' &&
          captchaState.value.loginCaptchaType === 'sliding'
        ) {
          emit('show-verify', {});
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
            username: formData.username,
            password: encryptByMd5(formData.password),
            grant_type: formData.grant_type,
            captcha_type: captchaState.value.loginCaptchaType,
            captcha_key: captchaState.value.captchaKey,
            captcha_code: formData.captcha_code,
            sliding_type: captchaState.value.slidingCaptchaType,
            captcha_verification: params ? params?.captchaVerification : undefined,
            mode: 'none', //???????????????????????????
          });

          if (userInfo) {
            // ????????????????????????????????????
            const rememberMe = formData.rememberMe;
            const username = formData.username;
            const password = formData.password;
            loginRememberMe(rememberMe, username, password, globSetting);
            // ????????????????????????
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
            formData.grant_type = 'captcha';
            // ????????????????????????????????????????????????????????????
            if (captchaState.value.loginCaptchaType === 'sliding') {
              emit('show-verify', {});
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

      const router = useRouter();
      const { currentRoute } = router;
      const { query } = unref(currentRoute);

      function openRecover() {
        const { href } = router.resolve({
          name: 'Recover', // ????????????????????????name
          query: {
            // ???????????????
            redirect: query.redirect,
          },
        });
        window.open(href);
      }

      return {
        t,
        prefixCls,
        formRef,
        formData,
        getFormRules,
        useCaptchaState,
        handleLoginValid,
        handleLoginSubmit,
        loading,
        setLoginState,
        LoginStateEnum,
        getShow,
        refreshImageCode,
        captchaState,
        verify,
        openRecover,
      };
    },
  });
</script>
