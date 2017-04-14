import m from 'mithril';
import CloseButton from './close-button.js';

export default {
  view: (vnode) => {
    let instanceId  = vnode.attrs.instanceId;
    let options     = vnode.attrs.options;
    return m('.modal-header',
      m('h5.modal-title', {
        id:               instanceId + '_title',
      }, options.title),
      m(CloseButton, { instanceId, options }),
    );
  }
};
