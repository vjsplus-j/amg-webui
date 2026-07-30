# AMG-WebUI 发布子集（扩大 + 分批加厚）

> 版本契约：**0.1.3**（npm 试用包 **0.1.0**）· 源码：`example/v0.1-subset.ts`  
> Gallery「v0.1」筛选 = **Core ∪ B1 ∪ B2 ∪ B3 ∪ B4**。  
> 发包说明：[`docs/RELEASE_0.1.md`](./RELEASE_0.1.md)

## 分批策略

| 批次 | 作用 | 组件数（约） | 状态 |
|------|------|-------------|------|
| **Core** | 首发底座 | 66 | 已加厚 |
| **B1** | 表单/选择器/穿梭/轮播等 | 26（含 Core 加厚项） | **已加厚** |
| **B2** | 确认框/遮罩/虚拟表/杂项展示 | 24 | **已加厚** |
| **B3** | 布局原语/更多日期与表单/树表 | 23 | **已加厚** |
| **B4** | EP 常用面缺口（配置/命令式框/吸顶/分段/OTP/…） | 12 | **已解锁** |

## B4 清单（Gap Batch）

ConfigProvider · MessageBox · Affix · PageHeader · Segmented · InputOTP · TimeSelect · Mention · Image · ImageViewer · Tour · InfiniteScroll

## B3 清单

YearPicker · WeekPicker · QuarterPicker · RangeInput · TimeRangeInput · ColorInput · SmsCode · DragSelect · AdvancedSearch · EditTable · TreeTable · LazyTree · VirtualTree · CardGrid · FixedLayout · StackLayout · FlowLayout · Spacer · Block · Center · ScaleLayout · EmbedLayout · FormLayout  

## 金标 DoD（每批验收）

1. 无 `getSampleMountProps` 脚手架  
2. ≥2 `DemoBlock`，有交互（表单类须 `v-model`/`ref`）  
3. PropsTable + i18n 七语种  
4. `vue-tsc` 绿 · integrity 单测覆盖已解锁子集  

## 明确不做（仍非子集）

行业 GB/ONVIF/VCR/Video* · 全量图表 · 低代码画布深能力 · 编辑器（RichText/MdEditor/CodeEditor）深度。
