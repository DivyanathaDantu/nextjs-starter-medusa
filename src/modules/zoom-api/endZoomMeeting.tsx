import axios, { AxiosRequestConfig } from "axios";
import { useEffect } from "react";

export default function endMeeting(meetingId: any, config: AxiosRequestConfig<{ action: string; }> | undefined){
    const zoomBaseUrl = process.env.NEXT_PUBLIC_ZOOM_API_BASE_URL;
    const bodyParametersEnd = {
        "action": "end"
      };
      let timer = setTimeout(async () => {
        try {
        const result = await axios.put(`${zoomBaseUrl}/meetings/${parseInt(meetingId)}/status`, 
        bodyParametersEnd,
        config);
        console.log(JSON.stringify(result));
        } catch (error) {
            return { error };
        }
      }, 120000);
      return () => {
        clearTimeout(timer);
      };
  }