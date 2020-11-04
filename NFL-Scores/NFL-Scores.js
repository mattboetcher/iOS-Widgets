// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic; share-sheet-inputs: plain-text;
/**************
 Version 1.0

Credits: 
Matthias Boetcher mattboetcher@github
https://github.com/mattboetcher/iOS-Widgets/
**************/

const DEFAULT_FONT_SIZE = 13
const TEXT_COLOR = Color.white()

let maxContent = 6
let widgetSize = args.widgetParameter
// for debugging only
widgetSize = "medium"

if (widgetSize == "large") {
  maxContent = 14
} 

let json = await loadJSONItems()

const widget = new ListWidget()
await createWidget(json)

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
  switch (widgetSize)
  {
    case 'small':
      await widget.presentSmall()
      break
    case 'medium':
      await widget.presentMedium()
      break
    case 'large':
      await widget.presentLarge()
      break
    default:
      console.log("no size")
      break
    }
}

Script.setWidget(widget)
Script.complete()

// ------------------------------------------------

// build the content of the widget
async function createWidget(json) {
  
  widget.backgroundColor = new Color("013369")
  widget.setPadding(18, 20, 15, 15)
  
  // Create Title
  const titleStack = widget.addStack()
  titleStack.layoutHorizontally()
  createTitleStack(titleStack, "Teams", 95)
  createTitleStack(titleStack, "Scores", 65)
  if (widgetSize != "small") {
    createTitleStack(titleStack, "Qtr", 50)
    createTitleStack(titleStack, "Dwn", 30)
    createTitleStack(titleStack, "Togo", 35)
    createTitleStack(titleStack, "TV", 20)
  }
  widget.addSpacer(1)
//   console.log(json)
  const keys = Object.keys(json)
  
  var i = 0
  for (var key of keys) {
    // Stop creating content when maximum reached
    if (i == maxContent) {
      break
    }
    
    // Create Stack
    const stack = widget.addStack()
    stack.layoutHorizontally()
    stack.centerAlignContent()
    
    // Load logo home
    const image = await getImage(`${json[key].home.abbr}.png`, key)
    const imgHomeWidget = stack.addImage(image)
    imgHomeWidget.imageSize = new Size(16, 16)
    
    // Create Teams Stack
    createTextStack(stack, `${json[key].home.abbr}`, 28)
    createTextStack(stack, `-`, 10)
    createTextStack(stack, `${json[key].away.abbr}`, 27)
    
    // Load logo away
    const image2 = await getImage(`${json[key].away.abbr}.png`, key)
    const imgAwayWidget = stack.addImage(image2)
    imgAwayWidget.imageSize = new Size(16, 16)
    
    // Create Score Stack
    createTextStack(stack, `${json[key].home.score["T"]}`/`${json[key].away.score["T"]}`, 60)
    
    if (widgetSize != "small" ) {
    // Create Quater Stack
      createTextStack(stack, `${json[key].qtr}`, 60)
      createTextStack(stack, `${json[key].down}`, 20)
      createTextStack(stack, `${json[key].togo}`, 20)
      createTextStack(stack, `${json[key].media.tv}`, 45)
    }
    
    widget.addSpacer(0)
    i++
  }
  
  // Create Timestamp
  let timeStamp = formatDate(new Date())
  let wDate = widget.addText(timeStamp);
  wDate.font = Font.mediumRoundedSystemFont(8)
  wDate.textColor = Color.gray();
  wDate.centerAlignText();
  
  return widget
}

function check(string) {
  if (string == "null") {
    return "-"
  }
  if (!string) {
    return "-"
  }
  return `${string}`
}

function createTextStack(stack, text, width) {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(width, 20)
  const widgetText = tmpStack.addText(check(text))
  widgetText.font = Font.systemFont(DEFAULT_FONT_SIZE)
  widgetText.textColor = TEXT_COLOR
  
  return widgetText
}

function createTitleStack(stack, text, width) {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(width, 20)
  const widgetTitle = tmpStack.addText(text)
  widgetTitle.font = Font.boldSystemFont(DEFAULT_FONT_SIZE)
  widgetTitle.textColor = TEXT_COLOR
  
  return widgetTitle
}

async function loadJSONItems() {
  let url = "http://static.nfl.com/liveupdate/scores/scores.json"
  let req = new Request(url)
  let json = await req.loadJSON()
//   console.log(json)
  return json
}

async function loadImage(imgUrl) {
  let req = new Request(imgUrl)
  img = await req.loadImage()
  return img
}


function formatDate(timestamp) {
  let hours = timestamp.getHours();
  let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
  let time = "Last Update: " + hours + ":" + minutes;
  return time;
}


// get images from local filestore or download them once
async function getImage(image, key) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, image)
   
  if (fm.fileExists(path)) {
    return fm.readImage(path)
  } else {
    // download once
    let imageUrl
      
    switch (image) {
    // necessary, JAC logo is named JAX
      case 'JAC.png':
        imageUrl = `https://static.www.nfl.com/t_q-best/league/api/clubs/logos/JAX.png`;
        console.log(imageUrl)
        break
      case `${json[key].home.abbr}.png`:
        imageUrl = `https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${json[key].home.abbr}.png`;
        console.log(imageUrl)
        break
      case `${json[key].away.abbr}.png`:
        imageUrl = `https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${json[key].away.abbr}.png`;
        console.log(imageUrl)
        break
      default:
        console.log(`Sorry, couldn't find ${image}.`);
        break
      }
      console.log(path)
        
      let iconImage = await loadImage(imageUrl)
      console.log(iconImage)
      fm.writeImage(path, iconImage)
      return iconImage
   }
}
