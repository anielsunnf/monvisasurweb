import { describe, expect, it } from 'vitest'
import { uiTranslations } from './uiTranslations'

describe('UI translation coverage', () => {
  it('contains the same UI keys for every supported language', () => {
    const languages = Object.keys(uiTranslations)
    const referenceKeys = Object.keys(uiTranslations.fr).sort()

    expect(languages).toEqual(expect.arrayContaining(['fr', 'en', 'ru', 'es', 'hi', 'zh']))
    for (const language of languages) {
      expect(Object.keys(uiTranslations[language]).sort(), language).toEqual(referenceKeys)
    }
  })
})