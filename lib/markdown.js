const MarkdownIt = require('markdown-it');

module.exports = function makeMarkdownRender(options = {}, plugins = []) {
  options = Object.assign({
    html: true,
    linkify: true,
    typographer: true,
  }, options);

  const md = MarkdownIt(options);
  plugins.forEach(plugin => {
    if (Array.isArray(plugin)) {
      md.use(...plugin);
    } else {
      md.use(plugin);
    }
  });
  return md;
}