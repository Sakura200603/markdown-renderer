-- 简化的数学公式处理过滤器

-- 保留原始的数学公式，不做任何转换
function Math(elem)
  return elem
end

-- 保留原始段落
function Para(elem)
  return elem
end

-- 保留原始代码块
function CodeBlock(elem)
  return elem
end

-- 保留原始元数据
function Meta(meta)
  return meta
end

-- 返回所有可用的过滤器函数
return {
  Math = Math,
  Para = Para,
  CodeBlock = CodeBlock,
  Meta = Meta
}
