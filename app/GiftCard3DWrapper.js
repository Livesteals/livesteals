'use client'
import dynamic from 'next/dynamic'

const GiftCard3D = dynamic(() => import('./GiftCard3D'), { ssr: false })

export default GiftCard3D
