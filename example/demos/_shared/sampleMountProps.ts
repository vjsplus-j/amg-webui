import { LocaleKeys, LocaleService, type LocaleKey } from "@amg-webui/locale";
import type { CanvasNodeData } from "@amg-webui/utils";
import type { NavItem } from "@amg-webui/utils/nav";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80">
      <rect width="120" height="80" fill="%23e8eaed"/>
      <text x="60" y="44" text-anchor="middle" font-size="12" fill="%236b7280">preview</text>
    </svg>`,
  );

const PLACEHOLDER_VIDEO =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
      <rect width="320" height="180" fill="%23111827"/>
      <polygon points="140,70 140,110 180,90" fill="%23f9fafb"/>
    </svg>`,
  );

function t(key: LocaleKey, params?: Record<string, string | number>) {
  return LocaleService.t(key, params);
}

function sampleTree() {
  return [
    {
      label: "A",
      value: "a",
      children: [
        { label: "A1", value: "a1" },
        { label: "A2", value: "a2" },
      ],
    },
    { label: "B", value: "b", children: [{ label: "B1", value: "b1" }] },
  ];
}

function sampleRows() {
  return [
    { id: 1, name: "demo-01", status: "online", value: 12 },
    { id: 2, name: "demo-02", status: "offline", value: 28 },
    { id: 3, name: "demo-03", status: "online", value: 18 },
  ];
}

function sampleNavItems(): NavItem[] {
  return [
    { label: t("biz.name"), value: "a", icon: "User", badge: 12 },
    { label: t("biz.status"), value: "b", icon: "Activity", badge: 4 },
    { label: t("biz.email"), value: "c", icon: "Mail" },
  ];
}

function sampleGroupNavItems(): NavItem[] {
  return [
    {
      label: t("biz.name"),
      children: [
        { label: "A1", value: "a1" },
        { label: "A2", value: "a2" },
      ],
    },
    {
      label: t("biz.status"),
      children: [{ label: "B1", value: "b1" }],
    },
  ];
}

function sampleColumns() {
  return [
    { field: "id", header: "ID" },
    { field: "name", header: t("biz.name") },
    { field: "status", header: t("biz.status") },
  ];
}

function sampleSelectOptions() {
  return [
    { label: t("biz.name"), value: "name" },
    { label: t("biz.status"), value: "status" },
    { label: t("biz.email"), value: "email" },
  ];
}

function sampleRadioOptions() {
  return [
    { label: t("biz.name"), value: "name" },
    { label: t("biz.status"), value: "status" },
    { label: t("biz.email"), value: "email" },
  ];
}

function sampleTransferData() {
  return [
    { key: "a", label: t("biz.name") },
    { key: "b", label: t("biz.status") },
    { key: "c", label: t("biz.email") },
  ];
}

function sampleChartData() {
  return [40, 65, 30, 80, 55, 70];
}

function sampleCanvasNode(): CanvasNodeData {
  return {
    id: "n1",
    type: "default",
    x: 24,
    y: 24,
    w: 120,
    h: 48,
    label: "Node",
    props: {},
  };
}

function sampleTimelineItems() {
  return [
    {
      itemKey: "created",
      title: t(LocaleKeys.exampleDoc.fallbackSampleTitle),
      description: t("component.timeline.pending"),
      time: "09:00",
      timestamp: "09:00",
      type: "success",
    },
    {
      itemKey: "review",
      title: t("biz.status"),
      time: "10:30",
      timestamp: "10:30",
      type: "primary",
    },
    {
      itemKey: "notice",
      title: t("biz.email"),
      time: "14:00",
      timestamp: "14:00",
      type: "info",
    },
  ];
}

function sampleBreadcrumbItems() {
  return [
    { label: t("nav.base"), to: "/" },
    { label: t("biz.name"), to: "/list" },
    { label: t("biz.status") },
  ];
}

function sampleStepItems() {
  return [
    {
      label: t("biz.name"),
      value: 0,
      description: t("component.vertical-step-nav.lead"),
    },
    {
      label: t("biz.status"),
      value: 1,
      description: t("component.step-nav.lead"),
    },
    { label: t("biz.email"), value: 2 },
  ];
}

