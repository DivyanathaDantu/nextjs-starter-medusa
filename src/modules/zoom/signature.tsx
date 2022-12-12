const KJUR = require('jsrsasign')
let sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
let sdkSecret = process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET

function generateSignature(meetingNumber : number, role : number) {
  console.log(`${meetingNumber} divi`)

    const iat = Math.round((new Date().getTime() - 30000) / 1000)
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }
  
    const oPayload = {
      sdkKey: sdkKey,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      appKey: sdkKey,
      tokenExp: iat + 60 * 60 * 2
    }
  
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    console.log(`${sHeader}, ${sdkSecret}`)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret)
    console.log(`sdkJWT is ${sdkJWT}`)
    return sdkJWT
  }

  export default generateSignature