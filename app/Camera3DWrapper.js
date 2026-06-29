'use client'
import dynamic from 'next/dynamic'

const Camera3D = dynamic(() => import('./Camera3D'), { ssr: false })

export default Camera3D
