<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Skeleton } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const contentReady = ref(false)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'loading',
    description: t('example.doc.skeleton.prop.loading'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'variant',
    description: t('example.doc.skeleton.prop.variant'),
    type: "'text' | 'paragraph' | 'image' | 'rect' | 'circle' | 'avatar' | 'card' | 'list-item' | 'page'",
    defaultValue: "'text'"
  },
  {
    name: 'rows',
    description: t('example.doc.skeleton.prop.rows'),
    type: 'number',
    defaultValue: '3'
  },
  {
    name: 'animated / animation',
    description: t('example.doc.skeleton.prop.animation'),
    type: "boolean / 'shimmer' | 'pulse' | false",
    defaultValue: "true / 'shimmer'"
  },
  {
    name: 'size',
    description: t('example.doc.skeleton.prop.size'),
    type: 'Size | number | string',
    defaultValue: '-'
  },
  {
    name: 'width / height',
    description: t('example.doc.skeleton.prop.dimension'),
    type: 'string | number | array',
    defaultValue: '-'
  },
  {
    name: 'round',
    description: t('example.doc.skeleton.prop.round'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const codePage = `<Skeleton variant="page" :loading="homeLoading" :rows="5">
  <HomeDashboard />
</Skeleton>`

const homeLoading = ref(true)

function replayHomeLoad() {
  homeLoading.value = true
  window.setTimeout(() => {
    homeLoading.value = false
  }, 1400)
}

replayHomeLoad()

const codeText = `<Skeleton :rows="1" width="40%" />
<Skeleton :rows="1" />`

const codeParagraph = `<Skeleton variant="paragraph" :rows="4" />
<Skeleton :rows="3" :width="['100%', '90%', '72%']" />`

const codeImage = `<Skeleton variant="circle" size="lg" />
<Skeleton variant="image" height="var(--height-xl)" />
<Skeleton variant="rect" round width="40%" height="var(--height-xl)" />`

const codeCard = `<Skeleton variant="card" :rows="3" />`

const codeList = `<Skeleton variant="list-item" :rows="2" size="md" />`

const codeAnim = `<Skeleton animated animation="shimmer" :rows="2" />
<Skeleton animation="pulse" :rows="2" />
<Skeleton :animated="false" :rows="2" />`

const codeSwitch = `<Skeleton :loading="!ready">
  <p>{{ content }}</p>
</Skeleton>`

function toggleContent() {
  contentReady.value = !contentReady.value
}
</script>

<template>
  <div class="vp-curated">
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
      :title="t('example.doc.skeleton.demo.text')"
      :description="t('example.doc.skeleton.demo.textDesc')"
      :code="codeText"
    >
      <div class="vp-skel-stack">
        <Skeleton :rows="1" width="40%" :aria-label="t('example.doc.skeleton.sample.title')" />
        <Skeleton :rows="1" :aria-label="t('example.doc.skeleton.sample.line')" />
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-skel-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 28rem;
}

.vp-skel-page {
  width: 100%;
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
