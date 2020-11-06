// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: users;
/**************************************************************
Version 1.1
**************************************************************/
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;


let widgetInputRAW = args.widgetParameter;
let widgetInput = null;

let instagram, youtube, tiktok

//Add usernames here
if (config.runsInApp) {
  instagram = ""
  youtube = ""
  tiktok = ""
}

if (widgetInputRAW !== null) {
  [instagram, youtube, tiktok] = widgetInputRAW.toString().split("|");
  
  if(!instagram || !youtube || !tiktok) {
    throw new Error("Invalid Widget parameter. Expected format: Instagram|YouTube|TikTok") 
  }
}

const BACKCOLOR1 = 'C6FFDD';
const BACKCOLOR2 = 'FBD786';
const BACKCOLOR3 = 'F7797D';

const widget = new ListWidget()
await createWidget()

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
  await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {
    
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color(BACKCOLOR),
    new Color(BACKCOLOR2),
    new Color(BACKCOLOR3)
  ]
  widget.backgroundGradient = gradient
  
  // Create URL
  const urlInstagram = "https://www.instagram.com/" + instagram + "/"
  const urlYouTube = "https://www.youtube.com/user/" + youtube + "/"
  const urlTikTok = "https://www.tiktok.com/@" + tiktok + "/"
  
  // Get Followers
  let req = new Request(urlInstagram)
  let html = await req.loadString()
  let igFollower = getInstagramfollower(html)
  
  req = new Request(urlYouTube)
  html = await req.loadString()
  let ytFollower = getYouTubefollower(html)
  
  req = new Request(urlTikTok)
  html = await req.loadString()
  let ttFollower = getTikTokfollower(html)

  // Create Timestamp
  let timeStamp = formatDate(new Date())

  // Build Widget
  widget.setPadding(20, 20, 10, 20)
  widget.backgroundColor = Color.white()
	
  // Logo
  const logoIg = await getImage('instagram-logo.png')
  const logoYt = await getImage('youtube-logo.png')
  const logoTt = await getImage('tiktok-logo.png')
  
  const followerFontSize = 20
  const statusFontSize = 10
  const textColor = Color.black()
	
  igstack = widget.addStack()
  ytstack = widget.addStack()
  ttstack = widget.addStack()

  
  const wImgIg = igstack.addImage(logoIg)
  wImgIg.imageSize = new Size(25, 25)
  wImgIg.leftAlignImage()
  igstack.addSpacer(5)
  
  let wIgFollower = igstack.addText(igFollower);
  wIgFollower.font = Font.mediumRoundedSystemFont(followerFontSize)
  wIgFollower.textColor = textColor;
  wIgFollower.centerAlignText();
  widget.addSpacer(3)

  const wImgYt = ytstack.addImage(logoYt)
  wImgYt.imageSize = new Size(25, 25)
  wImgYt.leftAlignImage()
  ytstack.addSpacer(5)
	
  let wYtFollower = ytstack.addText(ytFollower);
  wYtFollower.font = Font.mediumRoundedSystemFont(followerFontSize)
  wYtFollower.textColor = textColor;
  wYtFollower.centerAlignText();
  widget.addSpacer(3)
  
  const wImgTt = ttstack.addImage(logoTt)
  wImgTt.imageSize = new Size(25, 25)
  wImgTt.leftAlignImage()
  ttstack.addSpacer(5)
  
  let wTtFollower = ttstack.addText(ttFollower);
  wTtFollower.font = Font.mediumRoundedSystemFont(followerFontSize)
  wTtFollower.textColor = textColor;
  wTtFollower.centerAlignText();
  widget.addSpacer(3)

  widget.addSpacer()
  let wDate = widget.addText(timeStamp);
  wDate.font = Font.mediumRoundedSystemFont(statusFontSize)
  wDate.textColor = textColor;
  wDate.centerAlignText();
  
  
  
  return widget
}

function getInstagramfollower(html) {
  let followerStart = html.indexOf('"edge_followed_by":{"count":');
  let followerEnd = html.indexOf('},"followed_by_viewer"', followerStart + 1);
  let follower = html.substring(followerStart + 28, followerEnd);
  console.log("follower: " + follower);  
  return follower;
}

function getYouTubefollower(html) {
  let followerStart = html.indexOf('"subscriberCountText":{"simpleText":');
  let followerEnd = html.indexOf('},"tvBanner"', followerStart + 1);
  let follower = html.substring(followerStart + 37, followerEnd);
  let lastIndex = follower.lastIndexOf(" ")
  follower = follower.substring(0, lastIndex)
  console.log("subscriber: " + follower);  
  return follower;
}

function getTikTokfollower(html) {
  let followerStart = html.indexOf('"followerCount":');
  let followerEnd = html.indexOf(',"heartCount"', followerStart + 1);
  let follower = html.substring(followerStart + 16, followerEnd);
  console.log("follower: " + follower);  
  return follower;
}

function formatDate(timestamp) {
  let hours = timestamp.getHours();
  let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
  let time = "Last Update: " + hours + ":" + minutes;
  return time;
}

// get images from local filestore or download them once
async function getImage(image) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, image)
//    fm.remove(path)
  if (fm.fileExists(path)) {
    return fm.readImage(path)
  } else {
    // download once
    let imageUrl
	
    switch (image) {
      case 'instagram-logo.png':
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/132px-Instagram_logo_2016.svg.png";
        break
      case 'youtube-logo.png':
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youtube%28amin%29.png";
        break
      case 'tiktok-logo.png':
        imageUrl = "https://2.bp.blogspot.com/-gFsA2g18lWQ/XD-ZejQyrfI/AAAAAAAAG6w/98a75D-YjRYMrg73zZ0UUfqdstQS7YBbwCK4BGAYYCw/s1600/Logo%2BTiktok.png";
        break
      default:
        console.log(`Sorry, couldn't find ${image}.`);
        break
      }
      let iconImage = await loadImage(imageUrl)
      fm.writeImage(path, iconImage)
      return iconImage
   }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
  console.log('loadImage')
  const req = new Request(imgUrl)
  return await req.loadImage()
}
