import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'

import {
  VAlert,
  VApp,
  VAppBar,
  VAvatar,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VDialog,
  VDivider,
  VExpandTransition,
  VForm,
  VIcon,
  VList,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
  VMain,
  VMenu,
  VProgressCircular,
  VProgressLinear,
  VRow,
  VSheet,
  VSnackbar,
  VSpacer,
  VTextField,
  VDataTable,
  VTooltip,
} from 'vuetify/components'

export default createVuetify({
  components: {
    VAlert,
    VApp,
    VAppBar,
    VAvatar,
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VChip,
    VCol,
    VDialog,
    VDivider,
    VExpandTransition,
    VForm,
    VIcon,
    VList,
    VListItem,
    VListItemSubtitle,
    VListItemTitle,
    VMain,
    VMenu,
    VProgressCircular,
    VProgressLinear,
    VRow,
    VSheet,
    VSnackbar,
    VSpacer,
    VTextField,
    VTooltip,
    VDataTable,
  },

  locale: {
    locale: 'pt',
    messages: {
      pt: {
        ...pt,
        dataFooter: {
          itemsPerPageText: 'Itens por página',
          itemsPerPageAll: 'Todos',
          pageText: '{0}-{1} de {2}',
        },
      },
    },
  },

  icons: {
    defaultSet: 'mdi',
  },

  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1A4D2E',
          secondary: '#D4A843',
          background: '#F8F8F5',
          surface: '#FFFFFF',
          error: '#D32F2F',
          info: '#2196F3',
          success: '#388E3C',
          warning: '#FB8C00',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#1A1A1A',
          'on-surface': '#1A1A1A',
          'on-error': '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2D8A5A',
          secondary: '#D4A82E',
          background: '#121212',
          surface: '#1E1E1E',
          error: '#EF5350',
          info: '#64B5F6',
          success: '#66BB6A',
          warning: '#FFB74D',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#E8E8E8',
          'on-surface': '#E8E8E8',
          'on-error': '#FFFFFF',
        },
      },
    },
  },

  defaults: {
    VBtn: {
      variant: 'flat',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
      elevation: 1,
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg',
    },
  },
})