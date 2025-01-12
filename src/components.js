export default (editor, opts = {}) => {
  const domc = editor.DomComponents;

  domc.addType('rellax-content', {
    model: {
      defaults: {
        tagName: 'div',
        draggable: true,
        droppable: true,
        attributes: { class: 'rellax' },
        speed: 2,
        center: false,
        percentage: 0.5,
        vertical: true,
        horizontal: false,
        zindex: 0,
        traits: [
          {
            type: 'number',
            label: 'Speed',
            name: 'speed',
            changeProp: 1,
          },
          {
            type: 'number',
            label: 'Z-Index',
            name: 'zindex',
            changeProp: 1,
          },
          {
            type: 'checkbox',
            label: 'Center',
            name: 'center',
            changeProp: 1,
          },
          {
            type: 'number',
            label: 'Percentage',
            name: 'percentage',
            changeProp: 1,
            step: 0.1,
          },
          {
            type: 'checkbox',
            label: 'Vertical',
            name: 'vertical',
            changeProp: 1,
          },
          {
            type: 'checkbox',
            label: 'Horizontal',
            name: 'horizontal',
            changeProp: 1,
          },
        ],
      },
      init() {
        this.listenTo(this, 'change:speed change:center change:percentage change:vertical change:horizontal change:zindex', this.updateAttributes);
      },
      updateAttributes() {
        const { speed, center, percentage, vertical, horizontal, zindex } = this.attributes;
        this.view.el.setAttribute('data-rellax-speed', speed);
        if (center) {
          this.view.el.setAttribute('data-rellax-percentage', percentage);
        } else {
          this.view.el.removeAttribute('data-rellax-percentage');
        }
        this.view.el.setAttribute('data-rellax-vertical', vertical);
        this.view.el.setAttribute('data-rellax-horizontal', horizontal);
        if (typeof zindex === 'number') {
          this.view.el.setAttribute('data-rellax-zindex', zindex);
        } else {
          this.view.el.removeAttribute('data-rellax-zindex');
        }
      },
    },
    view: {
      init() {
        this.model.updateAttributes();
      },
      onRender() {
        this.model.updateAttributes();
      },
    },
  });
};
