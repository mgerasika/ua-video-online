import { PHASE_PRODUCTION_BUILD } from 'next/constants'
export const IS_BUILD_TIME = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
