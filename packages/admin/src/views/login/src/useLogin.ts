import { omit, get } from 'lodash';
import md5 from 'md5';
import { useUserStore } from '@/store/userStore';
import { useMenuStore } from '@/store/menuStore';

export const PAGE_RESET_PASSWORD = '/resetPassword';

/**
 * 通用登录逻辑，包含登录请求，数据存储，页面跳转
 * @returns
 */
export const useLogin = function () {
  let router = useRouter();
  let route = useRoute();
  let { setAuthInfo } = useUserStore();
  let { setRemoteMenu } = useMenuStore();

  const loading = ref(false);
  //
  async function requestLogin(params: any, time = new Date().getTime()) {
    loading.value = true;
    return $http
      .post(resolveUrl('/user/login?t=' + time), params, { _not_require_auth: true })
      .then(async (data: any) => {
        let authInfo = data.result;
        await setAuthInfo(authInfo);
        await setRemoteMenu(data.result?.routeList || []);
        return data;
      })
      .then(async (data: any) => {
        let { isFirstLogin, isOverMonth } = data.result;
        //跳转目标页面
        if (isFirstLogin || isOverMonth) {
          router.replace(PAGE_RESET_PASSWORD);
        } else {
          let backPath = route.query?.ref as string;
          router.replace(decodeURIComponent(backPath || '/'));
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return { requestLogin, loading };
};

/**
 * 密码登录
 * @returns
 */
export const useLoginWithPassword = function () {
  const { requestLogin: requestLoginOrgin, loading } = useLogin();

  const formVal = reactive({
    username: 'admin',
    password: '123456',
    verifyCode: '1111',
    verifyCodeEncrypt: '',
  });

  const isverify = ref(false);
  const checkImg = ref('');
  const getVerifyCode = async function () {
    isverify.value = true;
    let [err, data] = await $http
      .get(resolveUrl('/user/getVerifyCode'), { _not_require_auth: true })
      .then((data) => [null, data])
      .catch((e) => [e]);
    if (data) {
      formVal.verifyCodeEncrypt = data.result.verifyCodeEncrypt;
      checkImg.value = data.result.verifyCodePic;
    }
  };

  const requestLogin = async function () {
    let time = new Date().getTime();
    // const
    let params = {
      ...formVal,
      // password: md5(md5(formVal.password + 'gyouyunissuccess') + time), //加密密码
      isPassWord: '1',
      type: 'PC',
    };
    return requestLoginOrgin(params, time).catch((err) => {
      if (['ERR_0020', 'ERR_0013', 'ERR_0011'].includes(err.resultCode)) {
        getVerifyCode();
      }
    });
  };
  return { formVal, isverify, checkImg, getVerifyCode, requestLogin, loading };
};

/**
 * 手机号登录
 * @returns
 */
export const useLoginWithPhone = function () {
  const { requestLogin, loading } = useLogin();

  const formVal = reactive({
    telephone: '',
    telVerifyCode: '',
  });
  const isGetMessageCode = ref(false);

  /**
   * 验证码提示文字
   */
  const getMessageLabel = ref('获取验证码');

  /**
   * 验证码倒计时
   */
  const cutdown = function () {
    let time = 60;
    getMessageLabel.value = time + '秒后可重新发送';
    let interval = window.setInterval(() => {
      if (time < 1) {
        isGetMessageCode.value = false;
        getMessageLabel.value = '获取验证码';
        window.clearInterval(interval);
      } else {
        time--;
        getMessageLabel.value = time + '秒后可重新发送';
      }
    }, 1000);

    onMounted(() => window.clearInterval(interval));
  };
  /**
   * 发送手机验证码
   */
  const sendVerifyCode = async function () {
    let params = { telephone: formVal.telephone };
    $http
      .get(resolveUrl('/user/sendVerifyCode'), { params, _not_require_auth: true })
      .then((data) => cutdown())
      .catch((err) => {
        console.log(err);
      });
  };

  return { getMessageLabel, isGetMessageCode, formVal, sendVerifyCode, requestLogin, loading };
};
