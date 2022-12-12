import { ZoomMtg } from '@zoomus/websdk';
import generateSignature from "@modules/zoom/signature"
import Layout from '@modules/layout/templates';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'
import Button from '@modules/common/components/button';
import { useEffect, useState } from 'react';
import { useAccount } from '@lib/context/account-context';
import getMeetingDetails from '@modules/zoom/createMeeting'
import { useRouter } from 'next/router';

function StartMeeting(){
  const { customer } = useAccount();
  let userName = 'NextJs';
  let userEmail = ''
  if(customer){
    userName = customer.first_name + " " + customer.last_name;
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
  const[meetingNumber, setMeetingNumber] = useState(0);
  const [passWord, setPassWord] = useState("");
  const router = useRouter();
  const {query:{productId, variantId},} = router;
      useEffect(()=>{
        async function meetingDetails(){
        const meetingDetails : Array<string> = await getMeetingDetails(productId, variantId);
        console.log(`meeting details-${parseInt(meetingDetails[0].replaceAll('"', ''))}`);
        setMeetingNumber(parseInt(meetingDetails[0].replaceAll('"', '')));
        setPassWord(meetingDetails[1].replaceAll('"', ''));
        }
        meetingDetails();
    },[])
    console.log("generating zoom api signature")
    console.log(`outside join meeting ${meetingNumber}`)
    let role = 0
    let signature = generateSignature(meetingNumber, role)
  function  joinMeeting() {
        let meetingSDKElement = document.getElementById('meetingSDKElement');
        var registrantToken = ''
        var sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
        console.log(`inside join meeting ${meetingNumber}`)
        console.log(`before joining the meeting- ${passWord}`)
    
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
          tk: registrantToken,
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