import { NextRequest, NextResponse } from "next/server";
import updateBidWinner from "@modules/bid/bid-updates";

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if(req.body){
      const userName = req.body.user_name;
      const productId = req.body.product_id;
      const highestBid = req.body.highesht_bid;
      await updateBidWinner(userName, productId, highestBid);
    }
    else{
      throw Error;
    }
  } catch (error) {
    res.status(401).json('Bad Request');
  }
    res.status(201).json('Successfully updated');
  }