import { beforeEach, describe, expect, it } from 'vitest'
import { initializeCounter } from '../../apps/starboard/counter.js'

describe('Starboard counter demo', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <output id="count" aria-live="polite">0</output>
      <button id="decrement" type="button">-</button>
      <button id="reset" type="button">Reset</button>
      <button id="increment" type="button">+</button>
    `
  })

  it('starts at zero and increments the count', () => {
    initializeCounter()

    document.querySelector<HTMLButtonElement>('#increment')?.click()
    document.querySelector<HTMLButtonElement>('#increment')?.click()

    expect(document.querySelector('#count')?.textContent).toBe('2')
  })

  it('decrements below zero and resets to zero', () => {
    initializeCounter()

    document.querySelector<HTMLButtonElement>('#decrement')?.click()
    expect(document.querySelector('#count')?.textContent).toBe('-1')

    document.querySelector<HTMLButtonElement>('#reset')?.click()
    expect(document.querySelector('#count')?.textContent).toBe('0')
  })

  it('reports incomplete counter markup', () => {
    document.body.innerHTML = '<output id="count"></output>'

    expect(() => initializeCounter()).toThrow('Counter markup is incomplete')
  })
})
