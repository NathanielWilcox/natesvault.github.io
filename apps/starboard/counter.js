export function initializeCounter(root = document) {
  const countOutput = root.querySelector('#count')
  const decrementButton = root.querySelector('#decrement')
  const resetButton = root.querySelector('#reset')
  const incrementButton = root.querySelector('#increment')

  if (!countOutput || !decrementButton || !resetButton || !incrementButton) {
    throw new Error('Counter markup is incomplete')
  }

  let count = 0
  const render = () => {
    countOutput.textContent = String(count)
  }

  decrementButton.addEventListener('click', () => {
    count -= 1
    render()
  })

  resetButton.addEventListener('click', () => {
    count = 0
    render()
  })

  incrementButton.addEventListener('click', () => {
    count += 1
    render()
  })
}
