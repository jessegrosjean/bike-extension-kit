interface SFSymbolOptions {
  weight?: 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black'
  scale?: 'small' | 'medium' | 'large'
}

/** Returns a URL string for the named SF Symbol. */
declare function symbolURL(name: string, options?: SFSymbolOptions): string
