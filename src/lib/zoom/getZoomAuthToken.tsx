import axios from 'axios';

const zoomAuthUrl = process.env.NEXT_PUBLIC_ZOOM_AUTH_URL;
const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET;
const accountId = process.env.NEXT_PUBLIC_ZOOM_ACCOUNT_ID;
const authBase64 = Buffer.from(`${clientId}:${clientSecret}`, 'base64');


export default async function getZoomAuthToken(){
    try {
        const res = await axios.post(`${zoomAuthUrl}/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        {}, {
            auth: {
              username: clientId,
              password: clientSecret
            }
        });
        const authToken = res.data.access_token;
        console.log(`${res}`);
        return authToken;
      } catch (error) {
        return { error };
      }
}