import getZoomAuthToken from "./getZoomAuthToken";
import axios from 'axios'

const zoomBaseUrl = process.env.NEXT_PUBLIC_ZOOM_API_BASE_URL;
const zoomUserId = process.env.NEXT_PUBLIC_ZOOM_USER_ID;
export default async function createMeting(){
    console.log("In Create meeting getting auth token")
    const authToken = await getZoomAuthToken();
    const config = {
        headers: { Authorization: `Bearer ${authToken}` }
    };
    
    const bodyParameters = {
        "agenda" : "Auction-House",
        "duration" : 2
    };

    try {
        const res = await axios.post(`${zoomBaseUrl}/users/${zoomUserId}/meetings`,
        bodyParameters,
        config);
        const filteredRes = {'id' : `${res.data.id}`, 'password' : `${res.data.password}`};
        console.log(`${filteredRes}`);
        return filteredRes;
      } catch (error) {
        return { error };
      }
}