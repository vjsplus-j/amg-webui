# Checkbox / CheckboxGroup 多选



勾选与半选：独立 `Checkbox` 或 `CheckboxGroup`（`options`、`max`、尺寸级联）。交互旁路 `trackEmit`（Telemetry **默认关闭**）。



## 基础用法



```vue

<script setup>

import { ref } from 'vue'

import { Checkbox, CheckboxGroup } from '@amg-webui/components/base'

const ok = ref(true)

const set = ref(['read'])

</script>



<template>

  <Checkbox v-model="ok" label="Agree" />

  <Checkbox v-model="ok" indeterminate label="Partial" />

  <CheckboxGroup v-model="set" :max="2">

    <Checkbox value="read" label="Read" />

    <Checkbox value="write" label="Write" />

  </CheckboxGroup>

</template>

```



## 常用 API



| Prop | 类型 | 默认 | 说明 |

| --- | --- | --- | --- |

| `modelValue` | `boolean` / `unknown[]` | `false` / `[]` | 勾选或组选中集合 |

| `value` / `label` | `unknown` / `string` | — | 组内选项值与文案 |

| `indeterminate` | `boolean` | `false` | 半选（`aria-checked=mixed`） |

| `size` | `Size` | `'md'` | xs–xl |

| `max` | `number` | — | 组最大可选数 |

| `options` | `CheckboxOption[]` | — | 声明式选项 |

| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 组排列 |



| 事件 | 说明 |

| --- | --- |

| `update:modelValue` / `change` | 勾选变化 |



> curated：`example/demos/Checkbox/`。表单 wave1；组容器不单独埋点，子 Checkbox 旁路 trackEmit。

