// 定义枚举和对应的文案
const EnumTranslations = {
  USER_STATUS: {
    ACTIVE: { zh: '激活', en: 'Active' },
    SUSPENDED: { zh: '暂停', en: 'Suspended' },
    BANNED: { zh: '禁用', en: 'Banned' }
  },
  AVAILABLE: {
    AVAILABLE: { zh: '可用', en: 'Available' },
    UNAVAILABLE: { zh: '不可用', en: 'Unavailable' }
  },
  GENDER: {
    MAN: { zh: '男', en: 'Man' },
    WOMAN: { zh: '女', en: 'Woman' },
    SECRET: { zh: '保密', en: 'Secret' }
  },
  FILE_TYPE: {
    PIC: { zh: '图片', en: 'Picture' },
    VIDEO: { zh: '视频', en: 'Video' }
  },
  MENU_TYPE: {
    MENU: { zh: '菜单', en: 'Menu' },
    BUTTON: { zh: '按钮', en: 'Button' }
  },
  REGION_LEVEL: {
    COUNTRY: { zh: '国', en: 'Country' },
    PROVINCE: { zh: '省', en: 'Province' },
    CITY: { zh: '市', en: 'City' },
    DISTRICT: { zh: '区县', en: 'District' },
    TOWN_OR_STREET: { zh: '乡镇街道', en: 'Town or street' }
  }
}

// 枚举转换函数
export function translateEnum (enumType, enumValue, lang = 'zh') {
  const translation = EnumTranslations[enumType]?.[enumValue]
  return translation ? translation[lang] : enumValue
}

export function selectOptions (enumType) {
  return Object.keys(EnumTranslations[enumType]).map(key => ({
    label: translateEnum(enumType, key, 'zh'),
    value: key
  }))
}
