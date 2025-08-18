
'use client'
import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import gsap from 'gsap'

export interface HamburgerBackgroundHandles {
  open: () => void
  close: () => void
}

const HamburgerBackground = forwardRef<HamburgerBackgroundHandles>((_, ref) => {
  const svgRef1 = useRef<SVGSVGElement>(null)
  const svgRef2 = useRef<SVGSVGElement>(null)
  const openTl = useRef<gsap.core.Timeline>()
  const closeTl = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const path1 = svgRef1.current?.querySelector('#background-path')
    const path2 = svgRef2.current?.querySelector('#background-path2')
    if (!path1 || !path2) return

    // Initial collapsed state
    gsap.set([path1, path2], {
      attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' },
    })

    // Open animation
    const tlOpen = gsap.timeline({ paused: true })
    tlOpen
      .to(path1, {
        keyframes: [
          { attr: { d: 'M0,0 H100 V0 H100 V50 Q50,70 0,50 Z' }, duration: 0.5 },
          { attr: { d: 'M0,0 H100 V0 H100 V100 Q50,100 0,100 Z' }, duration: 0.5 },
        ],
        ease: 'power2.inOut',
      })
      .to(
        path2,
        {
          keyframes: [
            { attr: { d: 'M0,0 H100 V0 H100 V50 Q50,70 0,50 Z' }, duration: 0.5 },
            { attr: { d: 'M0,0 H100 V0 H100 V100 Q50,100 0,100 Z' }, duration: 0.5 },
          ],
          ease: 'power2.inOut',
        },
        '-=0.4' // stagger effect
      )

    // Close animation
    const tlClose = gsap.timeline({ paused: true })
    tlClose
      .to(path1, {
        keyframes: [
          { attr: { d: 'M0,0 H100 V0 H100 V50 Q50,30 0,50 Z' }, duration: 0.5 },
          { attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, duration: 0.5 },
        ],
        ease: 'power2.inOut',
      })
      .to(
        path2,
        {
          keyframes: [
            { attr: { d: 'M0,0 H100 V0 H100 V50 Q50,30 0,50 Z' }, duration: 0.5 },
            { attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, duration: 0.5 },
          ],
          ease: 'power2.inOut',
        },
        '-=0.4'
      )

    openTl.current = tlOpen
    closeTl.current = tlClose
  }, [])

  useImperativeHandle(ref, () => ({
    open: () => openTl.current?.restart(),
    close: () => closeTl.current?.restart(),
  }))

  return (
    <>
      <svg
        ref={svgRef1}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="fixed h-[100vh] w-full z-10"
      >
        <path id="background-path" fill="#009B4A" />
      </svg>
      <svg
        ref={svgRef2}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="fixed h-[100vh] w-full z-10"
      >
        <path id="background-path2" fill="#f5f1ee" />
      </svg>
    </>
  )
})

HamburgerBackground.displayName = 'HamburgerBackground'
export default HamburgerBackground
