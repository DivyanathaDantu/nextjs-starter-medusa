import { Dialog, Transition } from "@headlessui/react"
import { useAccount } from "@lib/context/account-context"
import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import useToggleState from "@lib/hooks/use-toggle-state"
import Button from "@modules/common/components/button"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import clsx from "clsx"
import router, { useRouter } from "next/router"
import React, { Fragment, useMemo } from "react"
import { Product } from "types/medusa"
import OptionSelect from "../option-select"

type MobileActionsProps = {
  product: Product
  show: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({ product, show }) => {
  const { variant, addToCart, options, inStock, updateOptions, userName, highestBid } = useProductActions()
  const parsedHighestBid = parseInt(highestBid.replace("$",""));
  const buttonText = (parsedHighestBid>0) ? "Sold out" : "Place your bid"
  const { state, open, close } = useToggleState()

  const price = useProductPrice({ id: product.id, variantId: variant?.id })
  const productId = product.id;
  const variantId = variant?.id;

  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const { customer, retrievingCustomer } = useAccount()
  const bidWinner = useMemo(() => {
    let curCustomer = ((!retrievingCustomer) && customer) ? (customer.first_name + " " + customer.last_name) : "loading!";
    console.log(`Is current customer the winner - ${curCustomer === userName}`);
    return (curCustomer === userName) ? true : false;
  },[product])

  const NavigationPage = ()=>{
    let page = ((!retrievingCustomer) && customer) ? "/zoom" : "/account/login";
    console.log(`Based on user login(retrievingCustomer - ${retrievingCustomer})(${customer})) navigate to - ${page}`);
    router.push({
      pathname: page,
      query:{ productId, variantId }
    })
  }

  return (
    <>
      <div
        className={clsx("lg:hidden sticky inset-x-0 bottom-0", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200">
            <div className="flex items-center gap-x-2">
              <span>{product.title}</span>
              <span>—</span>
              {parsedHighestBid > 0? (<div className="flex items-end gap-x-2 text-gray-700">
                  <span>
                    {bidWinner ? `Highest bid was - ${highestBid} you are winner. Please contact us.`
                    : `Highest bid was - ${highestBid} winner - ${userName}` }
                  </span>
                </div>

              ):
              <div>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-gray-700">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clsx({
                      "text-rose-600": selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div />
              )}
              </div>}
            </div>
            <div className="grid grid-cols-2 w-full gap-x-4">
              <Button onClick={open} variant="secondary">
                <div className="flex items-center justify-between w-full">
                  <span>
                    {variant
                      ? Object.values(options).join(" / ")
                      : "Select Options"}
                  </span>
                  <ChevronDown />
                </div>
              </Button>
              <Button onClick= {()=>{{addToCart}; NavigationPage()}} className = {clsx({"disabled": parsedHighestBid,})}>
                {!inStock ? "Out of stock" : buttonText}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3">
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-gray-900 flex justify-center items-center"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {product.variants.length > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {product.options.map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
