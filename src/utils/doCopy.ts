export const doCopy = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Copied to clipboard.')
      })
      .catch(() => {
        alert('Please try copying again.')
      })
  } else {
    if (!document.queryCommandSupported('copy')) {
      return alert('This browser does not support copying.')
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.position = 'fixed'

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('Copied to clipboard.')
  }
}
