module.exports = {
  input: [
    "src/**/*.jsx",
    "!src/pages/intelligence/IntelligenceMap.jsx"
  ],

  output: "./",

  options: {
    func: {
      list: ["t", "i18n.t"],
      extensions: [".jsx"],
    },

    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      extensions: [".jsx"],
    },

    lngs: ["en", "ar"],
    defaultLng: "en",
    defaultValue: "__STRING_NOT_TRANSLATED__",

    resource: {
      loadPath: "src/locales/{{lng}}/translation.json",
      savePath: "src/locales/{{lng}}/translation.json",
    },

    nsSeparator: false,
    keySeparator: false,

    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
  },
};