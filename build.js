const path = require('path')
const fs = require('fs-extra')

const regExp = /^\d+\.\s/
const distDir = path.join(__dirname, 'dist')

// 编译首页
async function buildHome(mdFiles) {
  const sourcePath = path.join(__dirname, 'README.md')
  const outputPath = path.join(distDir, 'index.md')

  const mdContent = await fs.readFile(sourcePath)

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
  await fs.outputFile(outputPath, mdText)
}

/**
 * 编译章节
 * @param {*} file
 */
async function buildChapter(file) {
  const sourceDir = path.join(__dirname, file)
  const outputPath = path.join(distDir, file)

  await fs.copy(sourceDir, outputPath, {
    recursive: true
  })

  const fullPath = path.join(sourceDir, 'README.md')
  const mdContent = await fs.readFile(fullPath)
  await fs.remove(path.join(outputPath, 'README.md'))

  const mdText = `---
layout: default
title: ${file.split('.')[1]}
nav_order: ${file.split('.')[0]}
permalink: /${encodeURIComponent(file)}/
---

${mdContent}
`

  await fs.outputFile(path.join(outputPath, 'index.md'), mdText)
}

fs.remove(distDir)
  .then(() => fs.readdir(__dirname))
  .then(async files => {
    const mdFiles = files.filter(file => regExp.test(file))

    // 编译首页
    await buildHome(mdFiles)
    await Promise.all(mdFiles.map(buildChapter))
  })
  .then(async () => {
    await fs.copy(path.join(__dirname, 'common'), path.join(distDir, 'common'))
    await fs.copy(path.join(__dirname, '_includes'), path.join(distDir, '_includes'))
    await fs.copy(path.join(__dirname, '_config.yml'), path.join(distDir, '_config.yml'))
  })
