import { ZoomMtg } from '@zoomus/websdk';
import generateSignature from "@modules/zoom/signature"
import Layout from '@modules/layout/templates';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'
import Button from '@modules/common/components/button';

function ZoomApp(){
console.log("started calling zoom api")
const client = ZoomMtgEmbedded.createClient()
  ZoomMtg.setZoomJSLib('https://source.zoom.us/2.9.5/lib', '/av');
  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareWebSDK();
  // loads language files, also passes any error messages to the ui
  ZoomMtg.i18n.load('en-US');
  ZoomMtg.i18n.reload('en-US');
  const meetingN = 92735651344
  const meetingNumber = meetingN.toString()
  console.log("before generating zoom api signature")
  function getSignature() {
    console.log("generating zoom api signature")
  var role = 0
  let signature = generateSignature(meetingNumber, role)
  startMeeting(signature)
  }
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  function  startMeeting(signature: any) {

        let meetingSDKElement = document.getElementById('meetingSDKElement');
        var userName = 'NextJs'
        var userEmail = ''
        var passWord = 'F2neEE'
        var registrantToken = ''
        var sdkKey = 'iDVCD106BYolkelDVsNet1ytRolCYWQqBhDv'
    
        client.init({
          zoomAppRoot: meetingSDKElement,
          language: 'en-US',
          customize: {
            video: {
              isResizable: true,
              viewSizes: {
                default: {
                  width: 1000,
                  height: 600
                },
                ribbon: {
                  width: 300,
                  height: 700
                }
              }
            }
          }
        })
    
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

        <Button onClick={getSignature}>Join Meeting</Button>
      </section>
    </div>
      </Layout>
    )

    }
  
  export default ZoomApp;