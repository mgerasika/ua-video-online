import Link from 'next/link'
import { ReactNode } from 'react'
import 'twin.macro'

interface IProps {
  showBack: boolean
  children: ReactNode
}
export const Layout = ({ children, showBack }: IProps) => {
  return (
    <div>
      <div tw="mx-auto container">
        <div tw="flex py-4 sticky top-0 bg-black z-10">
          {showBack && (
            <Link href="/" tw="cursor-pointer text-white pl-4 pt-3 ">
              Back
            </Link>
          )}
          <h2 tw="text-white text-[30px] text-center w-full">HD Online UA</h2>
        </div>

        {children}
      </div>
    </div>
  )
}
