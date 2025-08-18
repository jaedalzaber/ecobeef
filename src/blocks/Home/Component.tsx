'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import type { Hero3D, Home, Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { useFrame, Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ConsoleModel } from './console'


const HomeBlockComp: React.FC<Home> = ({missionImage}) => {
  // Reference for the model group
  const modelRef = useRef<THREE.Group>(null)
  // Store mouse position
  const mouse = useRef({ x: 0, y: 0 })
  // Store target rotation for damping
  const targetRotation = useRef({ x: 0, y: 0 })

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to [-1, 1] range
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Component to handle model rotation
  const RotatingConsoleModel: React.FC<{
    position: [number, number, number]
    rotation: [number, number, number]
  }> = ({ position, rotation }) => {
    useFrame(() => {
      if (modelRef.current) {
        // Calculate target rotations based on mouse position
        const maxRotation = Math.PI / 6 // Limit rotation angle
        targetRotation.current.y = mouse.current.x * maxRotation
        targetRotation.current.x = mouse.current.y * maxRotation
        // Apply damping to smooth the rotation
        const dampingFactor = 0.05
        modelRef.current.rotation.y +=
          (targetRotation.current.y - modelRef.current.rotation.y) * dampingFactor
        modelRef.current.rotation.x +=
          (targetRotation.current.x - modelRef.current.rotation.x) * dampingFactor - Math.PI / 180

        // Move the model slightly towards the mouse
        const maxOffset = 0.2
        const targetX = mouse.current.x * maxOffset * 2
        const targetY = (-mouse.current.y * maxOffset) / 20 - 0.2
        modelRef.current.position.x += (targetX - modelRef.current.position.x) * dampingFactor
        modelRef.current.position.y += (targetY - modelRef.current.position.y) * dampingFactor

        // Add sine wave motion to the model's position
        const time = performance.now() * 0.001
        const waveAmplitude = 0.002
        const waveFrequency = 2
        modelRef.current.position.y += Math.sin(time * waveFrequency) * waveAmplitude
      }
    })

    return (
      <group ref={modelRef} position={position} rotation={rotation}>
        <ConsoleModel />
      </group>
    )
  }

  return (
    <div className="">
      <div
        className="relative -mt-[10.4rem] flex items-center justify-center text-white flex-col
        bg-[#f5f1ee]"
        data-theme="light"
      >
        <div className="relative w-[800px] h-[400px] z-20 mt-40">
          <Canvas
            style={{ background: 'transparent' }}
            gl={{ outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.NoToneMapping }}
            camera={{ position: [0, 0, 4.2], fov: 30 }}
          >
            <ambientLight intensity={1} />
            {/* <OrbitControls maxZoom={5} /> */}
            <hemisphereLight
              color={'#ffffff'}
              groundColor={'#5300B9'}
              intensity={2.75}
              position={[0, 10, 0]}
            />
            <Environment preset="city" />
            {/* <directionalLight castShadow/> */}
            <RotatingConsoleModel position={[0, -0.3, 0]} rotation={[-Math.PI / 7, 0, 0]} />
          </Canvas>
        </div>

        <div className=" mb-8 z-10 relative flex items-center justify-center">
          <div className="max-w-[36.5rem] md:text-left">
            <div className="">
              <span className="text-3xl md:text-5xl font-medium text-[#0e3934]">
                Data Company for
              </span>
            </div>
            <div className="mt-4">
              <span className="text-5xl font-bold text-[#0e3934] ">
                Sustainable <br />
                <span className="text-[#009B4A]">Beef Ecosystem</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6 my-20 ">
        <div className="border-b-[.5px] border-[#cecece] pb-6 w-full flex items-center gap-4 ">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="#009B4A"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="3" cy="5" r="3" />
          </svg>
          <h3 className="text-3xl font-medium text-[#0e3934] ">
            <span>Mission</span>
          </h3>
        </div>

        <div className="mx-6">
          <h3 className="text-3xl font-semibold my-12 text-[#353535] ">
            Co-creation of a circular beef economy using data
          </h3>
          <p className="text-lg font-normal text-[#4e4e4e] leading-8 tracking-wide">
            We will transform our meat-eating culture, which is currently facing serious issues such
            as supply and demand problems and environmental problems, into a sustainable one using
            technology based on cow farming. By passing on to our descendants the culture of "eating
            meat" that is about facing life and being grateful for it, we will realize a relaxed
            society where various values are respected.
          </p>
        </div>
        <div className="mx-6">
          {/* <Media fill imgClassName="-z-10 object-cover" priority resource={missionImage} /> */}
          <p className="text-lg font-normal text-[#4e4e4e] leading-8 tracking-wide">
            Our mission is to build an ecosystem based on consideration for environmental resources
            (low impact) and respect for food diversity, that is, to use data to improve the entire
            process of pork production and distribution, which has not only wasted resources but
            also lives. To achieve this, we will work hand in hand with all people and organizations
            involved in pork.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeBlockComp
