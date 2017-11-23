# md-to-vue-loader

它是一个将Markdown文件实时编译成Vue文件的一个loader。实现代码块实时渲染的效果。

## Webpack

安装模块：

```bash
npm install --save-dev md-to-vue-loader
npm install --save-dev vue-loader
```

webpack 配置：

```bash
{
  test: /\.md$/,
  use: ['vue-loader', {
    loader: 'md-to-vue-loader',
    options: {...options}
  }]
}
```

## Options

我们使用的是`markdown-it`来编译markdown文件。

整体结构:

```json
{
  "codeWrap": "..../.../componet-wrap-*.vue"
  "markdown": {
    "options": {},
    "plugins": []
  }
}
```

### codeWrap

代码快包裹的VUE文件地址。

此Vue文件包括以下的slot:

- `template` 存放模板HTML
- `script` 存放代码
- `describe` 存放描述
- `title` 存放描述的标题
- `default` 实时代码块

### markdown

- `options` markdown配置
- `plugins` 插件列表

## demo

### codeWrap

```vue
<template>
  <div class="preview">
    <div class="preview-code">
      <div class="preview-html"><slot name="template"></slot></div>
      <div class="preview-js"><slot name="script"></slot></div>
    </div>
    <div class="preview-subscribe"><slot name="title"></slot><slot name="subscribe"></slot></div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log('mounted');
  }
}
</script>
<style>
</style>
```

### markdown

```markdown
## Example

This is native describe!

<preview file="../demo/index.md"></preview>
<preview file="../demo/test.md"></preview>

At last, you can see it.
```

### demo.vue

```vue
<template>
  <p>Hello, World! - {{a}}</p>
</template>
<style>
.a{
  color:red;
}
</style>
<script>
export default {
  data() {
    return {
      a: 1
    }
  },
  mounted() {
    setInterval(() => this.a++, 1000);
  }
}
</script>
<subscribe>
> 测试markdown语法
</subscribe>
```

# License

[MIT](https://opensource.org/licenses/MIT) @ [evio](https://github.com/cevio)
