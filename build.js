const path = require('path')
const fs = require('fs-extra')

const regExp = /^\d+\.\s/
const mdPath = path.join(__dirname, 'index.md')

// 编译首页
async function buildIndexMd(mdFiles) {
  const mdContent = await fs.readFile(path.join(__dirname, 'README.md'))
  const mdLinks = mdFiles.map(file => {
    return `- [${file}](${encodeURIComponent(file)})`
  })

  const mdText = `---
layout: default
title: 开始
nav_order: 0
description: "WebGL 学习例子，包含原生 WebGL 与 three.js"
permalink: /
---

${mdContent}

## 目录

${mdLinks.join('\n')}
`
  await fs.writeFile(mdPath, mdText)
}

async function buildDemoMd(file) {
  const fullPath = path.join(__dirname, file, 'README.md')
  const mdContent = await fs.readFile(fullPath)

  const mdText = `---
layout: default
title: ${file}
nav_order: ${file.split('.')[0]}
permalink: /${encodeURIComponent(file)}
---

${mdContent}
`
  await fs.writeFile(path.join(__dirname, file, 'index.md'), mdText)
}

fs.readdir(__dirname).then(async files => {
  const mdFiles = files.filter(file => regExp.test(file))

  await buildIndexMd(mdFiles)

  await Promise.all(mdFiles.map(buildDemoMd))
})
