export interface CmsArticle {
  id: string
  title: string
  author: string
  category: string
  tags: string
  status: 'published' | 'draft' | 'review'
  updatedAt: string
}

export interface CmsCategory {
  id: string
  name: string
  slug: string
  articles: number
  status: 'active' | 'hidden'
}

export interface CmsTag {
  id: string
  name: string
  slug: string
  usage: number
}

export interface CmsDraft {
  id: string
  title: string
  author: string
  wordCount: number
  savedAt: string
  status: 'editing' | 'autosaved'
}

export interface CmsPublishJob {
  id: string
  title: string
  channel: string
  scheduledAt: string
  status: 'queued' | 'publishing' | 'done' | 'failed'
}

export interface CmsMedia {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  uploadedAt: string
  status: 'ready' | 'processing'
}

export const mockCmsArticles: CmsArticle[] = [
  { id: 'a1', title: 'Q3 Product Roadmap', author: 'Alice Chen', category: 'Product', tags: 'roadmap, q3', status: 'published', updatedAt: '2026-08-06' },
  { id: 'a2', title: 'Security Best Practices', author: 'Bob Miller', category: 'Engineering', tags: 'security', status: 'published', updatedAt: '2026-08-04' },
  { id: 'a3', title: 'Customer Success Stories', author: 'Carol Sun', category: 'Marketing', tags: 'case-study', status: 'review', updatedAt: '2026-08-07' },
  { id: 'a4', title: 'API v2 Migration Guide', author: 'Dana Wu', category: 'Engineering', tags: 'api, migration', status: 'draft', updatedAt: '2026-08-07' },
  { id: 'a5', title: 'Brand Guidelines 2026', author: 'Eve Park', category: 'Brand', tags: 'design', status: 'published', updatedAt: '2026-07-28' }
]

export const mockCmsCategories: CmsCategory[] = [
  { id: 'cat1', name: 'Product', slug: 'product', articles: 24, status: 'active' },
  { id: 'cat2', name: 'Engineering', slug: 'engineering', articles: 41, status: 'active' },
  { id: 'cat3', name: 'Marketing', slug: 'marketing', articles: 18, status: 'active' },
  { id: 'cat4', name: 'Brand', slug: 'brand', articles: 6, status: 'active' },
  { id: 'cat5', name: 'Archive', slug: 'archive', articles: 120, status: 'hidden' }
]

export const mockCmsTags: CmsTag[] = [
  { id: 'tag1', name: 'roadmap', slug: 'roadmap', usage: 8 },
  { id: 'tag2', name: 'security', slug: 'security', usage: 12 },
  { id: 'tag3', name: 'api', slug: 'api', usage: 15 },
  { id: 'tag4', name: 'case-study', slug: 'case-study', usage: 5 },
  { id: 'tag5', name: 'design', slug: 'design', usage: 9 }
]

export const mockCmsDrafts: CmsDraft[] = [
  { id: 'd1', title: 'API v2 Migration Guide', author: 'Dana Wu', wordCount: 1840, savedAt: '2026-08-07T16:00:00Z', status: 'autosaved' },
  { id: 'd2', title: 'Release Notes 2.4', author: 'Alice Chen', wordCount: 620, savedAt: '2026-08-07T11:30:00Z', status: 'editing' },
  { id: 'd3', title: 'Partner Onboarding FAQ', author: 'Frank Li', wordCount: 940, savedAt: '2026-08-06T09:00:00Z', status: 'autosaved' }
]

export const mockCmsPublishJobs: CmsPublishJob[] = [
  { id: 'pj1', title: 'Customer Success Stories', channel: 'Blog', scheduledAt: '2026-08-08T09:00:00Z', status: 'queued' },
  { id: 'pj2', title: 'Weekly Newsletter #32', channel: 'Email', scheduledAt: '2026-08-08T08:00:00Z', status: 'publishing' },
  { id: 'pj3', title: 'Q3 Product Roadmap', channel: 'Blog', scheduledAt: '2026-08-06T10:00:00Z', status: 'done' },
  { id: 'pj4', title: 'Broken embed test', channel: 'Docs', scheduledAt: '2026-08-05T14:00:00Z', status: 'failed' }
]

export const mockCmsMedia: CmsMedia[] = [
  { id: 'med1', name: 'hero-banner.webp', type: 'image', size: '420 KB', uploadedAt: '2026-08-06', status: 'ready' },
  { id: 'med2', name: 'product-demo.mp4', type: 'video', size: '24 MB', uploadedAt: '2026-08-05', status: 'processing' },
  { id: 'med3', name: 'brand-kit.pdf', type: 'document', size: '2.1 MB', uploadedAt: '2026-07-30', status: 'ready' },
  { id: 'med4', name: 'team-photo.jpg', type: 'image', size: '1.8 MB', uploadedAt: '2026-07-28', status: 'ready' }
]

export const mockCmsEditorContent = `# Draft: API v2 Migration Guide

## Overview
This guide walks through migrating from API v1 to v2.

## Breaking changes
- Authentication header format updated
- Pagination uses cursor-based tokens
- Webhook payload schema version 2

## Steps
1. Rotate API keys in the developer console
2. Update client SDK to 2.x
3. Run the compatibility checker
`
