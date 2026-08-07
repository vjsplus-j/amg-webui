<script setup lang="ts">
import { Card, Descriptions, DescriptionsItem, PageHeader } from 'amg-webui'
import { mockVideoStreamInfo } from '@showcase/shared/mock-api/video-surveillance'

const info = mockVideoStreamInfo
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Stream info" />

    <Card title="Active stream — Lobby Cam">
      <Descriptions :column="2">
        <DescriptionsItem label="Channel">{{ info.channelId }}</DescriptionsItem>
        <DescriptionsItem label="Protocol">{{ info.protocol }}</DescriptionsItem>
        <DescriptionsItem label="URL">{{ info.url }}</DescriptionsItem>
        <DescriptionsItem label="Latency">{{ info.latency }}</DescriptionsItem>
        <DescriptionsItem label="FPS">{{ info.fps }}</DescriptionsItem>
        <DescriptionsItem label="Keyframe interval">{{ info.keyframe }}</DescriptionsItem>
        <DescriptionsItem label="Packets lost">{{ info.packetsLost }}</DescriptionsItem>
      </Descriptions>
    </Card>
  </div>
</template>
