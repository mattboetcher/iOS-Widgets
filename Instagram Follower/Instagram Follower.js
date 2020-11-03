/**************************************************************
Version 1.0
**************************************************************/
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;

// Instagram account name via parameter
let igAccount = args.widgetParameter
if (!igAccount) {
  igAccount = "INSERT YOUR INSTAGRAM ACCOUNT NAME HERE"
}
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
	
  // Create URL
  const url = "https://www.instagram.com/" + igAccount + "/"
  let req = new Request(url)
  let html = await req.loadString()
  let follower = getfollower(html)

  // Create Timestamp
  let timeStamp = formatDate(new Date())

  // Build Widget
  widget.setPadding(10, 10, 10, 10)
  widget.backgroundColor = Color.white()
	
  // Instagram Logo
  const logoImg = await getImage('instagram-logo.png')
	
  const wimg = widget.addImage(logoImg)
  wimg.imageSize = new Size(50, 50)
  wimg.centerAlignImage()
  widget.addSpacer()
	
  const followerFontSize = 35
  const statusFontSize = 10
  const textColor = Color.black()
	
  let wfollower = widget.addText(follower);
  wfollower.font = Font.mediumRoundedSystemFont(followerFontSize)
  wfollower.textColor = textColor;
  wfollower.centerAlignText();
	 
  let wDate = widget.addText(timeStamp);
  wDate.font = Font.mediumRoundedSystemFont(statusFontSize)
  wDate.textColor = textColor;
  wDate.centerAlignText();
}

function getfollower(html) {
  let followerStart = html.indexOf('"edge_followed_by":{"count":');
  let followerEnd = html.indexOf('},"followed_by_viewer"', followerStart + 1);
  let follower = html.substring(followerStart + 28, followerEnd);
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
   
  if (fm.fileExists(path)) {
    return fm.readImage(path)
  } else {
    // download once
    let imageUrl
	
    switch (image) {
      case 'instagram-logo.png':
        imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/132px-Instagram_logo_2016.svg.png";
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
