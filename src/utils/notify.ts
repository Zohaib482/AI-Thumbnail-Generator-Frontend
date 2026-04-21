import { toast } from 'vue3-toastify'

const longMessage = (ms: number) => Math.min(18_000, Math.max(5000, ms))

export function notifySuccess(message: string) {
  toast.success(message, { autoClose: 4000 })
}

export function notifyError(message: string) {
  toast.error(message, { autoClose: longMessage(message.length * 45) })
}

export function notifyWarning(message: string) {
  toast.warning(message, { autoClose: 6000 })
}

export function notifyInfo(message: string) {
  toast.info(message, { autoClose: 5000 })
}
