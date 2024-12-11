"use client";

import Image from "next/image";
import {
  useAddToCart,
  useDebounce,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/ecommerce.hooks";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/helpers/functions";
import PlusMinusInput from "@/components/PlusMinusInput";
import Link from "next/link";
import { DeleteIcon } from "../svg/DeleteIcon";

const CheckoutItems = ({
  id,
  name,
  sku,
  price,
  image,
  slug_path,
  inventory,
  className,
  refreshCart,
  quantity,
  refreshSummary,
  isClosed,
  cart_item_id,
}) => {
  const { mutate: removeFromCart, isSuccess: isRemoved } = useRemoveFromCart();
  const { mutate: updateCart, isSuccess: isUpdated } = useUpdateCartQuantity();

  const [productQuantity, setProductQuantity] = useState(Number(quantity));

  useEffect(() => {
    setProductQuantity(Number(quantity));
  }, [quantity]);

  const debounceQuantity = useDebounce(productQuantity, 500);

  useEffect(() => {
    if (isUpdated || isRemoved) {
      refreshCart();
      refreshSummary();
    }
  }, [isUpdated, isRemoved]);

  return (
    <>
      <div className={`relative grid grid-cols-4 gap-5`}>
        <button
          className={`w-8 absolute right-2 top-2 z-10 cursor-pointer ${
            isClosed && !inventory?.inventory_defined && "text-white"
          } text-lg hover:text-red-500`}
          onClick={() => {
            removeFromCart({ id: id });
          }}
        >
          <DeleteIcon className="size-8" />
        </button>
        <Link href={`/${slug_path}`} className={`col-span-1`}>
          <Image
            src={image?.[0] ?? "/comr.png"}
            alt={`Comr`}
            width={0}
            height={0}
            sizes={`90vw`}
            className={`aspect-2/3 h-full max-h-[250px] w-full`}
          />
        </Link>
        <div
          className={`col-span-3 mb-auto ml-[2rem] flex flex-col items-start gap-2`}
        >
          <h4
            className={`${className} mt-2 text-center text-[1.1rem] font-normal`}
          >
            {name}
          </h4>
          <div className={`flex items-center`}>
            <span className={`${className} text-[0.9rem]`}>Količina:</span>{" "}
            &nbsp;
            <PlusMinusInput
              className={`${className} !mr-auto`}
              maxAmount={+inventory?.amount}
              quantity={productQuantity}
              setQuantity={setProductQuantity}
              updateCart={updateCart}
              id={cart_item_id}
              refreshSummary={refreshSummary}
              refreshCart={refreshCart}
            />
          </div>
          <p className={`text-center ${className} text-[0.9rem] font-normal`}>
            Šifra:&nbsp;{sku}
          </p>
          <p className={`text-center ${className} text-[0.9rem] font-normal`}>
            Ukupan iznos:&nbsp;{currencyFormat(price?.per_item?.total)}
          </p>
        </div>
        {isClosed && !inventory?.inventory_defined && (
          <div
            className={`absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black/40`}
          ></div>
        )}
      </div>
    </>
  );
};

export default CheckoutItems;
