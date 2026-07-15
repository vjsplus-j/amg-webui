import { writeFileSync } from 'node:fs'

function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const extras = {
  Simple404: '',
  Cartoon404: `
.vp-cartoon404__blob {
  width: var(--spacing-2xl);
  height: var(--spacing-2xl);
  border-radius: 50%;
  background: var(--primary-500);
  opacity: 0.35;
  margin: 0 auto var(--spacing-md);
  animation: vp-cartoon404-bounce var(--transition-slow, 0.8s) infinite;
}
@keyframes vp-cartoon404-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(var(--spacing-sm) * -1)); }
}
`,
  Tech404: `
.vp-tech404__panel { border-style: dashed; }
.vp-tech404__code {
  font-family: var(--font-family-mono, monospace);
  letter-spacing: 0.15em;
}
`,
  Business404: `
.vp-business404__chart {
  display: flex;
  gap: var(--spacing-xs);
  align-items: flex-end;
  height: var(--spacing-2xl);
  justify-content: center;
  margin-bottom: var(--spacing-md);
}
.vp-business404__bar {
  width: var(--spacing-sm);
  background: var(--primary-500);
  border-radius: var(--border-radius-sm);
}
`,
  Doodle404: `
.vp-doodle404__panel { border-style: dashed; transform: rotate(-0.5deg); }
.vp-doodle404__code {
  text-decoration: underline wavy var(--primary-500);
  font-weight: 700;
}
`,
  Space404: `
.vp-space404__panel {
  background:
    radial-gradient(circle at 30% 20%, var(--primary-500), transparent 55%),
    var(--surface-1);
}
.vp-space404__stars {
  letter-spacing: var(--spacing-sm);
  opacity: 0.6;
}
`,
  Ink404: `
.vp-ink404__panel { border-bottom: var(--spacing-xs) solid var(--primary-500); }
.vp-ink404__code { font-weight: 700; letter-spacing: 0.3em; }
`,
  Pixel404: `
.vp-pixel404__grid {
  display: grid;
  grid-template-columns: repeat(3, var(--spacing-md));
  gap: var(--spacing-xs);
  justify-content: center;
  margin-bottom: var(--spacing-md);
}
.vp-pixel404__pixel {
  width: var(--spacing-md);
  height: var(--spacing-md);
  background: var(--primary-500);
}
.vp-pixel404__pixel--off {
  opacity: 0.15;
  background: var(--text-secondary);
}
`,
  Plant404: `
.vp-plant404__leaf {
  width: var(--spacing-2xl);
  height: var(--spacing-xl);
  margin: 0 auto var(--spacing-md);
  background: var(--success-500);
  border-radius: 50% 0;
  transform: rotate(-20deg);
  opacity: 0.7;
}
`,
  Machine404: `
.vp-machine404__gear {
  font-size: var(--font-size-2xl);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}
`
}

for (const name of Object.keys(extras)) {
  const k = kebab(name)
  const scss = `.vp-${k} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);

  &__title {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 0;
    align-items: center;
    text-align: center;
    padding: var(--theme-page-pad);
  }

  &__panel {
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    padding: var(--theme-card-pad, var(--spacing-md));
    width: 100%;
  }

  &__muted {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
    justify-content: center;
  }

  &__btn,
  &__action {
    appearance: none;
    border: 1px solid transparent;
    background: var(--primary-500);
    color: var(--surface-0, var(--surface-1));
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-lg);
    cursor: pointer;
    font-size: var(--font-size-sm);
  }

  &__code {
    font-size: var(--font-size-2xl);
    letter-spacing: 0.2em;
    color: var(--text-secondary);
  }

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }
}
${extras[name]}
`
  writeFileSync(`packages/components/base/${name}/style.scss`, scss)
  console.log('wrote', name)
}
