import { useAccount } from "@lib/context/account-context"
import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import Button from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/option-select"
import clsx from "clsx"
import Link from "next/link"
import router from "next/router"
import React, { useMemo } from "react"
import { Product } from "types/medusa"

type ProductActionsProps = {
  product: Product
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { updateOptions, addToCart, options, inStock, variant, highestBid, userName } = useProductActions()
  const parsedHighestBid = parseInt(highestBid.replace("$",""));
  const buttonText = (parsedHighestBid>0) ? "Sold out" : "Place your bid"
  const price = useProductPrice({ id: product.id, variantId: variant?.id })
  const productId = product.id;
  const variantId = variant?.id;

  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const { customer, retrievingCustomer, refetchCustomer } = useAccount()
  const bidWinner = useMemo(() => {
    let curCustomer = ((!retrievingCustomer) && customer) ? (customer.first_name + " " + customer.last_name) : "loading!";
    console.log(`Is current customer the winner - ${curCustomer === userName}`);
    return (curCustomer === userName) ? true : false;
  },[product])
  const NavigationPage = ()=>{
    if(parsedHighestBid>0){
      return;
    }
    let page = ((!retrievingCustomer) && customer) ? "/zoom" : "/account/login";
    console.log(`Based on user login(retrievingCustomer - ${retrievingCustomer})(${customer})) navigate to - ${page}`);
    router.push({
      pathname: page,
      query:{ productId, variantId }
    })
  }

  return (
    <div className="flex flex-col gap-y-2">
      {product.collection && (
        <Link href={`/collections/${product.collection.id}`}>
          <a className="text-small-regular text-gray-700">
            {product.collection.title}
          </a>
        </Link>
      )}
      <h3 className="text-xl-regular">{product.title}</h3>

      <p className="text-base-regular">{product.description}</p>

      {product.variants.length > 1 && (
        <div className="my-8 flex flex-col gap-y-6">
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

      <div className="mb-4">
      {parsedHighestBid > 0? (<div className="flex items-end gap-x-2 text-gray-700">
                  <span>
                  {bidWinner ? `Highest bid was - ${highestBid} you are the winner. Please contact us.`
                    : `Highest bid was - ${highestBid} winner - ${userName}` }
                  </span>
                </div>

              ):
        <div>
        {selectedPrice ? (
          <div className="flex flex-col text-gray-700">
            <span
              className={clsx("text-xl-semi", {
                "text-rose-600": selectedPrice.price_type === "sale",
              })}
            >
              {selectedPrice.calculated_price}
            </span>
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  <span className="text-gray-500">Original: </span>
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-rose-600">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div />
        )}
        </div>}
      </div>

      <Button onClick= {()=>{{addToCart}; NavigationPage()}}  className = {clsx({"opacity-25 cursor-not-allowed": parsedHighestBid,})}>
        {!inStock ? "Out of stock" : buttonText}
      </Button>
    </div>
  )
}

export default ProductActions
