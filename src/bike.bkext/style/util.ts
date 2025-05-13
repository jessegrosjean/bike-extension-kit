import { Color, Font, Image, SymbolConfiguration } from '@style'

export function symbolImage(name: string, color: Color, font: Font): Image {
  let symbol = new SymbolConfiguration(name).withHierarchicalColor(color).withFont(font)
  return Image.fromSymbol(symbol)
}
