import Vue from "vue";
import VueI18n from "vue-i18n";

//element 国际化处理
import locale from "element-ui/lib/locale";
import elEn from "element-ui/lib/locale/lang/en";
import elCn from "element-ui/lib/locale/lang/zh-CN";

Vue.use(VueI18n);

//将刚刚locales创建的文件分别引入并输出成i18n需要的格式
function loadLocaleMessages() {
  //检测locales文件夹中有多少个语系
  const locales = require.context(
    "./locales",
    true,
    /.json$/
  );
  const messages = {};
  locales.keys().forEach(file => {
    const keyArr = file.split('/');
    keyArr.shift();
    messages[keyArr.join('.').replace(/\.json$/g, '')] = locales(file);
  });
  return {
    cn: { ...messages.cn, ...elCn },
    en: { ...messages.en, ...elEn },
  };
}
const i18n = new VueI18n({
  locale: "cn" ,
  messages: loadLocaleMessages()
});
locale.i18n((key, value) => i18n.t(key, value));

export default i18n;