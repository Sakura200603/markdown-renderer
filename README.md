# Markdown 渲染器

一个基于 Electron 的 Markdown 编辑器和渲染器，支持实时预览、LaTeX 数学公式渲染、代码高亮以及导出为 Markdown 和 Word 文档格式。
（新手小白的练手项目，佬勿喷QWQ）

## 功能特点

- 实时 Markdown 预览
- LaTeX 数学公式支持（行内公式和块级公式）
- 代码语法高亮
- 导出为 Markdown 文件
- 导出为 Word 文档（.docx 格式）
- 简洁美观的界面
- 支持自定义 Word 导出样式

## 安装步骤

1. 克隆项目到本地：
```bash
git clone https://github.com/Sakura200603/markdown-renderer
cd markdown-renderer
```

2. 安装依赖：
```bash
npm install
```

3. **重要：下载 Pandoc**
   - 从 [Pandoc 官方仓库](https://github.com/jgm/pandoc) 下载最新版本的 pandoc.exe（压缩包中解压的）
   - 将下载的 pandoc.exe 文件放入项目的 `resources` 文件夹中

## 使用方法

1. 启动应用：
```bash
npm start
```

2. 在左侧编辑区输入 Markdown 文本，右侧会实时显示渲染效果

3. 支持的功能：
   - 输入 LaTeX 公式：使用 `$公式$`（行内公式）或 `$$公式$$`（块级公式）
   - 代码高亮：在代码块中指定语言
   ```javascript
   ```javascript
   console.log('Hello World');
   ```
   ```

4. 导出文档：
   - 点击「导出为 Markdown」按钮将内容保存为 .md 文件
   - 点击「导出为 DOCX」按钮将内容导出为 Word 文档

## 注意事项

- 首次使用前必须下载 pandoc.exe 并放入 resources 文件夹，否则无法使用导出为 Word 功能
- Word 导出功能依赖于 Pandoc，请确保 pandoc.exe 正确放置
- 如需自定义 Word 导出样式，可修改 custom-reference.docx 文件

## 技术栈

- Electron
- Marked.js（Markdown 解析）
- MathJax（数学公式渲染）
- Highlight.js（代码高亮）
- Pandoc（Word 文档转换）

## 许可证

MIT License