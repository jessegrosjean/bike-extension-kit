# Heading Levels

Style modifier that gives headings distinct sizes and colors based on their outline depth (levels 1–6).

## Style Modifier

Applies to all editor styles. Matches heading rows by `level()` and sets:

| Level | Scale | Color     |
| ----- | ----- | --------- |
| 1     | 1.6x  | Deep blue |
| 2     | 1.4x  | Teal      |
| 3     | 1.2x  | Purple    |
| 4     | 1.1x  | Amber     |
| 5     | 1.0x  | Red       |
| 6     | 0.9x  | Gray      |

Colors are applied only when the `headinglevels.bktheme` theme (or any theme defining `heading1`–`heading6` custom colors) is active.

## Theme

The included `headinglevels.bktheme` defines custom colors for each heading level using `color-contrast()` to automatically select appropriate variants for light and dark mode.

> **Note:** A separate theme file is probably overkill for a style modifier like this. You could just as easily define colors directly in the style code. The main purpose of a theme is to allow easy configuration without requiring style modification — that's mostly useful for full editor styles, not style modifiers.
