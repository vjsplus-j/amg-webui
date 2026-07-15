#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const leads = {
  'zh-TW': {
    'component.simple404.lead': '您造訪的頁面不存在。',
    'component.cartoon404.lead': '哎呀！頁面走丟了。',
    'component.tech404.lead': '訊號遺失，路由未找到。',
    'component.business404.lead': '該報表連結已失效。',
    'component.doodle404.lead': '草圖未找到——走錯路了！',
    'component.space404.lead': '迷失太空——這裡沒有頁面。',
    'component.ink404.lead': '墨跡已淡——頁面缺失。',
    'component.pixel404.lead': '關卡未找到，遊戲結束？',
    'component.plant404.lead': '這條路還沒長出來。',
    'component.machine404.lead': '齒輪卡住——頁面不可用。',
  },
  'ja-JP': {
    'component.simple404.lead': 'お探しのページは存在しません。',
    'component.cartoon404.lead': 'おっと！ページが迷子になりました。',
    'component.tech404.lead': '信号ロスト。ルートが見つかりません。',
    'component.business404.lead': 'このレポートリンクは無効です。',
    'component.doodle404.lead': 'スケッチが見つかりません——道を間違えました！',
    'component.space404.lead': '宇宙で迷子——ページがありません。',
    'component.ink404.lead': 'インクが薄れました——ページがありません。',
    'component.pixel404.lead': 'ステージが見つかりません。ゲームオーバー？',
    'component.plant404.lead': 'この道はまだ育っていません。',
    'component.machine404.lead': 'ギアが詰まりました——ページは利用できません。',
  },
  'ko-KR': {
    'component.simple404.lead': '찾으시는 페이지가 존재하지 않습니다.',
    'component.cartoon404.lead': '앗! 페이지가 길을 잃었습니다.',
    'component.tech404.lead': '신호 손실. 경로를 찾을 수 없습니다.',
    'component.business404.lead': '이 보고서 링크는 더 이상 사용할 수 없습니다.',
    'component.doodle404.lead': '스케치를 찾을 수 없습니다 — 잘못된 길!',
    'component.space404.lead': '우주에서 길을 잃었습니다 — 페이지가 없습니다.',
    'component.ink404.lead': '잉크가 희미해졌습니다 — 페이지가 없습니다.',
    'component.pixel404.lead': '스테이지를 찾을 수 없습니다. 게임 오버?',
    'component.plant404.lead': '이 길은 아직 자라지 않았습니다.',
    'component.machine404.lead': '기어가 걸렸습니다 — 페이지를 사용할 수 없습니다.',
  },
  'ko-KP': {
    'component.simple404.lead': '찾으시는 페이지가 존재하지 않습니다.',
    'component.cartoon404.lead': '앗! 페이지가 길을 잃었습니다.',
    'component.tech404.lead': '신호 손실. 경로를 찾을 수 없습니다.',
    'component.business404.lead': '이 보고서 링크는 더 이상 사용할 수 없습니다.',
    'component.doodle404.lead': '스케치를 찾을 수 없습니다 — 잘못된 길!',
    'component.space404.lead': '우주에서 길을 잃었습니다 — 페이지가 없습니다.',
    'component.ink404.lead': '잉크가 희미해졌습니다 — 페이지가 없습니다.',
    'component.pixel404.lead': '스테이지를 찾을 수 없습니다. 게임 오버?',
    'component.plant404.lead': '이 길은 아직 자라지 않았습니다.',
    'component.machine404.lead': '기어가 걸렸습니다 — 페이지를 사용할 수 없습니다.',
  },
  'ru-RU': {
    'component.simple404.lead': 'Запрашиваемая страница не существует.',
    'component.cartoon404.lead': 'Упс! Страница потерялась.',
    'component.tech404.lead': 'Сигнал потерян. Маршрут не найден.',
    'component.business404.lead': 'Ссылка на отчёт больше недоступна.',
    'component.doodle404.lead': 'Эскиз не найден — неверный поворот!',
    'component.space404.lead': 'Потерялись в космосе — страницы нет.',
    'component.ink404.lead': 'Чернила выцвели — страница отсутствует.',
    'component.pixel404.lead': 'Уровень не найден. Конец игры?',
    'component.plant404.lead': 'Эта тропа ещё не выросла.',
    'component.machine404.lead': 'Шестерёнка заклинило — страница недоступна.',
  },
}

for (const [locale, map] of Object.entries(leads)) {
  const fp = path.join(ROOT, `packages/locale/${locale}/component.ts`)
  let src = fs.readFileSync(fp, 'utf8')
  for (const [key, val] of Object.entries(map)) {
    const re = new RegExp(`'${key}': '[^']*'`)
    if (re.test(src)) src = src.replace(re, `'${key}': '${val}'`)
  }
  fs.writeFileSync(fp, src, 'utf8')
  console.log(`✓ ${locale} 404 leads`)
}
