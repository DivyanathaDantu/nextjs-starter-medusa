import clsx from "clsx"
import { useCollections } from "medusa-react"
import Link from "next/link"

const FooterNav = () => {
  const { collections } = useCollections()

  return (
    <div className="content-container flex flex-col gap-y-8 pt-16 pb-8">
      <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between">
        <div>
          <Link href="/">
            <a className="text-xl-semi uppercase">Auction House</a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-4 justify-center xsmall:items-center xsmall:flex-row xsmall:items-end xsmall:justify-between">
        <span className="text-xsmall-regular text-gray-500">
          © Copyright 2022 Auction House
        </span>
        <div className="min-w-[316px] flex xsmall:justify-end">
        </div>
      </div>
    </div>
  )
}

export default FooterNav
