// Confetti Animation
export const confetti = (options = {}) => {
  const {
    duration = 3000,
    particleCount = 50,
    spread = 45,
    origin = { x: 0.5, y: 0.5 }
  } = options

  if (typeof window === 'undefined') return

  // Create confetti particles
  for (let i = 0; i < particleCount; i++) {
    createConfettiParticle(duration, spread, origin)
  }
}

const createConfettiParticle = (duration, spread, origin) => {
  const particle = document.createElement('div')
  particle.className = 'confetti-particle'

  const startX = origin.x * window.innerWidth
  const startY = origin.y * window.innerHeight
  const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180)
  const velocity = 5 + Math.random() * 5

  const vx = Math.cos(angle) * velocity
  const vy = Math.sin(angle) * velocity - 2

  const colors = ['#fbbf24', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6']
  const color = colors[Math.floor(Math.random() * colors.length)]

  particle.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: 10px;
    height: 10px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
  `

  document.body.appendChild(particle)

  let x = startX
  let y = startY
  let vx_ = vx
  let vy_ = vy
  const gravity = 0.1
  const friction = 0.99

  const animate = () => {
    x += vx_
    y += vy_
    vy_ += gravity
    vx_ *= friction
    vy_ *= friction

    particle.style.left = x + 'px'
    particle.style.top = y + 'px'

    if (y < window.innerHeight) {
      requestAnimationFrame(animate)
    } else {
      particle.remove()
    }
  }

  requestAnimationFrame(animate)
}

// Particle Burst Effect
export const particleBurst = (x, y, options = {}) => {
  const {
    particleCount = 20,
    colors = ['#fbbf24', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6'],
    velocity = 5
  } = options

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    const angle = (i / particleCount) * Math.PI * 2
    const vx = Math.cos(angle) * velocity
    const vy = Math.sin(angle) * velocity

    particle.className = 'particle-burst'
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: ${colors[i % colors.length]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `

    document.body.appendChild(particle)

    let px = x
    let py = y
    let vx_ = vx
    let vy_ = vy
    const gravity = 0.15

    const animate = () => {
      px += vx_
      py += vy_
      vy_ += gravity

      particle.style.left = px + 'px'
      particle.style.top = py + 'px'

      if (py < window.innerHeight) {
        requestAnimationFrame(animate)
      } else {
        particle.remove()
      }
    }

    requestAnimationFrame(animate)
  }
}

// Rainbow Trail Effect
export const rainbowTrail = (element, duration = 1000) => {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
  let colorIndex = 0

  const interval = setInterval(() => {
    element.style.color = colors[colorIndex % colors.length]
    colorIndex++
  }, duration / colors.length)

  setTimeout(() => clearInterval(interval), duration)
}
