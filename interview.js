let anchors = document.querySelectorAll('a')

anchors.forEach(a => {
  let spanEle = document.createElement('span')
  spanEle.appendChild(a)
  let parent = a.parentNode
  parent.replaceChild(spanEle, a)
})
