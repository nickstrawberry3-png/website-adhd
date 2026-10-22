import { useEffect, useRef } from 'react'
import { NEURO_NOISE_FRAG } from './neuro-noise.frag'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// #000000, #4682B4, #1E90FF, #00BFFF
const COLOURS = [
  [0, 0, 0],
  [0.275, 0.51, 0.706],
  [0.118, 0.565, 1],
  [0, 0.749, 1],
]

// Slower and dimmer than the reference so text on top stays readable.
const TIME_SCALE = 0.3
const BRIGHTNESS = -0.12
const GRAIN = 0.06
// Average frame time above this means the device is struggling: freeze on a still frame.
const SLOW_FRAME_MS = 30
const STILL_TIME = 14

export default function NeuroNoise({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      canvas.style.display = 'none'
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
      return s
    }

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, NEURO_NOISE_FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link')
    } catch {
      canvas.style.display = 'none'
      return
    }
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const colours = new Float32Array(24)
    COLOURS.forEach((c, i) => colours.set(c, i * 3))
    gl.uniform3fv(u('u_colors'), colours)
    gl.uniform4f(u('u_shape'), 1.26, 0.35, 0.28, 0.0)
    gl.uniform4f(u('u_surface'), 1.82, 1.0, BRIGHTNESS, 1.48)
    gl.uniform4f(u('u_finish'), 0.09, 0.0, 0.001, GRAIN)
    gl.uniform4f(u('u_transform'), 1.0, 0.0, 0.2, 0.0)
    const uScene = u('u_scene')
    const uSpace = u('u_space')
    const uCursor = u('u_cursor')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)').matches

    let raf = 0
    let running = false
    let visible = false
    let frozen = reduceMotion.matches
    let elapsed = STILL_TIME
    let last = 0
    let frames = 0
    let frameTimeSum = 0
    let pointerX = 0
    let pointerY = 0
    let presenceTarget = 0
    let presence = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const draw = (t: number) => {
      resize()
      gl.uniform4f(uScene, canvas.width, canvas.height, t * TIME_SCALE, 4.0)
      gl.uniform4f(uSpace, 0, 0, pointerX, pointerY)
      gl.uniform4f(uCursor, presence, 3.0, 0.45, 0.46)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const tick = (now: number) => {
      const dt = last ? now - last : 16
      last = now
      elapsed += Math.min(dt, 100) / 1000
      presence += (presenceTarget - presence) * 0.08
      draw(elapsed)

      if (frames < 60) {
        frames++
        if (frames > 10) frameTimeSum += dt
        if (frames === 60 && frameTimeSum / 50 > SLOW_FRAME_MS) {
          frozen = true
          stop()
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || frozen || !visible || document.hidden) return
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const drawStill = () => {
      presence = 0
      draw(elapsed)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    const ro = new ResizeObserver(() => {
      if (!running) drawStill()
    })
    ro.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    const onMotionChange = () => {
      frozen = reduceMotion.matches
      if (frozen) {
        stop()
        drawStill()
      } else start()
    }
    reduceMotion.addEventListener('change', onMotionChange)

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      presenceTarget = inside ? 1 : 0
      pointerX = ((e.clientX - r.left) / r.width) * 2 - 1
      pointerY = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true })

    drawStill()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMotion.removeEventListener('change', onMotionChange)
      window.removeEventListener('pointermove', onPointer)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />
}
