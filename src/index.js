import loadComponents from './components';
import loadBlocks from './blocks';
import en from './locale/en';

export default (editor, opts = {}) => {
  const options = { ...{
    i18n: {},
    // default options
    rellaxCDN: 'https://cdn.jsdelivr.net/gh/dixonandmoe/rellax@master/rellax.min.js',
  },  ...opts };

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
  // Load i18n files
  editor.I18n && editor.I18n.addMessages({
      en,
      ...options.i18n,
  });

  const appendRellax = async (frame) => {
    const iframe = frame.view.getEl();

    const init = () => {
      if (iframe.contentWindow.rellax && typeof iframe.contentWindow.rellax.destroy === 'function') {
        iframe.contentWindow.rellax.destroy();
      }
      try {
        // Suppress warning about missing elements
        const originalWarn = iframe.contentWindow.console.warn;
        iframe.contentWindow.console.warn = (message) => {
          if (!message.includes("The elements you're trying to select don't exist.")) {
            originalWarn(message);
          }
        };
        iframe.contentWindow.rellax = new iframe.contentWindow.Rellax('.rellax');
        // Restore original console.warn
        iframe.contentWindow.console.warn = originalWarn;
      }
      catch (e) {}
    }

    if (!iframe) {
      return;
    }

    const rellaxScript = document.createElement('script');
    rellaxScript.src = options.rellaxCDN;
    rellaxScript.onload = init

    // check if iframe is ready before appending script
    const f = setInterval(() => {
      const doc = iframe.contentDocument;
      if (doc && doc.readyState && doc.readyState === 'complete') {
        doc.head.appendChild(rellaxScript);
        clearInterval(f);
      }
    }, 100)
  }

  const reinitializeRellax = () => {
    const frame = editor.Canvas.getFrameEl();
    if (frame) {
      appendRellax({ view: { getEl: () => frame } });
    }
  }

  editor.Canvas.getModel()['on']('change:frames', (m, frames) => {
    frames.forEach(frame => frame.once('loaded', () => appendRellax(frame)));
  });

  // Listen for changes to elements and reinitialize Rellax
  editor.on('component:update', (model) => {
    reinitializeRellax();
  });

  // Update Rellax when a new block is dropped
  editor.on('block:drag:stop', (model) => {
    reinitializeRellax();
  });

  // Reinitialize Rellax when component attributes are updated
  editor.on('component:styleUpdate', (model) => {
    reinitializeRellax();
  });
};