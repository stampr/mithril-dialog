import m from 'mithril';

import Modal from './components/modal.js';
import ModalHeader from './components/modal-header.js';
import ModalBody from './components/modal-body.js';
import ModalFooter from './components/modal-footer.js';

import $ from './lib/jquery.js';
import uniqueId from './lib/unique-id.js';
import { getOptions } from './lib/options.js';
import { attachHandlers } from './lib/handlers.js';

const MODAL_REMOVE_FALLBACK_DELAY = 1500;

export default {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,

  MODAL_REMOVE_FALLBACK_DELAY,

  oninit: (vnode) => {
    // console.log('modal oninit');
    vnode.state.instanceId    = uniqueId('dialog');
    vnode.state.visible       = false;
    vnode.state.transitioning = false;
    vnode.state.close = (event, saved) => {
      if (vnode.state.visible) {
        if (vnode.attrs.dialog.onclose) {
          vnode.attrs.dialog.onclose(event, saved);
        }
        // unless close prevented, update visibility
        if (!event.defaultPrevented) {
          vnode.attrs.dialog.model  = null;
        }
      }
    };
    vnode.state.refresh = (model) => {
      let stateVisibility       = vnode.state.visible;
      let configuredVisibility  = !!model;
      // console.log('modal refresh', {model, stateVisibility, configuredVisibility});
      if (stateVisibility !== configuredVisibility) {
        try {
          $(vnode.dom).modal(configuredVisibility ? 'show' : 'hide');
        }
        catch (err) {
          console.debug(err.stack || err);
        }
      }
    };
  },

  oncreate: (vnode) => {
    // console.log('oncreate', vnode.attrs.dialog.model, {state: vnode.state, attrs: vnode.attrs});
    attachHandlers(vnode);
    vnode.state.refresh(vnode.attrs.dialog.model);
  },

  onupdate: (vnode) => {
    // console.log('onupdate', vnode.attrs.dialog.model, {state: vnode.state, attrs: vnode.attrs});
    vnode.state.refresh(vnode.attrs.dialog.model);
  },

  onbeforeremove: (vnode) => {
    let $modal = $(vnode.dom);
    return new Promise((resolve, reject) => {
      let fallback = setTimeout(() => resolve(), MODAL_REMOVE_FALLBACK_DELAY);
      $modal.on('hidden.bs.modal', () => {
        clearTimeout(fallback);
        resolve();
      });
    });
  },

  view: (vnode) => {
    let instanceId  = vnode.state.instanceId;
    let options     = getOptions(vnode.attrs.dialog);
    // console.log('options', options);
    return m(options.modalView || Modal, { instanceId, options }, [
      m(options.headerView || ModalHeader, { instanceId, options }),
      options.before,
      m(options.bodyView || ModalBody, { instanceId, options }, vnode.children),
      options.after,
      m(options.footerView || ModalFooter, { instanceId, options }, options.footer),
    ]);
  }
}
