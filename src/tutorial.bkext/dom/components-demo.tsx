import { DOMExtensionContext } from 'bike/dom'
import { SFSymbol, Button, Label, FormRow, SegmentedControl } from 'bike/components'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'

export function activate(context: DOMExtensionContext) {
  createRoot(context.element).render(<Demo />)
}

function Demo() {
  const [segment, setSegment] = useState('one')
  const segmentItems = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
  ]

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>

      <h1>Components & Styles</h1>

      {/* SF Symbols */}
      <Section title="SFSymbol">
        <Row>
          <Label color="secondary">small:</Label>
          <SFSymbol name="star.fill" scale="small" />
          <SFSymbol name="folder" scale="small" />
          <SFSymbol name="chevron.left" scale="small" />
          <SFSymbol name="chevron.right" scale="small" />
          <SFSymbol name="checkmark.circle.fill" scale="small" />
          <SFSymbol name="gear" scale="small" />
        </Row>
        <Row>
          <Label color="secondary">medium:</Label>
          <SFSymbol name="star.fill" scale="medium" />
          <SFSymbol name="folder" scale="medium" />
          <SFSymbol name="chevron.left" scale="medium" />
          <SFSymbol name="chevron.right" scale="medium" />
          <SFSymbol name="checkmark.circle.fill" scale="medium" />
          <SFSymbol name="gear" scale="medium" />
        </Row>
        <Row>
          <Label color="secondary">large:</Label>
          <SFSymbol name="star.fill" scale="large" />
          <SFSymbol name="folder" scale="large" />
          <SFSymbol name="chevron.left" scale="large" />
          <SFSymbol name="chevron.right" scale="large" />
          <SFSymbol name="checkmark.circle.fill" scale="large" />
          <SFSymbol name="gear" scale="large" />
        </Row>
        <Row>
          <Label color="secondary">bold:</Label>
          <SFSymbol name="star.fill" weight="bold" />
          <SFSymbol name="folder" weight="bold" />
          <SFSymbol name="chevron.left" weight="bold" />
          <SFSymbol name="chevron.right" weight="bold" />
          <SFSymbol name="checkmark.circle.fill" weight="bold" />
          <SFSymbol name="gear" weight="bold" />
        </Row>
      </Section>

      {/* Buttons */}
      <Section title="Button">
        <Row>
          <Button size="mini">Mini</Button>
          <Button size="small">Small</Button>
          <Button>Regular</Button>
          <Button size="large">Large</Button>
        </Row>
        <Row>
          <Button size="mini" disabled>Disabled</Button>
          <Button size="small" disabled>Disabled</Button>
          <Button disabled>Disabled</Button>
          <Button size="large" disabled>Disabled</Button>
        </Row>
      </Section>

      {/* Labels */}
      <Section title="Label">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Label font="headline">Headline</Label>
          <Label font="subheadline">Subheadline</Label>
          <Label>Body (default)</Label>
          <Label color="secondary">Secondary color</Label>
          <Label color="tertiary">Tertiary color</Label>
          <Label font="caption">Caption</Label>
          <Label font="footnote" color="secondary">Footnote, secondary</Label>
        </div>
      </Section>

      {/* SegmentedControl */}
      <Section title="SegmentedControl">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <SegmentedControl
            size="large"
            items={segmentItems}
            value={segment}
            onChange={setSegment}
          />
          <SegmentedControl
            items={segmentItems}
            value={segment}
            onChange={setSegment}
          />
          <SegmentedControl
            size="small"
            items={segmentItems}
            value={segment}
            onChange={setSegment}
          />
          <SegmentedControl
            size="mini"
            items={segmentItems}
            value={segment}
            onChange={setSegment}
          />
        </div>
      </Section>

      {/* FormRow */}
      <Section title="FormRow">
        <FormRow label="Name">
          <input type="text" placeholder="Enter name" style={inputStyle} />
        </FormRow>
        <FormRow label="Type">
          <SegmentedControl
            size="small"
            items={[
              { value: 'body', label: 'Body' },
              { value: 'heading', label: 'Heading' },
              { value: 'task', label: 'Task' },
            ]}
            value="body"
          />
        </FormRow>
        <FormRow label="Notes">
          <Label color="secondary">Optional metadata</Label>
        </FormRow>
      </Section>

      {/* System Fonts */}
      <Section title="System Fonts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: '-apple-system-headline' }}>-apple-system-headline</span>
          <span style={{ font: '-apple-system-subheadline' }}>-apple-system-subheadline</span>
          <span style={{ font: '-apple-system-body' }}>-apple-system-body</span>
          <span style={{ font: '-apple-system-caption1' }}>-apple-system-caption1</span>
          <span style={{ font: '-apple-system-caption2' }}>-apple-system-caption2</span>
          <span style={{ font: '-apple-system-footnote' }}>-apple-system-footnote</span>
          <span style={{ font: '-apple-system-short-body' }}>-apple-system-short-body</span>
          <span style={{ font: '-apple-system-tall-body' }}>-apple-system-tall-body</span>
        </div>
      </Section>

      {/* System Colors */}
      <Section title="Text Colors">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--label)' }}>--label</span>
          <span style={{ color: 'var(--secondary-label)' }}>--secondary-label</span>
          <span style={{ color: 'var(--tertiary-label)' }}>--tertiary-label</span>
          <span style={{ color: 'var(--quaternary-label)' }}>--quaternary-label</span>
        </div>
      </Section>

      <Section title="Backgrounds">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Swatch bg="var(--background)" label="--background" />
          <Swatch bg="var(--secondary-background)" label="--secondary-background" />
          <Swatch bg="var(--tertiary-background)" label="--tertiary-background" />
        </div>
      </Section>

      <Section title="Controls & Fills">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Swatch bg="var(--control-accent)" label="--control-accent" light />
          <Swatch bg="var(--control-background)" label="--control-background" />
          <Swatch bg="var(--tertiary-fill)" label="--tertiary-fill" />
          <Swatch bg="var(--opaque-fill)" label="--opaque-fill" />
          <Swatch bg="var(--separator)" label="--separator" />
        </div>
      </Section>

      <Section title="System Hues">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {['blue', 'brown', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'].map((hue) => (
            <Swatch key={hue} bg={`var(--system-${hue})`} label={hue} light style={{ width: 64 }} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--separator)' }}>{title}</h2>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{children}</div>
}

function Swatch({ bg, label, light, style }: { bg: string; label: string; light?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: bg,
      color: light ? 'var(--alternate-selected-text)' : 'var(--label)',
      padding: '4px 8px',
      borderRadius: 4,
      border: '0.5px solid var(--separator)',
      font: '-apple-system-caption1',
      ...style,
    }}>
      {label}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  font: 'inherit',
  color: 'var(--label)',
  background: 'var(--control-background)',
  border: '0.5px solid var(--container-border)',
  borderRadius: 4,
  padding: '3px 6px',
  width: '100%',
  boxSizing: 'border-box',
}
