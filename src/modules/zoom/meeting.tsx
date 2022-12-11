import { ZoomMtg } from '@zoomus/websdk';
import generateSignature from "@modules/zoom/signature"
import Layout from '@modules/layout/templates';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'
import Button from '@modules/common/components/button';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useAccount } from '@lib/context/account-context';

function StartMeeting(){
  const { customer } = useAccount();
  let userName = 'NextJs';
  let userEmail = ''
  if(customer){
    userName = customer.first_name + customer.last_name;
    userEmail = customer.email;
  }
  console.log("started calling zoom api");
  const client = ZoomMtgEmbedded.createClient();
  ZoomMtg.setZoomJSLib('https://source.zoom.us/2.9.5/lib', '/av');
  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareWebSDK();
  // loads language files, also passes any error messages to the ui
  ZoomMtg.i18n.load('en-US');
  ZoomMtg.i18n.reload('en-US');
  const[meetingNumber, setMeetingNumber] = useState("");
  const [passWord, setPassWord] = useState("");
    useEffect(()=>{
      async function getMeetingDetails(){
      const nextUrl = process.env.NEXT_PUBLIC_URL
      try {
          const res = await axios.get(`${nextUrl}/api/zoom/createMeeting`);
          setMeetingNumber(res.data.id);
          setPassWord(res.data.password);
          console.log(`${res.data.id}`);
        } catch (error) {
           console.log(error);
        }
    }
    getMeetingDetails(); 
  },[])
  console.log(`${meetingNumber}`)
  console.log("before generating zoom api signature")
    console.log("generating zoom api signature")
  var role = 0
  let signature = generateSignature(meetingNumber, role)
  function  joinMeeting() {

        let meetingSDKElement = document.getElementById('meetingSDKElement');
        var registrantToken = ''
        var sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
    
        try{
          client.init({
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            customize: {
              video: {
                isResizable: true,
                viewSizes: {
                  default: {
                    width: 800,
                    height: 600
                  },
                  ribbon: {
                    width: 400,
                    height: 600
                  }
                }
              }
            }
          })
        } catch(error){
          console.log(error)
        }
    
        client.join({
          sdkKey: sdkKey,
          signature: signature,
          meetingNumber: meetingNumber,
          password: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken
        })
    }
    return (
      <Layout>
        <div className="App">
      <section>
        <h1>Please join the zoom meeting and place your bid in the chat of zoom meeting</h1>

        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <Button onClick={joinMeeting}>Join Meeting</Button>
      </section>
    </div>
      </Layout>
    )

    }
  
  export default StartMeeting;