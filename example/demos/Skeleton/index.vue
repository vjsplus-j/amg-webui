<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { Button, Card, Skeleton } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()

const contentReady = ref(false)
const homeLoading = ref(true)

function replayHomeLoad() {
  homeLoading.value = true
  window.setTimeout(() => {
    homeLoading.value = false
  }, 1400)
}

replayHomeLoad()

function toggleContent() {
  contentReady.value = !contentReady.value
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Skeleton } from '@amg-webui/core'`],
  template: [
    `  <Skeleton`,
    `    :rows="1"`,
    `    width="40%"`,
    `    :aria-label="t('example.doc.skeleton.sample.title')"`,
    `  />`,
    `  <Skeleton`,
    `    :rows="1"`,
    `    :aria-label="t('example.doc.skeleton.sample.line')"`,
    `  />`
  ]
})

const codePage = demoCode(
  `<Skeleton`,
  `  variant="page"`,
  `  :rows="5"`,
  `  :loading="homeLoading"`,
  `  :aria-label="t('example.doc.skeleton.sample.page')"`,
  `>`,
  `  <p>{{ t('example.doc.skeleton.sample.homeReady') }}</p>`,
  `</Skeleton>`
)

const codeParagraph = demoCode(
  `<Skeleton variant="paragraph" :rows="4" />`,
  `<Skeleton :rows="3" :width="['100%', '90%', '72%']" />`
)

const codeImage = demoCode(
  `<Skeleton variant="circle" size="lg" />`,
  `<Skeleton variant="circle" size="md" />`,
  `<Skeleton variant="image" height="calc(var(--height-xl) * 2)" />`,
  `<Skeleton variant="rect" round width="100%" height="var(--height-xl)" />`
)

const codeList = demoCode(
  `<Skeleton variant="list-item" :rows="2" size="md" />`,
  `<Skeleton variant="list-item" :rows="2" size="md" />`,
  `<Skeleton variant="list-item" :rows="2" size="md" />`
)

const codeCard = demoCode(
  `<Skeleton variant="card" :rows="3" />`,
  `<Skeleton variant="card" :rows="2" />`
)

const codeAnim = demoCode(
  `<Skeleton animated animation="shimmer" :rows="2" />`,
  `<Skeleton animation="pulse" :rows="2" />`,
  `<Skeleton :animated="false" :rows="2" />`
)

const codeSwitch = demoCode(
  `<Skeleton :loading="!ready">`,
  `  <p>{{ t('example.doc.skeleton.sample.contentBody') }}</p>`,
  `</Skeleton>`
)

const codeSlots = demoCode(
  `<!-- default slot = real content when loading=false -->`,
  `<Skeleton :loading="false">`,
  `  <p>{{ t('example.doc.skeleton.sample.contentBody') }}</p>`,
  `</Skeleton>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.skeleton.demo.basic')"
      :description="t('example.doc.skeleton.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-skel-stack">
        <Skeleton :rows="1" width="40%" :aria-label="t('example.doc.skeleton.sample.title')" />
        <Skeleton :rows="1" :aria-label="t('example.doc.skeleton.sample.line')" />
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.skeleton.demo.page')"
      :description="t('example.doc.skeleton.demo.pageDesc')"
      :code="codePage"
    >
      <div class="vp-skel-home">
        <div class="vp-skel-home__bar">
          <Button size="sm" variant="outlined" @click="replayHomeLoad">
            {{ t('example.doc.skeleton.sample.replayHome') }}
          </Button>
        </div>
        <Skeleton
          variant="page"
          :rows="5"
          :loading="homeLoading"
          :aria-label="t('example.doc.skeleton.sample.page')"
        >
          <div class="vp-skel-home__ready">
            <p class="vp-skel-content">{{ t('example.doc.skeleton.sample.homeReady') }}</p>
          </div>
        </Skeleton>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.paragraph')"
      :description="t('example.doc.skeleton.demo.paragraphDesc')"
      :code="codeParagraph"
    >
      <div class="vp-skel-stack">
        <Skeleton variant="paragraph" :rows="4" />
        <Skeleton :rows="3" :width="['100%', '90%', '72%']" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.image')"
      :description="t('example.doc.skeleton.demo.imageDesc')"
      :code="codeImage"
    >
      <div class="vp-skel-row">
        <Skeleton variant="circle" size="lg" />
        <Skeleton variant="circle" size="md" />
        <div class="vp-skel-block">
          <Skeleton variant="image" height="calc(var(--height-xl) * 2)" />
        </div>
        <div class="vp-skel-block vp-skel-block--narrow">
          <Skeleton variant="rect" round width="100%" height="var(--height-xl)" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.list')"
      :description="t('example.doc.skeleton.demo.listDesc')"
      :code="codeList"
    >
      <div class="vp-skel-stack">
        <Skeleton variant="list-item" :rows="2" size="md" />
        <Skeleton variant="list-item" :rows="2" size="md" />
        <Skeleton variant="list-item" :rows="2" size="md" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.card')"
      :description="t('example.doc.skeleton.demo.cardDesc')"
      :code="codeCard"
    >
      <div class="vp-skel-cards">
        <Skeleton variant="card" :rows="3" />
        <Skeleton variant="card" :rows="2" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.animation')"
      :description="t('example.doc.skeleton.demo.animationDesc')"
      :code="codeAnim"
    >
      <div class="vp-skel-stack">
        <Skeleton animated animation="shimmer" :rows="2" />
        <Skeleton animation="pulse" :rows="2" />
        <Skeleton :animated="false" :rows="2" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.skeleton.demo.switch')"
      :description="t('example.doc.skeleton.demo.switchDesc')"
      :code="codeSwitch"
    >
      <div class="vp-skel-stack">
        <Button size="sm" variant="outlined" @click="toggleContent">
          {{
            contentReady
              ? t('example.doc.skeleton.sample.showSkeleton')
              : t('example.doc.skeleton.sample.showContent')
          }}
        </Button>
        <Card>
          <Skeleton :loading="!contentReady">
            <p class="vp-skel-content">{{ t('example.doc.skeleton.sample.contentBody') }}</p>
          </Skeleton>
        </Card>
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.skeleton.demo.slots')"
      :description="t('example.doc.skeleton.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Skeleton :loading="false">
        <p class="vp-skel-content">{{ t('example.doc.skeleton.sample.contentBody') }}</p>
      </Skeleton>
    </DemoBlock>

    <!-- 4. API: Props → Events → Slots -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}
.vp-skel-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 28rem;
}

.vp-skel-home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-skel-home__bar {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.vp-skel-home__ready {
  min-height: calc(var(--height-xl) * 4);
  display: flex;
  align-items: center;
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}

.vp-skel-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-skel-block {
  flex: 1 1 12rem;
  min-width: 10rem;
  max-width: 16rem;
}

.vp-skel-block--narrow {
  flex: 0 0 6rem;
  min-width: 6rem;
  max-width: 6rem;
}

.vp-skel-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.vp-skel-content {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}
</style>
