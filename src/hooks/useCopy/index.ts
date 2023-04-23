type Callback = (e?: unknown) => void

export const useCopy = (val: string, onSuccess?: Callback, onError?: Callback) => {
  const copy = async () => {
    try {
      await window.navigator.clipboard.writeText(val)
    } catch (e) {
      onError && onError(e)
    }
    onSuccess && onSuccess()
  }

  return {
    copy
  }
}
