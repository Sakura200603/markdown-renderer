const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// 获取pandoc路径
const pandocPath = path.join(__dirname, 'resources', 'pandoc.exe');

// 创建一个临时markdown文件，包含各种元素以便生成参考文档
const tempMdPath = path.join(__dirname, 'temp-reference.md');
const referenceDocPath = path.join(__dirname, 'custom-reference.docx');

// 创建一个包含各种元素的markdown文件
const referenceContent = `
# 标题1

## 标题2

### 标题3

正文内容示例，这是一个段落。

这是另一个段落，用于设置段落样式。

* 无序列表项1
* 无序列表项2
  * 嵌套列表项

1. 有序列表项1
2. 有序列表项2

> 这是一个引用块

\`\`\`
这是一个代码块
\`\`\`

**粗体文本** *斜体文本*

[链接文本](https://example.com)

$E = mc^2$ 行内公式

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

| 表格标题1 | 表格标题2 |
|----------|----------|
| 单元格1   | 单元格2   |
| 单元格3   | 单元格4   |
`;

// 写入临时markdown文件
fs.writeFileSync(tempMdPath, referenceContent);

// 使用pandoc生成参考文档
const command = `"${pandocPath}" "${tempMdPath}" -o "${referenceDocPath}" -t docx --print-default-data-file=reference.docx`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error('生成参考文档失败:', err);
    console.error('错误输出:', stderr);
    console.error('标准输出:', stdout);
  } else {
    console.log('成功生成参考文档:', referenceDocPath);
  }
  
  // 清理临时文件
  if (fs.existsSync(tempMdPath)) {
    fs.unlinkSync(tempMdPath);
  }
});