import { toast } from 'vue-sonner'

type ApiStatusType = string | string[] | { message: string } | { message: string }[]

const BASE = 'toast-glass'

const classes = {
  base: {
    toast: BASE,
    title: `${BASE}__title`,
    description: `${BASE}__desc`,
    closeButton: `${BASE}__close`,
  },
  success: { toast: `${BASE} ${BASE}--success` },
  error: { toast: `${BASE} ${BASE}--error` },
  warning: { toast: `${BASE} ${BASE}--warning` },
  info: { toast: `${BASE} ${BASE}--info` },
  loading: { toast: `${BASE} ${BASE}--loading` },
}

const opts = { unstyled: true, closeButton: true }

export const useToast = () => {
  const normalizeStatusMessage = (error: ApiStatusType): string => {
    if (typeof error === 'string') return error

    if (Array.isArray(error)) {
      return error.map((item) => (typeof item === 'string' ? item : item.message)).join(', ')
    }

    return error.message
  }

  const showError = (error: ApiStatusType) =>
    toast.error(normalizeStatusMessage(error), {
      ...opts,
      classes: { ...classes.base, ...classes.error },
    })

  const showSuccess = (response: ApiStatusType) =>
    toast.success(normalizeStatusMessage(response), {
      ...opts,
      classes: { ...classes.base, ...classes.success },
    })

  const showWarning = (message: ApiStatusType) =>
    toast.warning(normalizeStatusMessage(message), {
      ...opts,
      classes: { ...classes.base, ...classes.warning },
    })

  const showInfo = (message: ApiStatusType) =>
    toast.info(normalizeStatusMessage(message), {
      ...opts,
      classes: { ...classes.base, ...classes.info },
    })

  return { showError, showSuccess, showWarning, showInfo }
}
