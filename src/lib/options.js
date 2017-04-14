export function boolOption(options, property, defaultValue) {
  return options.hasOwnProperty(property) ? options[property] : defaultValue;
}

export function getOptions(options) {
  options = options || {};
  return {
    title:              options.title || '',
    description:        options.description || '',
    fade:               boolOption(options, 'fade', true),
    large:              boolOption(options, 'large', false),
    closeButton:        boolOption(options, 'closeButton', true),
    enterCommits:       boolOption(options, 'enterCommits', true),
    closeButtonLabel:   options.closeButtonLabel || null,
    before:             options.before || null,
    after:              options.after || null,
    footer:             options.footer || null,
    modalView:          options.modalView || null,
    headerView:         options.headerView || null,
    bodyView:           options.bodyView || null,
    footerView:         options.footerView || null,
  };
}
