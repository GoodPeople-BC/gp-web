export const doCopy = (text: string) => {
  if (navigator.clipboard) {
    // 크롬 66버전 이상
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('클립보드에 복사되었습니다.')
      })
      .catch(() => {
        alert('복사를 다시 시도해주세요.')
      })
  } else {
    // copy 기능 사용이 어려운 경우 return
    if (!document.queryCommandSupported('copy')) {
      return alert('복사하기가 지원되지 않는 브라우저입니다.')
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
    alert('클립보드에 복사되었습니다.')
  }
}
