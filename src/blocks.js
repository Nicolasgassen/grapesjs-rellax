export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  bm.add('rellax-content', {
    label: 'Rellax Content',
    content: {
      type: 'rellax-content',
      components: [{
        type: 'text',
        tagName: 'p',
        content: 'Rellax',
      }],
    },
    media: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2L2 22h20L12 2z"/></svg>',
  });
}
