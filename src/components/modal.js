import m from 'mithril';
import $ from '../lib/jquery.js';

export default {
  view: (vnode) => {
    let instanceId  = vnode.attrs.instanceId;
    let options     = vnode.attrs.options;
    return m('.modal', {
      id:                 instanceId,
      class:              !options.fade ? '' : 'fade',
      tabindex:           '-1',
      role:               'dialog',
      'aria-hidden':      'true',
      'aria-labelledby':  `${instanceId}_title`,
      'aria-describedby': options.description,
    }, m('.modal-dialog', {
      class:              !options.large ? '' : 'modal-lg',
      role:               'document'
    }, m('.modal-content', vnode.children)));
  }
};
