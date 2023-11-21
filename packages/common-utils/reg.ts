import { isNull } from 'lodash-es';
// 邮箱
const emailReg = /^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export { emailReg };

// 座机电话
const landlineReg = /0\d{2,3}-*\d{7,8}/;
export { landlineReg };

// 传真
const faxReg = /^(\d{3,4}-)?\d{7,8}$/;
export { faxReg };

// 手机号码
const phoneReg = /^1[3456789]\d{9}$/;
export { phoneReg };

// 银行卡号
const bankCardReg = /^\d{19}$/;
export { bankCardReg };

// 邮政编码
const postalCodeReg = /^\d{6}$/;
export { postalCodeReg };

// 身份证
const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
export { idCardReg };

// 社会信用码
// const creditCodeReg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
const creditCodeReg = /^[A-Za-z0-9]{18}$/;
export { creditCodeReg };

// 字母or数字
const lettersAndNumReg = /^[A-Za-z0-9]+$/;
export { lettersAndNumReg };

// 必须以_、字母或中文开头
const firstLetterReg = /^[_A-Za-z\u4e00-\u9fa5]/;
export { firstLetterReg };

/** el-form 验证方法 */
// 座机电话
const landlineValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || landlineReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { landlineValid };

// 传真
const faxValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || faxReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { faxValid };

// 邮箱
const emailValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || emailReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { emailValid };

// 手机号码
const phoneValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || phoneReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { phoneValid };

// 银行卡号
const bankCardValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || bankCardReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { bankCardValid };

// 银行卡号
const postalCodeValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || postalCodeReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { postalCodeValid };

// 身份证
const idCardValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || idCardReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { idCardValid };

// 社会信用码
const creditCodeValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || creditCodeReg.test(val)) {
    callback();
  } else {
    callback(new Error(''));
  }
};
export { creditCodeValid };

// 数字和字母
const lettersAndNumValid = function (rule, val, callback) {
  if (val === '' || isNull(val) || lettersAndNumReg.test(val)) {
    callback();
  } else {
    callback(new Error('只能输入数字、字母组合'));
  }
};

export { lettersAndNumValid };

// 必须以_、字母或中文开头
const firstLetterValid = function (rule, val, callback) {
  console.log(val, firstLetterReg.test(val));
  if (val === '' || isNull(val) || firstLetterReg.test(val)) {
    callback();
  } else {
    callback(new Error('必须以_、字母或中文开头'));
  }
};

export { firstLetterValid };
