# Switch 开关



二元开/关控件：`v-model` 布尔、尺寸 Token、加载锁定、行内开/关文案；交互旁路 `trackEmit`（Telemetry **默认关闭**）。



## 基础用法



```vue

<script setup>

import { ref } from 'vue'

import { Switch } from '@amg-webui/components/base'

const on = ref(true)

</script>



<template>

  <Switch v-model="on" />

  <Switch v-model="on" size="lg" inline-prompt />

</template>

```



## 常用 API



| Prop | 类型 | 默认 | 说明 |

| --- | --- | --- | --- |

| `modelValue` | `boolean` | `false` | 开关状态（v-model） |

| `size` | `Size` | `'md'` | xs–xl |

| `disabled` / `loading` | `boolean` | `false` | 禁用或加载中不可切换 |

| `inlinePrompt` | `boolean` | `false` | 显示开/关文案 |

| `activeText` / `inactiveText` | `string` | — | 自定义文案（缺省 `common.yes` / `common.no`） |

| `ariaLabel` | `string` | — | 无障碍名称 |



| 事件 | 说明 |

| --- | --- |

| `update:modelValue` / `change` | 状态变化 |



> 完整交互见本地 example curated demo（`example/demos/Switch/`）。属**表单 wave1**；Telemetry 默认关。

