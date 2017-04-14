import m from 'mithril';

export default {
  view: (vnode) => {
    let instanceId  = vnode.attrs.instanceId;
    let options     = vnode.attrs.options;
    return m('.modal-footer', vnode.children);
  }
};
