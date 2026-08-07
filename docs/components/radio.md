# Radio / RadioGroup 单选



互斥单选：独立 `Radio` 或 `RadioGroup`（provide/inject、`options` 声明、尺寸级联）。交互旁路 `trackEmit`（Telemetry **默认关闭**）。



## 基础用法



```vue

<script setup>

import { ref } from 'vue'

import { Radio, RadioGroup } from '@amg-webui/form'

const val = ref('a')

</script>



<template>

  <RadioGroup v-model="val" name="demo">

    <Radio value="a" label="A" />

    <Radio value="b" label="B" />

  </RadioGroup>

  <RadioGroup v-model="val" :options="[{ label: 'A', value: 'a' }]" />

</template>

```



## 交互演示

<DocsDemo name="radio-basic" />

## 常用 API



| Prop | 类型 | 默认 | 说明 |

| --- | --- | --- | --- |

| `modelValue` | `unknown` | — | 选中值（v-model） |

| `value` / `label` | `unknown` / `string` | — | Radio 选项值与文案 |

| `size` | `Size` | `'md'` | xs–xl（组可级联） |

| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | RadioGroup 排列 |

| `options` | `RadioOption[]` | — | 声明式选项 |

| `ariaLabel` | `string` | — | radiogroup 无障碍名称 |



| 事件 | 说明 |

| --- | --- |

| `update:modelValue` / `change` | 选中变化 |



> curated：`example/demos/Radio/`。表单 wave1；组容器不单独埋点，子 Radio 旁路 trackEmit。

