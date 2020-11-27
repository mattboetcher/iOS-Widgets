// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: football-ball;
// share-sheet-inputs: plain-text;
/**************
 Version 1.5

Credits: 
Matthias Boetcher mattboetcher@github
https://github.com/mattboetcher/iOS-Widgets/
**************/

const DEFAULT_FONT_SIZE = 12
const TEXT_COLOR = Color.white()
const BACKCOLOR1 = '2980B9'
const BACKCOLOR2 = '013369';

let maxContent = 6
var today = new Date();
// How many minutes should the cache be valid
let cacheMinutes = 0;

// for debugging only
let widgetSize = "large"

if (config.runsInApp) {
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
  
  widget.setPadding(18, 20, 15, 15)
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color(BACKCOLOR1),
    new Color(BACKCOLOR2)
  ]
  widget.backgroundGradient = gradient
  
  // Create Title
  const titleStack = widget.addStack()
  titleStack.layoutHorizontally()
  createTitleStack(titleStack, "Teams", 98)
  createTitleStack(titleStack, "Scores", 59)
  if (config.widgetFamily != "small") {
    createTitleStack(titleStack, "Quater", 54)
    createTitleStack(titleStack, "Down", 49)
    createTitleStack(titleStack, "TV", 40)
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
    const imageHome = await getImage(`${json[key].home.abbr}.png`, key)
    const imgHomeWidget = stack.addImage(imageHome)
    imgHomeWidget.imageSize = new Size(16, 16)
    
    // Create Teams Stack
    createTextStack(stack, `${json[key].home.abbr}`, 31)
    createTextStack(stack, `-`, 10)
    createTextStack(stack, `${json[key].away.abbr}`, 31)
    
    // Load logo away
    const imageAway = await getImage(`${json[key].away.abbr}.png`, key)
    const imgAwayWidget = stack.addImage(imageAway)
    imgAwayWidget.imageSize = new Size(16, 16)
    
    // Create Score Stack
    const scoreHome = check(`${json[key].home.score["T"]}`)
    const scoreAway = check(`${json[key].away.score["T"]}`)
    
    createTextStack(stack, `${scoreHome}/${scoreAway}`, 50)
    
    // Create Quater Stack
    if (config.widgetFamily != "small") {
      const down = convertString(`${json[key].down}`,`${json[key].togo}`)
      createTextStack(stack, `${json[key].qtr}`, 55)
      createTextStack(stack, `${down}`, 55)
      createTextStack(stack, `${json[key].media.tv}`, 40)
    }
    
    widget.addSpacer(0)
    i++
  }
  
  // Create Timestamp
  // If you want to see an update timestamp, uncomment this code below.    
  /* let timeStamp = formatDate(new Date())
  let wDate = widget.addText(timeStamp);
  wDate.font = Font.mediumRoundedSystemFont(8)
  wDate.textColor = Color.gray();
  wDate.centerAlignText(); */
  
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

function convertString(str1, str2) {
  let string = ""
  
  if (str1 == "1") 
  {
    string = str1 + "st"
  } 
  else if (str1 == "2") 
  {
    string = str1 + "nd"
  } 
  else if (str1 == "3")
  {
    string = str1 + "rd"
  } 
  else if ( str1 == "0")
  {
    return string = "-"
  }
  else if (str1 == "null")
  {
    return string = "-"
  }
  else 
  {
    string = str1 + "th"
  }
  
  return string + " & " + str2
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
  // Set up the file manager.
  const fm = FileManager.local()

  // Set up cache.
  const cachePath = fm.joinPath(fm.documentsDirectory(), "NFL-Scores")
  const cacheExists = fm.fileExists(cachePath)
  const cacheDate = cacheExists ? fm.modificationDate(cachePath) : 0
  
  // Get Data
  let url = "http://static.nfl.com/liveupdate/scores/scores.json"
  let req = new Request(url)
  let data
  let lastUpdate
  
  try {
    // If cache exists and it has been less than x minutes since last request, use cached data.
    if (cacheExists&& (today.getTime() - cacheDate.getTime()) < (cacheMinutes * 60 * 1000)) {
      console.log("Get data from cache")
      data = JSON.parse(fm.readString(cachePath))
      lastUpdate = cacheDate
    } else {
      console.log("Get from API")    
      data = await req.loadJSON()
      console.log("Write data to cache")
      
      try {
        fm.writeString(cachePath, JSON.stringify(data))
      } catch (e) {
          console.log("Creating cache failed!")
          conosle.log(e)
      }
        
      lastUpdate = today
    }
  } catch (e) {
      console.error(e)
      if (cacheExists) {
        console.log("Get from cache")
        data = JSON.parse(fm.readString(cachePath))
        lastUpdate = cacheDate
      } else {
          console.log("No fallback to cache possible. Cache is missing.")
      }
  }
  
//   console.log(data)
  return data
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
