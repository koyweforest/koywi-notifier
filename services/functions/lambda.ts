import axios from 'axios'

import { getParamFromSSM } from '../helpers/getEnvFromSSM'

export interface SlackEvent {
  subjectId: string
  eventName: string
  timeStamp: string
}

export async function handler() {
  try{
    const weather = await postDemoDayCountdown();
    console.log('posted!')
  } catch(e){
    console.log(`Error detected!: ${e}`)
  }

  return {};
}

const postDemoDayCountdown = async () => {
  const slackToken = await getParamFromSSM('slack/token') // setup yours on the aws console
  const slackUrl = 'https://slack.com/api/'
  const slackChannel = await getParamFromSSM('slack/channel') // setup yours on the aws console

  if (!slackToken || !slackChannel || !slackUrl)  throw new Error('Missing ENV parameters')

  const demoDayTime = 1680706800000
  const currentTime = new Date().getTime()

  const weeksToDemoDay = Math.round((demoDayTime - currentTime) / (7 * 24 * 60 * 60 * 1000))
  const daysToDemoDay = Math.floor((demoDayTime - currentTime) / (24 * 60 * 60 * 1000))
  const hoursToDemoDay = Math.round((demoDayTime - currentTime - daysToDemoDay * 24 * 60 * 60 * 1000) / (60 * 60 * 1000))
  
  const message = `{
    "channel": "{{CHANNEL}}",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Demo Day Countdown*\\n{{SQUARES}}\\n {{WEEKS}} weeks left\\n *{{DAYS}} days {{HOURS}} hours before demo day*\\n What will you do about it today?"
        },
        "accessory": {
          "type": "image",
          "image_url": "https://www.ycombinator.com/packs/static/ycdc/ycombinator-logo-ee6c80faf1d1ce2491d8.png",
          "alt_text": "alt text for image"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Countdown",
              "emoji": true
            },
            "value": "click_me_123",
            "url": "https://www.timeanddate.com/countdown/launch?iso=20230405T08&p0=224&msg=Demo+Day&font=sanserif"
          }
        ]
      }
    ]
  }`

  let payload = message

  payload = payload.replace('{{CHANNEL}}', slackChannel)
  payload = payload.replace('{{WEEKS}}', weeksToDemoDay.toString())
  payload = payload.replace('{{SQUARES}}', squares(weeksToDemoDay))
  payload = payload.replace('{{DAYS}}', daysToDemoDay.toString())
  payload = payload.replace('{{HOURS}}', hoursToDemoDay.toString())

  const headers = {
      'Authorization': `Bearer ${slackToken}`,
  }

  try {
    await axios.post(`${slackUrl}chat.postMessage`, JSON.parse(payload), { headers })
  } catch (error) {
    console.log('---------------->', error)
  }

  return {}
}

const squares = (weeks:number) => {
  const orange = ':large_orange_square:'
  const white = ':white_large_square:'
  let response = ''
  for(let i=0; i<10;i++){
    if(i<weeks)
      response = response.concat(white)
    else
      response = response.concat(orange)
  }
  return response
}
