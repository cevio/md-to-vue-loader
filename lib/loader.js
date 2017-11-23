const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const loadUtils = require('loader-utils');
const Markdown = require('./markdown');

module.exports = function(content, map) {
  const resourcePath = this.resourcePath;
  const dir = path.dirname(resourcePath);
  const chunkOptions = loadUtils.getOptions(this) || {};
  const options = this.options;
  const resolves = options.resolve || {};
  const alias = options.alias || {};
  const markdownOptions = chunkOptions.markdown || {};
  const markdown = Markdown(markdownOptions.options, markdownOptions.plugins);
  const $ = cheerio.load(markdown.render(content), {
    decodeEntities: true,
    lowerCaseTags: false,
  });
  const components = [];
  const imports = [];
  const previews = $('preview');

  for (let i = 0; i < previews.length; i++) {
    resolvePreviewModule(previews[i], i);
  }

  const template = $('body').html();
  const componentsList = components.map(cmp => `"${cmp}": ${cmp}`);
  const sourceWrapReative = path.relative(dir, chunkOptions.codeWrap);

  this.callback(null, codeHTML(template, scriptHTML(sourceWrapReative, componentsList)), map);


  function resolvePreviewModule(preview, index) {
    const file = $(preview).attr('file');
    if (!file) return;
    let filePath = path.resolve(dir, file);
    if (!/^\.|\~/.test(file)) {
      const fileSpilts = file.split('/');
      const name = fileSpilts[0];
      const extra = fileSpilts.slice(1).join('/');
      if (alias[name]) {
        filePath = path.resolve(alias[name], extra);
      }
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const tree = resolveVueModule(fileContent);
    imports.push(`import component_${index} from '${file}';`);
    components.push(`component_${index}`);
    $(preview).replaceWith(previewHTML(tree, index));
  }

  function resolveVueModule(content) {
    const children = $(content);
    const tree = {};
    for (let j = 0; j < children.length; j++) {
      switch (children[j].name) {
        case 'template':
          tree.template = markdown.render(childRenderHTML($(children[j]).html()));
          break;
        case 'script':
          tree.script = markdown.render(childRenderVUE($(children[j]).html()));
          break;
        case 'subscribe':
          tree.subscribe = markdown.render($(children[j]).text());
          tree.title = $(children[j]).attr('title');
          break;
      }
    }
    return tree;
  }

  function previewHTML(tree, index) {
    return `<preview>
      <div slot="template" class="preview-template">${tree.template}</div>
      <div slot="script" class="preview-script">${tree.script}</div>
      <div slot="subscribe" class="preview-subsribe">${tree.subscribe}</div>
      <div slot="title" class="preview-title">${tree.title}</div>
      <component_${index}></component_${index}>
    </preview>`;
  }

  function scriptHTML(sourceWrapReative, _components) {
    return `import Preview from '${sourceWrapReative}';
    ${imports.join('\n')}
    export default {
      components: {
        preview: Preview,
        ${_components.join(',')}
      }
    }`
  }

  function codeHTML(template, script) {
    return `<template>
      <div class="box">
        ${template}
      </div>
    </template>
    <script>
      ${script}
    </script>`
  }

  function childRenderHTML(code) {
    return '```html\n' + code + '\n```';
  }

  function childRenderVUE(code) {
    return '```vue\n' + code + '\n```';
  }
}