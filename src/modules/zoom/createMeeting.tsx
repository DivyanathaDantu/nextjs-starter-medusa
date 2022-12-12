import axios from 'axios'
import { medusaClient } from "@lib/config";

let meetingNumber = ''
let passWord = ''


async function checkIfZoomMeetingExists(productId: string){
    let meetingExists = false
        await medusaClient.products.retrieve(productId)
        .then(({ product }) => {
        if(product.metadata){
            if(product.metadata.meetingNumber){
                meetingNumber = JSON.stringify(product.metadata.meetingNumber);
                console.log(`Existing Meeting id ${meetingNumber}`);
            }
            if(product.metadata.passWord){
                passWord = JSON.stringify(product.metadata.passWord);
                console.log(`Existing Meeting password ${passWord}`);
            }
            if(product.updated_at){
                let curDate = new Date();
                let upDate = new Date(product.updated_at)
                const timediff = curDate.getTime()- upDate.getTime();
                console.log(`Existing Meeting updated date ${upDate}`);
                console.log(`Existing time diff ${timediff}`);
                if(timediff < 4000*60){
                    meetingExists =  true;
                }
            }
        }
        // console.log(`medusa product-${JSON.stringify(product)}`)
        });
    return meetingExists;
}

async function setZoomMeetingForProduct(meetingNumber: String, passWord: string, product_id: string){
    // console.log(options);
    // updateOptions({"metadata" : `{"meetingNumber" : ${meetingNumber}, "passWord" : ${passWord}}`})
    // must be previously logged in or use api token
    try {
        await medusaClient.admin.products.setMetadata(product_id, {
            key: "meetingNumber",
            value: `${meetingNumber}`
        }).then(({ product }) => {
        console.log(`Updated meeting id with product- ${product.metadata}`);
        });
        medusaClient.admin.products.setMetadata(product_id, {
            key: "passWord",
            value: `${passWord}`
        }).then(({ product }) => {
        console.log(`Updated meeting password with product - - ${product.metadata}`);
        });
    } catch (error) {
        console.log("error while updating metadata")
        console.log(error)
    }
        
}

export default async function getMeetingDetails(productId: string , variantId: string){
    const meetingExists = await checkIfZoomMeetingExists(productId);
    console.log(`Product meeting check if meeting exists - - ${meetingExists}`);
    if(meetingExists){
        console.log(`product id - ${productId} , product variantid - ${variantId}`)
        return [meetingNumber.toString(), passWord];
    }
    else{
        const nextUrl = process.env.NEXT_PUBLIC_URL
        try {
            const res = await axios.get(`${nextUrl}/api/zoom/createMeeting`);
            meetingNumber = res.data.id;
            meetingNumber = meetingNumber.toString()
            passWord = res.data.password;
            console.log(`${res.data.id}`);
        } catch (error) {
            console.log(error);
        }
        await setZoomMeetingForProduct(meetingNumber, passWord, productId)
        return [meetingNumber, passWord]; 
    }
  }