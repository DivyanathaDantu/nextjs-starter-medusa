import { medusaClient } from "@lib/config";

export default async function updateBidWinner(userName: string, productId: string, highestBid: string){
    try {
        await medusaClient.admin.products.setMetadata(productId, {
            key: "userName",
            value: `${userName}`
        }).then(({ product }) => {
        console.log(`Updated meeting id with product- ${product.metadata}`);
        });
        medusaClient.admin.products.setMetadata(productId, {
            key: "highestBid",
            value: `${highestBid}`
        }).then(({ product }) => {
        console.log(`Updated product with highestBid - - ${product.metadata}`);
        });
    } catch (error) {
        console.log("error while updating metadata ---- !")
        console.log(error)
    }
}