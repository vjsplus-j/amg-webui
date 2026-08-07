<script setup lang="ts">
</script>

<template>
  <div class="typo-scale">
    <p class="typo-scale__display">Display</p>
    <h1 class="typo-scale__h1">Heading 1</h1>
    <h2 class="typo-scale__h2">Heading 2</h2>
    <h3 class="typo-scale__h3">Heading 3</h3>
    <p class="typo-scale__body-lg">Body Large — 企业后台正文强调段。</p>
    <p class="typo-scale__body">Body — 标准阅读段落与说明文字。</p>
    <p class="typo-scale__body-sm">Body Small — 次级说明与表单辅助信息。</p>
    <p class="typo-scale__caption">Caption — 元数据 / 时间戳 / 标注</p>
    <code class="typo-scale__code">Code — ThemeService.setScheme('dark')</code>
    <p class="typo-scale__number">12,480.00</p>
    <p class="typo-scale__cjk">中文排版：敏捷的棕狐跳过懒狗。</p>
  </div>
</template>

<style scoped lang="scss">
.typo-scale {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  font-family: var(--font-family-sans);
  color: var(--text-primary);
}

.typo-scale__display {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.75rem);
  font-weight: var(--font-weight-semibold, 600);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.typo-scale__h1 {
  margin: 0;
  font-size: var(--font-size-2xl, 1.75rem);
  font-weight: var(--font-weight-semibold, 600);
}

.typo-scale__h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold, 600);
}

.typo-scale__h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold, 600);
}

.typo-scale__body-lg {
  margin: 0;
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.typo-scale__body {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}

.typo-scale__body-sm {
  margin: 0;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}

.typo-scale__caption {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary, var(--text-secondary));
}

.typo-scale__code {
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: var(--font-size-xs);
  padding: 0.15rem 0.4rem;
  background: var(--surface-2, var(--surface-elevated));
  border-radius: var(--border-radius-sm);
  width: fit-content;
}

.typo-scale__number {
  margin: 0;
  font-variant-numeric: tabular-nums;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold, 600);
}

.typo-scale__cjk {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.7;
}
</style>
