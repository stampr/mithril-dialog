import m from 'mithril';

export default {
  view: (vnode) => {
    let instanceId  = vnode.attrs.instanceId;
    let options     = vnode.attrs.options;
    return m('button.close[type="button"]', {
      'data-dismiss':         'modal',
      'aria-label':           options.closeButtonLabel || 'Close',
    }, m('span[aria-hidden="true"]', m.trust('&times;')));
  }
};
