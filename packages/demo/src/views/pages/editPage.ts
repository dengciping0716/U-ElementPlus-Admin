import { landlineReg, phoneReg, emailValid, bankCardValid, phoneValid } from '@common/utils/reg';
import { isNull, map } from 'lodash-es';

export const formModel = {
  empCode: '', // 账号
  empAccount: '', // 账号
  // empType: '', // 账号类型
  empName: '', // 姓名
  telephone: '', // 手机号码
  cardNum: '', // 身份证
  validStartDate: '', // 开始
  validEndDate: '', // 结束
  // political: '', // 政治面貌
  // officePhone: '', // 办公电话
  // email: '', // 电子邮箱
  // married: '2', // 是否婚配
  // culture: '', // 文化程度
  // postalAddress: '', // 通信地址
  remark: '', // 备注
  sex: '男', //性别,
  telVerifyCode: '',
};

export type FormModel = Partial<typeof formModel> & {
  empId?: string;
} & Recordable;

/** 手机/座机号码验证 */
function validPhone(rule: any, val: any, callback: any) {
  if (isNull(val) || landlineReg.test(val) || phoneReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
}
var cardNumValid = (rule: any, value: any, callback: any) => {
  if (value.length == 15 || value.length == 18) {
    callback();
  } else {
    callback(new Error('请输入正确身份证号码'));
  }
};

export let rules = {
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
  empCode: [{ required: true, message: '请输入用户编码', trigger: 'blur' }],
  empType: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
  empAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  empName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  cardNum: [
    { required: true, message: '请输入身份证', trigger: 'blur' },
    { validator: cardNumValid, message: '请输入正确身份证号码', trigger: 'blur' },
  ],
  telephone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: phoneValid, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: emailValid, message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  officePhone: [
    { required: true, message: ' ', trigger: 'blur' },
    { validator: validPhone, message: '请输入正确手机/座机号码', trigger: 'blur' },
  ],

  homePhone: [
    { required: true, message: ' ', trigger: 'blur' },
    { validator: validPhone, message: '请输入正确手机/座机号码', trigger: 'blur' },
  ],
  bankCardNo: [
    { required: true, message: ' ', trigger: 'blur' },
    { validator: bankCardValid, message: '请输入正确的银行卡号', trigger: 'blur' },
  ],
  isSendCodeTwo: [{ required: true, message: '请输入验证码 ', trigger: 'blur' }],
};
