import Binding from "weex-bindingx";
import { Utils } from './utils.js';

const BindEnv = {
  supportsEB () {
    return Binding.isSupportBinding
  },

  /**
   * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
   * @returns {boolean}
   */
  supportsEBForAndroid () {
    return Utils.env.isAndroid() && BindEnv.supportsEB();
  },

  /**
   * 判断IOS容器是否支持是否支持expressionBinding
   * @returns {boolean}
   */
  supportsEBForIos () {
    return Utils.env.isIOS() && BindEnv.supportsEB();
  }
};

export default BindEnv;