function sampleDescriptionsItems() {
  return [
    { label: t("biz.name"), value: "demo-01" },
    { label: t("biz.status"), value: t("common.success") },
    { label: t("biz.email"), value: "demo@example.com" },
  ];
}

export type SampleMountContext = {
  componentName: string;
};

/**
 * Safe default props for bare-mount component doc previews.
 * Mirrors ComponentDocPage mountProps with expanded special-cases.
 */
export function getSampleMountProps(
  componentName: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const name = componentName;
  const sampleTitle = t(LocaleKeys.exampleDoc.fallbackSampleTitle);
  const sampleBody = t(LocaleKeys.exampleDoc.fallbackSampleBody);
  const tree = sampleTree();
  const rows = sampleRows();
  const navItems = sampleNavItems();

  const props: Record<string, unknown> = {
    options: tree,
    data: tree,
    treeData: tree,
    slides: rows,
    items: navItems,
    columns: sampleColumns(),
    rows,
    value: rows,
    fields: sampleSelectOptions(),
    suggestions: ["alpha", "beta", "demo"],
    placeholder: t("common.search"),
    src: PLACEHOLDER_IMAGE,
    poster: PLACEHOLDER_IMAGE,
    url: PLACEHOLDER_IMAGE,
    message: sampleBody,
    text: sampleBody,
    title: sampleTitle,
    content: sampleBody,
    label: sampleTitle,
    name: "demo-field",
    modelValue: name.includes("Tag") || name.includes("Checkbox") ? [] : "",
    ...extra,
  };

  // Overlays / feedback — start open in fallback preview; host must bind v-model
  // (static visible:true alone makes cancel/close appear broken)
  if (
    /Dialog|Drawer|Confirm|Toast|Notification|Loading|Mask|Modal/i.test(name)
  ) {
    props.visible = true;
    props.open = true;
  }
  if (/Toast|Notification|Message/i.test(name)) {
    props.duration = 0;
    props.autoHide = false;
  }
  if (name === "Loading") {
    props.fullscreen = false;
    props.cancellable = true;
    props.progress = 40;
    props.label = sampleTitle;
  }
  if (name === "Link") {
    props.ariaLabel = sampleTitle;
    props.href = "#";
  }
  if (name === "Pagination") {
    props.total = 100;
    props.page = 1;
    props.pageSize = 10;
    props.pageSizes = [10, 20, 50];
  }
  if (/Progress|LoadingTip|ProgressTip/i.test(name)) {
    props.ariaLabel = props.ariaLabel ?? sampleTitle;
    props.percentage = props.percentage ?? 64;
    props.progress = 64;
  }
  if (name === "Statistic") {
    props.value = 128_450;
    props.ariaLabel = props.ariaLabel ?? sampleTitle;
  }
  if (
    /Thumbnail|Image|ImageUpload|ImageCrop|ImageGroup|FilePreview|PdfPreview/i.test(
      name,
    )
  ) {
    props.alt = sampleTitle;
    props.src = PLACEHOLDER_IMAGE;
  }
  if (/Video|Vcr|SplitVideo/i.test(name)) {
    props.src = PLACEHOLDER_VIDEO;
    props.poster = PLACEHOLDER_VIDEO;
  }
  if (name === "VideoSnapshot") props.src = undefined;

  // Inputs
  if (
    /Select|Cascader|AutoComplete|Search|Input|Password|Textarea|Picker|Mention|TagInput|ColorInput|RangeInput|TimeRangeInput/i.test(
      name,
    )
  ) {
    if (!("modelValue" in extra)) {
      props.modelValue = undefined;
    }
    props.ariaLabel = props.ariaLabel ?? sampleTitle;
    props.placeholder = props.placeholder ?? sampleTitle;
  }
  if (name === "Slider") {
    props.modelValue = 40;
  }
  if (name === "Rate") {
    props.modelValue = 3;
    props.allowHalf = true;
    props.clearable = true;
    props.showScore = true;
  }
  if (name === "Barcode" || name === "Qrcode" || name === "MatrixCode") {
    props.modelValue = "AMG-WEBUI-2026";
    props.value = "AMG-WEBUI-2026";
  }
  if (name === "Countdown") {
    props.value = Date.now() + 86_400_000;
  }
  if (name === "FilterBar" || name === "AdvancedSearch") {
    props.modelValue = [];
  }
  if (/Upload/i.test(name)) {
    props.modelValue = [];
  }

  // Nav family
  if (/Nav$/i.test(name) || /Nav[A-Z]/.test(name)) {
    props.items = /GroupNav|ScrollNav|RouterNav/i.test(name)
      ? sampleGroupNavItems()
      : navItems;
    props.modelValue = navItems[0]?.value ?? "a";
  }

  // Tables
  if (
    /Table|DataTable|ProTable|EditTable|MergeTable|DrillTable|PivotTable|StickyTable|VirtualTable|TreeTable/i.test(
      name,
    )
  ) {
    props.columns = sampleColumns();
    props.rows = rows;
    props.data = rows;
  }
  if (name === "PivotTable") {
    props.rowField = "status";
    props.columnField = "name";
    props.valueField = "value";
    props.showColumnTotals = true;
  }
  if (name === "TableDrag") {
    props.modelValue = undefined;
    props.rowKey = "id";
  }
  if (name === "MergeTable") {
    props.rows = [rows[0], rows[2], rows[1]];
    props.data = props.rows;
    props.mergeField = "status";
    props.rowKey = "id";
    props.striped = true;
  }
  if (name === "DataCard") {
    props.value = 128600;
    props.data = undefined;
    props.icon = "ChartNoAxesCombined";
    props.suffix = "CNY";
    props.trend = 12.8;
    props.progress = 72;
    props.clickable = true;
  }
  if (name === "Calendar") props.modelValue = "2026-08-04";
  if (name === "NoticeBar") {
    props.scrollable = true;
    props.closable = true;
    props.actionText = t(LocaleKeys.button.confirm);
  }
  if (name === "LoadingTip") {
    props.loading = true;
    props.progress = 64;
    props.cancellable = true;
  }
  if (name === "StatusTip") {
    props.severity = "success";
    props.actionText = t(LocaleKeys.button.confirm);
    props.block = true;
  }
  if (name === "Tooltip") {
    props.trigger = "click";
    props.placement = "top";
  }

  // Tree family
  if (/Tree/i.test(name)) {
    props.options = tree;
    props.data = tree;
    props.modelValue = [];
  }

  // Charts
  if (/Chart|Gauge|HeatMap|WordCloud|Ranking|Radar/i.test(name)) {
    props.data = sampleChartData();
  }
  if (name === "PieChart") {
    props.data = sampleChartData()
      .slice(0, 4)
      .map((value, index) => ({
        key: index,
        label: sampleSelectOptions()[index]?.label ?? String(index + 1),
        value,
      }));
    props.modelValue = 0;
    props.innerRadius = 32;
    props.showLabels = true;
  }

  // Canvas
  if (
    /CanvasNode|DragSortNode|CanvasLayer|CanvasPreview|DragCanvas|CanvasIo/i.test(
      name,
    )
  ) {
    props.node = sampleCanvasNode();
    props.nodes = [sampleCanvasNode()];
    props.width = 480;
    props.height = 320;
  }
  if (name === "DragSortNode" || name === "CanvasPreview") {
    props.nodes = [
      sampleCanvasNode(),
      {
        ...sampleCanvasNode(),
        id: "n2",
        label: `${sampleTitle} 2`,
        x: 180,
        y: 96,
        w: 160,
        h: 72,
      },
      {
        ...sampleCanvasNode(),
        id: "n3",
        label: `${sampleTitle} 3`,
        x: 64,
        y: 210,
        w: 200,
        h: 56,
      },
    ];
    props.canvasWidth = 480;
    props.canvasHeight = 320;
  }

  if (name === "GbsSignMonitor") {
    props.logs = [
      {
        id: "register",
        type: "REGISTER",
        message: "SIP/2.0 200 OK",
        time: "10:00:01",
        direction: "in",
        status: 200,
      },
      {
        id: "keepalive",
        type: "KEEPALIVE",
        message: "MESSAGE sip:3402000000",
        time: "10:00:31",
        direction: "out",
      },
    ];
  }
  if (name === "GbsAlarmModal") {
    props.open = true;
    props.alarm = {
      id: "alarm-01",
      deviceName: "IPC-01",
      channelName: "CH-01",
      time: "2026-08-05 10:30:00",
      severity: "danger",
      details: { protocol: "GB/T 28181" },
    };
  }

  if (name === "VcrStorageDashboard") {
    props.volumes = [
      { id: "raid-01", name: "RAID-01", used: 7200, total: 10000 },
      {
        id: "raid-02",
        name: "RAID-02",
        used: 7600,
        total: 8000,
        status: "warning",
      },
    ];
  }

  // Transfer
  if (/Transfer/i.test(name)) {
    props.data = sampleTransferData();
    props.modelValue = [];
    props.source = sampleTransferData();
    props.target = [];
  }

  // Radio / checkbox groups
  if (/RadioGroup|CheckboxGroup/i.test(name)) {
    props.options = sampleRadioOptions();
    props.modelValue = name.includes("Checkbox") ? [] : "name";
  }

  if (name === "Segmented") {
    props.options = sampleRadioOptions().map((o) => ({
      label: o.label,
      value: o.value,
    }));
    props.modelValue = "name";
  }
  if (name === "Mention") {
    props.options = [
      { label: "Alice", value: "alice" },
      { label: "Bob", value: "bob" },
    ];
    props.modelValue = "";
  }
  if (name === "Tour") {
    props.open = false;
    props.steps = [
      { target: "body", title: sampleTitle, description: sampleBody },
    ];
  }
  if (name === "ImageViewer") {
    props.visible = false;
    props.urlList = [PLACEHOLDER_IMAGE];
  }
  if (name === "TimeSelect") {
    props.modelValue = "09:00";
  }
  if (name === "InputOTP") {
    props.modelValue = "";
    props.length = 6;
  }
  if (name === "InfiniteScroll") {
    props.loading = false;
    props.finished = false;
  }

  if (name === "DragMaterial") {
    props.materials = [
      { type: "button", label: t(LocaleKeys.button.confirm), group: "base" },
      { type: "input", label: t("common.search"), group: "base" },
      { type: "card", label: sampleTitle, group: "layout" },
    ];
    props.searchable = true;
  }

  // Timeline / steps / breadcrumb
  if (/Timeline/i.test(name)) {
    props.items = sampleTimelineItems();
  }
  if (name === "TimelineList") {
    props.items = sampleTimelineItems().map((item, index) => ({
      ...item,
      id: item.itemKey,
      time: `2026-08-0${index + 4} ${item.time}`,
      status: index === 0 ? "success" : index === 1 ? "warning" : "info",
    }));
    props.modelValue = "review";
    props.collapsible = true;
    props.pending = true;
  }
  if (name === "Timeline") {
    props.selectable = true;
    props.modelValue = "review";
    props.pending = true;
  }
  if (/Steps|StepNav|VerticalStepNav/i.test(name)) {
    props.items = sampleStepItems();
    props.active = 0;
    props.modelValue = 0;
  }
  if (/Breadcrumb/i.test(name)) {
    props.items = sampleBreadcrumbItems();
  }
  if (/Descriptions/i.test(name)) {
    props.items = sampleDescriptionsItems();
  }

  // Forms / panels with schema
  if (
    /DynamicForm|TreeForm|StepForm|SearchFilterPanel|PermissionPanel|SettingPanel|PropPanel|DetailPanel|LoginPanel|BatchPanel/i.test(
      name,
    )
  ) {
    props.modelValue = {};
    props.schema = [];
    props.fields = sampleSelectOptions();
  }

  // 404 pages — no required props; ensure title for a11y
  if (/404$/i.test(name)) {
    props.title = sampleTitle;
  }

  // Carousel
  if (name === "Carousel") {
    props.items = rows.map((row, index) => ({
      key: row.id,
      label: `${sampleTitle} ${index + 1}`,
    }));
  }

  // Card lists
  if (/CardList|CardGrid|Waterfall/i.test(name)) {
    props.items = rows;
    props.data = rows;
  }
  if (name === "Waterfall") {
    props.items = rows.map((row, index) => ({
      id: row.id,
      title: row.name,
      description: `${t("biz.status")}: ${row.status}`,
      image: PLACEHOLDER_IMAGE,
      height: 120 + index * 40,
    }));
    props.columns = 3;
    props.clickable = true;
  }

  return props;
}
