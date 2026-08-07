import type { LocaleKey } from './message-schema'

/** Nested namespace whose leaves must be valid LocaleKey (compile-fail otherwise). */
type LocaleKeyTree = LocaleKey | { readonly [key: string]: LocaleKeyTree }

/** Canonical message keys — prefer these over raw strings */
export const LocaleKeys = {
  common: {
    loading: 'common.loading',
    unknown: 'common.unknown',
    yes: 'common.yes',
    no: 'common.no',
    all: 'common.all',
    search: 'common.search',
    actions: 'common.actions',
    admin: 'common.admin',
    user: 'common.user',
    expandMenu: 'common.expandMenu',
    collapseMenu: 'common.collapseMenu',
    close: 'common.close',
    closeTab: 'common.closeTab',
    openTabs: 'common.openTabs',
    success: 'common.success',
    optional: 'common.optional',
    noData: 'common.noData',
    backTop: 'common.backTop',
    copy: 'common.copy',
    copied: 'common.copied',
    more: 'common.more',
    expand: 'common.expand',
    collapse: 'common.collapse',
    sortAsc: 'common.sortAsc',
    sortDesc: 'common.sortDesc',
    export: 'common.export',
    print: 'common.print',
    previous: 'common.previous',
    next: 'common.next',
    rename: 'common.rename',
    selectAll: 'common.selectAll',
    folder: 'common.folder',
    file: 'common.file',
    total: 'common.total',
    value: 'common.value',
    rank: 'common.rank',
    drillDown: 'common.drillDown',
    drillUp: 'common.drillUp',
    pause: 'common.pause',
    play: 'common.play',
    rows: 'common.rows',
    columns: 'common.columns'
  },
  component: {
    richText: {
      toolbar: 'component.rich-text.toolbar',
      bold: 'component.rich-text.bold',
      italic: 'component.rich-text.italic',
      underline: 'component.rich-text.underline',
      list: 'component.rich-text.list',
      orderedList: 'component.rich-text.orderedList',
      heading: 'component.rich-text.heading',
      quote: 'component.rich-text.quote',
      code: 'component.rich-text.code',
      link: 'component.rich-text.link',
      linkHref: 'component.rich-text.linkHref',
      unlink: 'component.rich-text.unlink',
      pastePlain: 'component.rich-text.pastePlain',
      undo: 'component.rich-text.undo',
      redo: 'component.rich-text.redo',
      placeholder: 'component.rich-text.placeholder',
      editorAria: 'component.rich-text.editorAria'
    },
    schemaRenderer: {
      unknown: 'component.schema-renderer.unknown',
      empty: 'component.schema-renderer.empty'
    },
    stepForm: {
      title: 'component.step-form.title',
      navAria: 'component.step-form.navAria',
      lead: 'component.step-form.lead'
    },
    pagination: {
      /** Pagination nav landmark label */
      aria: 'component.pagination.aria'
    },
    timeline: {
      /** Default pending node label when `pending` is true */
      pending: 'component.timeline.pending'
    },
    colorInput: {
      aria: 'component.color-input.aria',
      pickColor: 'component.color-input.pickColor',
      placeholder: 'component.color-input.placeholder',
      invalidHex: 'component.color-input.invalidHex'
    },
    timeRangeInput: {
      start: 'component.time-range-input.start',
      end: 'component.time-range-input.end',
      clear: 'component.time-range-input.clear',
      invalidRange: 'component.time-range-input.invalidRange',
      aria: 'component.time-range-input.aria'
    },
    rangeInput: {
      aria: 'component.range-input.aria',
      start: 'component.range-input.start',
      end: 'component.range-input.end'
    },
    smsCode: {
      inputAria: 'component.sms-code.inputAria'
    },
    dragSelect: {
      listAria: 'component.drag-select.listAria',
      handleAria: 'component.drag-select.handleAria',
      clear: 'component.drag-select.clear',
      selected: 'component.drag-select.selected'
    },
    batchPanel: {
      selected: 'component.batch-panel.selected',
      empty: 'component.batch-panel.empty'
    },
    messageBox: {
      inputError: 'component.message-box.inputError'
    },
    pageHeader: {
      back: 'component.page-header.back'
    },
    segmented: {
      aria: 'component.segmented.aria'
    },
    inputOtp: {
      aria: 'component.input-otp.aria',
      /** Digit cell label — `{n}` */
      digit: 'component.input-otp.digit'
    },
    timeSelect: {
      placeholder: 'component.time-select.placeholder',
      aria: 'component.time-select.aria',
      clear: 'component.time-select.clear'
    },
    select: {
      search: 'component.select.search',
      empty: 'component.select.empty',
      listboxAria: 'component.select.listboxAria',
      aria: 'component.select.aria',
      removeTag: 'component.select.removeTag',
      /** `{count}` remaining tags */
      collapsedTags: 'component.select.collapsedTags',
      loading: 'component.select.loading',
      clear: 'component.select.clear'
    },
    dataTable: {
      title: 'component.datatable.title'
    },
    datePicker: {
      triggerAria: 'component.datepicker.triggerAria'
    },
    progress: {
      aria: 'component.progress.aria'
    },
    inputText: {
      aria: 'component.input-text.aria'
    },
    search: {
      aria: 'component.search.aria'
    },
    autocomplete: {
      aria: 'component.autocomplete.aria'
    },
    tagInput: {
      aria: 'component.tag-input.aria'
    },
    rate: {
      aria: 'component.rate.aria'
    },
    slider: {
      aria: 'component.slider.aria'
    },
    space: {
      aria: 'component.space.aria'
    },
    loadingTip: {
      progressAria: 'component.loading-tip.progressAria'
    },
    statusModal: {
      aria: 'component.status-modal.aria'
    },
    popover: {
      aria: 'component.popover.aria'
    },
    popconfirm: {
      aria: 'component.popconfirm.aria'
    },
    tree: {
      searchAria: 'component.tree.searchAria'
    },
    mention: {
      placeholder: 'component.mention.placeholder',
      listAria: 'component.mention.listAria',
      empty: 'component.mention.empty',
      loading: 'component.mention.loading',
      inputAria: 'component.mention.inputAria'
    },
    image: {
      title: 'component.image.title',
      lead: 'component.image.lead',
      altFallback: 'component.image.altFallback',
      loadError: 'component.image.loadError'
    },
    imageViewer: {
      title: 'component.image-viewer.title',
      lead: 'component.image-viewer.lead',
      aria: 'component.image-viewer.aria',
      zoomIn: 'component.image-viewer.zoomIn',
      zoomOut: 'component.image-viewer.zoomOut',
      rotate: 'component.image-viewer.rotate',
      /** `{current}` `{total}` */
      counter: 'component.image-viewer.counter',
      /** `{index}` */
      imageAlt: 'component.image-viewer.imageAlt'
    },
    tour: {
      title: 'component.tour.title',
      lead: 'component.tour.lead',
      aria: 'component.tour.aria',
      skip: 'component.tour.skip',
      finish: 'component.tour.finish',
      targetMissing: 'component.tour.targetMissing'
    },
    infiniteScroll: {
      title: 'component.infinite-scroll.title',
      lead: 'component.infinite-scroll.lead',
      loading: 'component.infinite-scroll.loading',
      finished: 'component.infinite-scroll.finished'
    },
    treeSelect: {
      placeholder: 'component.tree-select.placeholder'
    },
    cardList: {
      title: 'component.card-list.title',
      selectItem: 'component.card-list.selectItem'
    },
    statistic: {
      aria: 'component.statistic.aria'
    },
    dragVerify: {
      sliderAria: 'component.drag-verify.sliderAria'
    },
    excelIo: {
      fileAria: 'component.excel-io.fileAria'
    },
    imageCrop: {
      fileAria: 'component.image-crop.fileAria',
      canvasAria: 'component.image-crop.canvasAria'
    },
    tableExport: {
      title: 'component.table-export.title',
      searchAria: 'component.table-export.searchAria',
      selectColumn: 'component.table-export.selectColumn',
      selectRow: 'component.table-export.selectRow'
    },
    transferTree: {
      aria: 'component.transfer-tree.aria',
      searchAria: 'component.transfer-tree.searchAria',
      selectNode: 'component.transfer-tree.selectNode',
      expandNode: 'component.transfer-tree.expandNode',
      collapseNode: 'component.transfer-tree.collapseNode'
    },
    treeTransfer: {
      aria: 'component.tree-transfer.aria',
      searchAria: 'component.tree-transfer.searchAria',
      selectNode: 'component.tree-transfer.selectNode',
      expandNode: 'component.tree-transfer.expandNode',
      collapseNode: 'component.tree-transfer.collapseNode',
      moveChildren: 'component.tree-transfer.moveChildren'
    },
    templateDrag: {
      listAria: 'component.template-drag.listAria',
      optionAria: 'component.template-drag.optionAria'
    },
    dragMaterial: {
      listAria: 'component.drag-material.listAria'
    },
    timePicker: {
      clear: 'component.time-picker.clear',
      aria: 'component.time-picker.aria'
    },
    colorPicker: {
      hexInput: 'component.color-picker.hexInput'
    }
  },
  avatar: {
    /** AvatarGroup +N overflow accessible label — `{count}` */
    overflow: 'avatar.group.overflow',
    /** Joined member names in overflow tooltip — `{names}` */
    membersTooltip: 'avatar.group.membersTooltip',
    /** Locale-aware name list separator */
    listSep: 'avatar.group.listSep'
  },
  badge: {
    /** Count badge SR label — `{count}` */
    ariaCount: 'badge.aria.count',
    /** Dot badge SR label */
    ariaDot: 'badge.aria.dot'
  },
  button: {
    save: 'button.save',
    cancel: 'button.cancel',
    delete: 'button.delete',
    confirm: 'button.confirm',
    continue: 'button.continue',
    refresh: 'button.refresh',
    create: 'button.create',
    edit: 'button.edit',
    submit: 'button.submit',
    reset: 'button.reset',
    signIn: 'button.signIn',
    signOut: 'button.signOut',
    getStarted: 'button.getStarted',
    learnMore: 'button.learnMore',
    enter: 'button.enter'
  },
  page: {
    dashboardTitle: 'page.dashboard.title',
    dashboardEyebrow: 'page.dashboard.eyebrow',
    usersTitle: 'page.users.title',
    componentsTitle: 'page.components.title',
    formsTitle: 'page.forms.title',
    themeTitle: 'page.theme.title',
    themeEyebrow: 'page.theme.eyebrow',
    themeCustomTitle: 'page.themeCustom.title',
    loginTitle: 'page.login.title',
    registerTitle: 'page.register.title',
    i18nTitle: 'page.i18n.title',
    baseAtomsButton: {
      matrix: 'page.base.atoms.button.matrix',
      solid: 'page.base.atoms.button.solid',
      outlined: 'page.base.atoms.button.outlined',
      badge: 'page.base.atoms.button.badge',
      star: 'page.base.atoms.button.star',
      iconCircle: 'page.base.atoms.button.iconCircle',
      iconSquare: 'page.base.atoms.button.iconSquare',
      img: 'page.base.atoms.button.img',
      sizeXs: 'page.base.atoms.button.size.xs',
      sizeSm: 'page.base.atoms.button.size.sm',
      sizeMd: 'page.base.atoms.button.size.md',
      sizeLg: 'page.base.atoms.button.size.lg',
      sizeXl: 'page.base.atoms.button.size.xl',
      statesHint: 'page.base.atoms.button.statesHint',
      ariaIcon: 'page.base.atoms.button.ariaIcon',
      ariaImg: 'page.base.atoms.button.ariaImg'
    },
    dev: {
      config: {
        stateDraft: 'page.dev.config.state.draft',
        stateApplied: 'page.dev.config.state.applied',
        actionApply: 'page.dev.config.action.apply',
        actionValidate: 'page.dev.config.action.validate',
        actionImport: 'page.dev.config.action.import',
        statusCompleted: 'page.dev.config.status.completed',
        jsonTitle: 'page.dev.config.json.title',
        jsonHint: 'page.dev.config.json.hint',
        jsonInvalid: 'page.dev.config.json.invalid',
        jsonInvalidAt: 'page.dev.config.json.invalidAt',
        historyTitle: 'page.dev.config.history.title',
        historyInitial: 'page.dev.config.history.initial',
        historyChanged: 'page.dev.config.history.changed'
      },
      extensibility: {
        registryTitle: 'page.dev.extensibility.registry.title',
        manifestTitle: 'page.dev.extensibility.manifest.title',
        manifestHelp: 'page.dev.extensibility.manifest.help',
        manifestInvalidJson: 'page.dev.extensibility.manifest.invalidJson',
        manifestInvalidField: 'page.dev.extensibility.manifest.invalidField',
        manifestValid: 'page.dev.extensibility.manifest.valid',
        actionValidate: 'page.dev.extensibility.action.validate',
        actionRegister: 'page.dev.extensibility.action.register',
        actionImport: 'page.dev.extensibility.action.import',
        stateEnabled: 'page.dev.extensibility.state.enabled',
        stateDisabled: 'page.dev.extensibility.state.disabled',
        stateOverride: 'page.dev.extensibility.state.override',
        stateFallback: 'page.dev.extensibility.state.fallback',
        summaryRegistered: 'page.dev.extensibility.summary.registered',
        summaryEnabled: 'page.dev.extensibility.summary.enabled',
        summaryEvents: 'page.dev.extensibility.summary.events',
        eventsTitle: 'page.dev.extensibility.events.title'
      },
      bugRepro: {
        build: 'page.dev.bugRepro.build',
        buildReported: 'page.dev.bugRepro.buildReported',
        buildCandidate: 'page.dev.bugRepro.buildCandidate',
        buildFixed: 'page.dev.bugRepro.buildFixed',
        caseSelectFocus: 'page.dev.bugRepro.case.selectFocus',
        caseDialogMotion: 'page.dev.bugRepro.case.dialogMotion',
        caseVirtualCross: 'page.dev.bugRepro.case.virtualCross',
        caseTitle: 'page.dev.bugRepro.caseTitle',
        dataset: 'page.dev.bugRepro.dataset',
        environment: 'page.dev.bugRepro.environment',
        expected: 'page.dev.bugRepro.expected',
        failed: 'page.dev.bugRepro.failed',
        hardAssert: 'page.dev.bugRepro.hardAssert',
        highContrast: 'page.dev.bugRepro.highContrast',
        logs: 'page.dev.bugRepro.logs',
        reducedMotion: 'page.dev.bugRepro.reducedMotion',
        reference: 'page.dev.bugRepro.reference',
        report: 'page.dev.bugRepro.report',
        runAll: 'page.dev.bugRepro.runAll',
        stepSetup: 'page.dev.bugRepro.step.setup',
        stepReproduce: 'page.dev.bugRepro.step.reproduce',
        stepCross: 'page.dev.bugRepro.step.cross',
        viewport: 'page.dev.bugRepro.viewport'
      }
    },
    gallery: {
      openDoc: 'page.gallery.openDoc',
      maturity: {
        lead: 'page.gallery.maturity.lead',
        filter: 'page.gallery.maturity.filter',
        stub: 'page.gallery.maturity.stub',
        shell: 'page.gallery.maturity.shell',
        beta: 'page.gallery.maturity.beta',
        ready: 'page.gallery.maturity.ready',
        score: 'page.gallery.maturity.score',
        previewHint: 'page.gallery.maturity.previewHint'
      },
      v01: {
        filter: 'page.gallery.v01.filter',
        badge: 'page.gallery.v01.badge',
        hint: 'page.gallery.v01.hint'
      }
    }
  },
  tip: {
    saved: 'tip.saved',
    changesLive: 'tip.changesLive',
    welcomeBack: 'tip.welcomeBack',
    copied: 'tip.copied',
    refreshDone: 'tip.refreshDone',
    signedOut: 'tip.signedOut',
    created: 'tip.created',
    deleted: 'tip.deleted',
    updated: 'tip.updated',
    fillRequired: 'tip.fillRequired',
    formReset: 'tip.formReset',
    formSubmitted: 'tip.formSubmitted',
    hostRefreshUsers: 'tip.hostRefreshUsers',
    hostRefreshOrders: 'tip.hostRefreshOrders',
    hostRefreshContent: 'tip.hostRefreshContent',
    newContent: 'tip.newContent',
    editContent: 'tip.editContent',
    theme: 'tip.theme'
  },
  error: {
    generic: 'error.generic',
    network: 'error.network',
    unauthorized: 'error.unauthorized',
    notFound: 'error.notFound',
    validation: 'error.validation',
    required: 'error.required',
    minLength: 'error.minLength',
    maxLength: 'error.maxLength',
    pattern: 'error.pattern',
    passwordMismatch: 'error.passwordMismatch',
    invalidEmail: 'error.invalidEmail'
  },
  auth: {
    username: 'auth.username',
    password: 'auth.password',
    remember: 'auth.remember',
    noAccount: 'auth.noAccount',
    hasAccount: 'auth.hasAccount',
    loginSuccess: 'auth.loginSuccess',
    loginFailed: 'auth.loginFailed',
    registerSuccess: 'auth.registerSuccess',
    userExists: 'auth.userExists',
    register: 'auth.register',
    forgotPassword: 'auth.forgotPassword',
    sendCode: 'auth.sendCode',
    resendIn: 'auth.resendIn',
    resendCode: 'auth.resendCode',
    verifyCode: 'auth.verifyCode',
    captcha: 'auth.captcha',
    captchaPass: 'auth.captchaPass',
    captchaHint: 'auth.captchaHint',
    captchaRefresh: 'auth.captchaRefresh',
    notRobot: 'auth.notRobot',
    slideToVerify: 'auth.slideToVerify',
    newPassword: 'auth.newPassword',
    confirmPassword: 'auth.confirmPassword',
    confirmNewPassword: 'auth.confirmNewPassword',
    email: 'auth.email',
    phone: 'auth.phone',
    account: 'auth.account',
    resetPassword: 'auth.resetPassword',
    resetSuccess: 'auth.resetSuccess',
    passwordMismatch: 'auth.passwordMismatch',
    captchaRequired: 'auth.captchaRequired',
    signOut: 'auth.signOut',
    loginSubtitle: 'auth.loginSubtitle',
    registerSubtitle: 'auth.registerSubtitle',
    forgotSubtitle: 'auth.forgotSubtitle',
    rememberPassword: 'auth.rememberPassword',
    backToLogin: 'auth.backToLogin',
    minPassword: 'auth.minPassword',
    reenterPassword: 'auth.reenterPassword',
    reenterNewPassword: 'auth.reenterNewPassword',
    sendCodeNeedContact: 'auth.sendCodeNeedContact',
    sendCodeNeedAccount: 'auth.sendCodeNeedAccount',
    captchaFirst: 'auth.captchaFirst',
    welcomeTitle: 'auth.welcomeTitle',
    styleDemoTitle: 'auth.styleDemoTitle',
    styleDemoLead: 'auth.styleDemoLead',
    designBlock: 'auth.designBlock',
    iconBlock: 'auth.iconBlock',
    fontBlock: 'auth.fontBlock',
    demoAccounts: 'auth.demoAccounts',
    fontSample: 'auth.fontSample',
    agreeTermsPrefix: 'auth.agreeTermsPrefix',
    terms: 'auth.terms',
    privacy: 'auth.privacy',
    and: 'auth.and'
  },
  chrome: {
    locale: 'chrome.locale',
    design: 'chrome.design',
    icons: 'chrome.icons',
    font: 'chrome.font',
    schemeLight: 'chrome.schemeLight',
    schemeDark: 'chrome.schemeDark',
    direction: 'chrome.direction',
    dirLtr: 'chrome.dirLtr',
    dirRtl: 'chrome.dirRtl',
    primaryBtn: 'chrome.primaryBtn',
    secondaryBtn: 'chrome.secondaryBtn',
    sampleInput: 'chrome.sampleInput',
    toggle: 'chrome.toggle',
    current: 'chrome.current',
    brandFoot: 'chrome.brandFoot',
    stackLayers: 'chrome.stackLayers',
    contextCopy: 'chrome.contextCopy',
    contextPaste: 'chrome.contextPaste',
    contextSelect: 'chrome.contextSelect',
    contextSelectAll: 'chrome.contextSelectAll',
    contextInspect: 'chrome.contextInspect'
  },
  biz: {
    loginTitle: 'biz.login.title',
    usersTitle: 'biz.users.title',
    ordersTitle: 'biz.orders.title',
    contentTitle: 'biz.content.title',
    settingsTitle: 'biz.settings.title'
  },
  nav: {
    overview: 'nav.overview',
    intro: 'nav.intro',
    base: 'nav.base',
    biz: 'nav.biz',
    theme: 'nav.theme',
    i18n: 'nav.i18n',
    perf: 'nav.perf',
    lab: 'nav.lab',
    dev: 'nav.dev',
    demo: 'nav.demo',
    system: 'nav.system',
    primary: 'nav.primary',
    badge: {
      goldDod: 'nav.badge.goldDod',
      epParity: 'nav.badge.epParity',
      hot: 'nav.badge.hot',
      exclusiveNew: 'nav.badge.exclusiveNew'
    },
    baseCategory: {
      general: 'nav.base.category.general',
      layout: 'nav.base.category.layout',
      navigation: 'nav.base.category.navigation',
      dataEntry: 'nav.base.category.dataEntry',
      dataDisplay: 'nav.base.category.dataDisplay',
      feedback: 'nav.base.category.feedback',
      other: 'nav.base.category.other',
      industry: 'nav.base.category.industry'
    }
  },
  exampleDoc: {
    showCode: 'example.doc.showCode',
    hideCode: 'example.doc.hideCode',
    copyCode: 'example.doc.copyCode',
    copied: 'example.doc.copied',
    codeStyle: 'example.doc.codeStyle',
    whenToUse: 'example.doc.whenToUse',
    demos: 'example.doc.demos',
    codeDemos: 'example.doc.codeDemos',
    api: 'example.doc.api',
    props: 'example.doc.props',
    events: 'example.doc.events',
    slots: 'example.doc.slots',
    expose: 'example.doc.expose',
    models: 'example.doc.models',
    propName: 'example.doc.propName',
    propDesc: 'example.doc.propDesc',
    propType: 'example.doc.propType',
    propDefault: 'example.doc.propDefault',
    propClass: 'example.doc.propClass',
    propStyle: 'example.doc.propStyle',
    whenFallback: 'example.doc.whenFallback',
    fallbackHint: 'example.doc.fallbackHint',
    basicMount: 'example.doc.basicMount',
    basicMountDesc: 'example.doc.basicMountDesc',
    intro: {
      package: 'example.doc.intro.package',
      maturity: 'example.doc.intro.maturity',
      importPath: 'example.doc.intro.importPath',
      features: 'example.doc.intro.features',
      viewDocs: 'example.doc.intro.viewDocs'
    },
    apiDraft: 'example.doc.apiDraft',
    overview: 'example.doc.overview',
    fallbackLead: 'example.doc.fallbackLead',
    demoPending: 'example.doc.demoPending',
    fallbackSampleTitle: 'example.doc.fallback.sampleTitle',
    fallbackSampleBody: 'example.doc.fallback.sampleBody',
    safeMountErrorTitle: 'example.doc.safeMount.errorTitle',
    safeMountErrorBody: 'example.doc.safeMount.errorBody',
    inputText: { when: 'example.doc.inputText.when' },
    alert: { when: 'example.doc.alert.when' },
    dialog: { when: 'example.doc.dialog.when' }
  },
  industry: {
    common: {
      noData: 'industry.common.noData',
      noLogs: 'industry.common.noLogs',
      noAlarms: 'industry.common.noAlarms',
      noChannels: 'industry.common.noChannels',
      noTasks: 'industry.common.noTasks',
      noMarks: 'industry.common.noMarks',
      noQueue: 'industry.common.noQueue'
    },
    video: {
      play: 'industry.video.play',
      pause: 'industry.video.pause',
      mute: 'industry.video.mute',
      unmute: 'industry.video.unmute',
      fullscreen: 'industry.video.fullscreen',
      exitFullscreen: 'industry.video.exitFullscreen',
      progress: 'industry.video.progress',
      volume: 'industry.video.volume',
      brightness: 'industry.video.brightness',
      contrast: 'industry.video.contrast',
      saturation: 'industry.video.saturation',
      watermarkText: 'industry.video.watermarkText',
      snapshot: 'industry.video.snapshot',
      capture: 'industry.video.capture',
      layout1: 'industry.video.layout1',
      layout4: 'industry.video.layout4',
      layout9: 'industry.video.layout9',
      cell: 'industry.video.cell',
      noSignal: 'industry.video.noSignal'
    },
    ptz: {
      up: 'industry.ptz.up',
      down: 'industry.ptz.down',
      left: 'industry.ptz.left',
      right: 'industry.ptz.right',
      zoomIn: 'industry.ptz.zoomIn',
      zoomOut: 'industry.ptz.zoomOut',
      stop: 'industry.ptz.stop'
    },
    audioTalk: {
      start: 'industry.audioTalk.start',
      stop: 'industry.audioTalk.stop',
      talking: 'industry.audioTalk.talking',
      idle: 'industry.audioTalk.idle'
    },
    onvif: {
      discover: 'industry.onvif.discover',
      devices: 'industry.onvif.devices',
      deviceName: 'industry.onvif.deviceName',
      ip: 'industry.onvif.ip',
      port: 'industry.onvif.port',
      status: 'industry.onvif.status',
      online: 'industry.onvif.online',
      offline: 'industry.onvif.offline',
      channel: 'industry.onvif.channel',
      channelName: 'industry.onvif.channelName',
      addChannel: 'industry.onvif.addChannel',
      removeChannel: 'industry.onvif.removeChannel',
      settings: 'industry.onvif.settings',
      username: 'industry.onvif.username',
      password: 'industry.onvif.password',
      recordPlan: 'industry.onvif.recordPlan',
      schedule: 'industry.onvif.schedule',
      alarm: 'industry.onvif.alarm',
      alarmType: 'industry.onvif.alarmType',
      alarmTime: 'industry.onvif.alarmTime',
      group: 'industry.onvif.group',
      url: 'industry.onvif.url',
      testConnection: 'industry.onvif.testConnection',
      invalidProtocol: 'industry.onvif.invalidProtocol',
      noDevices: 'industry.onvif.noDevices',
      filter: 'industry.onvif.filter'
    },
    gbs: {
      gatewayId: 'industry.gbs.gatewayId',
      sipDomain: 'industry.gbs.sipDomain',
      sipPort: 'industry.gbs.sipPort',
      password: 'industry.gbs.password',
      realm: 'industry.gbs.realm',
      cascade: 'industry.gbs.cascade',
      upstream: 'industry.gbs.upstream',
      downstream: 'industry.gbs.downstream',
      signLog: 'industry.gbs.signLog',
      signType: 'industry.gbs.signType',
      register: 'industry.gbs.register',
      deviceId: 'industry.gbs.deviceId',
      expires: 'industry.gbs.expires',
      timeSync: 'industry.gbs.timeSync',
      syncNow: 'industry.gbs.syncNow',
      status: 'industry.gbs.status',
      deviceCount: 'industry.gbs.deviceCount',
      channelCount: 'industry.gbs.channelCount',
      alarmTitle: 'industry.gbs.alarmTitle',
      alarmDesc: 'industry.gbs.alarmDesc',
      acknowledge: 'industry.gbs.acknowledge',
      sipStatus: 'industry.gbs.sipStatus',
      registered: 'industry.gbs.registered',
      unregistered: 'industry.gbs.unregistered'
    },
    vcr: {
      searchDate: 'industry.vcr.searchDate',
      searchDevice: 'industry.vcr.searchDevice',
      timeline: 'industry.vcr.timeline',
      currentTime: 'industry.vcr.currentTime',
      speed: 'industry.vcr.speed',
      clipStart: 'industry.vcr.clipStart',
      clipEnd: 'industry.vcr.clipEnd',
      cut: 'industry.vcr.cut',
      download: 'industry.vcr.download',
      queue: 'industry.vcr.queue',
      backup: 'industry.vcr.backup',
      taskName: 'industry.vcr.taskName',
      mark: 'industry.vcr.mark',
      addMark: 'industry.vcr.addMark',
      storage: 'industry.vcr.storage',
      used: 'industry.vcr.used',
      total: 'industry.vcr.total',
      progress: 'industry.vcr.progress',
      pending: 'industry.vcr.pending',
      running: 'industry.vcr.running',
      done: 'industry.vcr.done'
    }
  }
} as const satisfies LocaleKeyTree

/** @deprecated Use `LocaleKey` from message-schema / package root */
export type LocaleKeyPath = LocaleKey

export type { LocaleKey }
