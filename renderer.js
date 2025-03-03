const marked = require('marked');
// 引入marked库，用于将Markdown文本解析成HTML

const fs = require('fs-extra');
// 引入fs-extra库，提供文件系统的扩展功能

const { exec } = require('child_process');
// 引入Node.js的child_process模块，用于执行系统命令

const path = require('path');
// 引入path模块，用于处理和转换文件路径

const { dialog } = require('@electron/remote');
// 从Electron的remote模块中引入dialog，界面用来选择文件保存路径

const hljs = require('highlight.js');
// 引入highlight.js库，用于代码语法高亮显示

// 配置marked库，使用highlight.js来高亮代码块
marked.setOptions({
  highlight: function (code, lang) {
    // 检查代码块是否指定了语言且highlight.js是否支持该语言
    if (lang && hljs.getLanguage(lang)) {
      // 使用highlight.js对指定语言的代码块进行高亮
      return hljs.highlight(code, { language: lang }).value;
    }
    // 如果代码块没有指定语言或语言不受支持，则自动检测语言进行高亮
    return hljs.highlightAuto(code).value;
  },
  // 启用表格支持
  gfm: true,
  tables: true
});

const pandocPath = path.join(__dirname, 'resources', 'pandoc.exe');
// 拼接出pandoc可执行文件的路径

const editor = document.getElementById('editor');
// 获取页面中ID为'editor'的元素，作为Markdown编辑器

const preview = document.getElementById('preview');
// 获取页面中ID为'preview'的元素，用于展示转换后的HTML内容

// 验证pandoc是否存在
if (!fs.existsSync(pandocPath)) {
  console.error('Pandoc not found at:', pandocPath);
  // 如果pandoc路径不存在，输出错误信息
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  // 返回一个函数，防止在短时间内多次触发
  return function (...args) {
    // 清除先前的计时器
    clearTimeout(timeout);
    // 设置新的计时器
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 实时渲染Markdown文本
editor.addEventListener('input', debounce(() => {
  const markdownText = editor.value;
  // 获取编辑器的Markdown文本
  const html = marked.parse(markdownText);
  // 使用marked解析Markdown文本成HTML
  preview.innerHTML = html;
  // 将解析后的HTML显示在预览区
  
  // 确保MathJax已经加载并正确初始化
  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    // 如果MathJax可用，重新排版数学公式
    MathJax.typesetPromise()
      .catch(err => console.error('MathJax Error: ', err));
  } else {
    console.warn('MathJax not available or not fully loaded');
    // 如果MathJax不可用或未加载完全，输出警告信息
  }
}, 300)); // 等待300毫秒后再执行函数

// 导出到Markdown文件
function exportMarkdown() {
  const savePath = dialog.showSaveDialogSync({
    filters: [{ name: 'Markdown Files', extensions: ['md'] }],
    // 仅显示Markdown文件类型
    defaultPath: 'output.md'
    // 默认文件名为output.md
  });
  if (!savePath) return;
  // 如果用户取消保存操作，直接返回
  
  try {
    // 将编辑器内容写入到指定的路径
    fs.writeFileSync(savePath, editor.value);
    alert('Exported to ' + savePath);
    // 弹出提示，导出成功
  } catch (err) {
    console.error('Markdown Export Failed: ', err);
    // 如果写入文件失败，输出错误信息
    alert('Export failed: ' + err.message);
    // 弹出错误提示
  }
}

// 导出到DOCX文件
function exportDocx() {
  const savePath = dialog.showSaveDialogSync({
    filters: [{ name: 'Word Documents', extensions: ['docx'] }],
    // 仅显示Word文档文件类型
    defaultPath: 'output.docx'
    // 默认文件名为output.docx
  });
  if (!savePath) return;
  // 如果用户取消保存操作，直接返回

  const inputMd = path.join(__dirname, 'temp.md');
  // 定义临时Markdown文件路径
  const filterPath = path.join(__dirname, 'math-to-text.lua');
  // 定义Lua过滤器文件路径

  // 验证所需文件是否存在
  if (!fs.existsSync(pandocPath)) {
    console.error('Pandoc executable not found at:', pandocPath);
    alert('Export failed: Pandoc executable not found');
    // 如果pandoc不存在，输出错误并弹出提示
    return;
  }

  if (!fs.existsSync(filterPath)) {
    console.error('Lua filter not found at:', filterPath);
    alert('Export failed: Lua filter not found');
    // 如果Lua过滤器不存在，输出错误并弹出提示
    return;
  }

  try {
    // 写入临时markdown文件
    fs.writeFileSync(inputMd, editor.value);
    const referenceDocPath = path.join(__dirname, 'custom-reference.docx');
    const command = `"${pandocPath}" "${inputMd}" -o "${savePath}" --lua-filter="${filterPath}" --standalone -t docx --reference-doc="${referenceDocPath}"`;
    // 定义pandoc转换命令
    console.log('Executing Pandoc command:', command);
    // 输出正在执行的命令

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('Pandoc execution error:', err);
        console.error('Pandoc stderr:', stderr);
        console.error('Pandoc stdout:', stdout);
        // 如果命令执行失败，输出错误信息
        alert(`Export failed: ${err.message}\n\nPlease check the console for more details.`);
        // 弹出错误提示
        // 清理临时文件
        if (fs.existsSync(inputMd)) fs.unlinkSync(inputMd);
        // 删除临时文件
        return;
      }
      
      console.log('Pandoc execution successful');
      // 输出操作成功信息
      alert('Successfully exported to ' + savePath);
      // 弹出成功提示
      // 清理临时文件
      if (fs.existsSync(inputMd)) fs.unlinkSync(inputMd);
      // 删除临时文件
    });
  } catch (err) {
    console.error('Export process error:', err);
    // 如果写入或执行过程出错，输出错误信息
    alert('Export failed: ' + err.message);
    // 弹出错误提示
    // 清理临时文件
    if (fs.existsSync(inputMd)) fs.unlinkSync(inputMd);
    // 删除临时文件
  }
}