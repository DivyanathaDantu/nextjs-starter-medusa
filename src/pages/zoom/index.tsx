import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('@modules/zoom/meeting'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />