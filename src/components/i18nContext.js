import { createContext } from 'react'

export const I18nContext = createContext({ language: 'fr', t: key => key })
