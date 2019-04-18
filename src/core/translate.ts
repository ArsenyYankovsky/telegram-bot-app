import { first } from 'lodash'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { hasRussiansLetters } from '../utils'

import { segments } from '../handler'

const key = process.env.TRANSLATION_APP_TOKEN || 'set_your_token'

export function translate(text: string) {
  const lang = hasRussiansLetters(text) ? 'ru-en' : 'ru'
  const body = new URLSearchParams()
  body.append('key', key)
  body.append('lang', lang)
  body.append('text', text)

  return fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', { body, method: 'POST' } as any)
    .then(x => x.json())
    .then(response => first(response.text) as string)
    .catch((e) => {
      segments.querySegment.addError(e)
      return 'Error from translation service'
    })
}
