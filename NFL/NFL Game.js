// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
const defaultFontSize = 13
const smllMdmWdgtMaxCntnt = 6
const largeWdgtMaxCntnt = 12
let json = await loadJSONItems()

const widget = new ListWidget()
await createWidget(json)

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentLarge()
}
Script.setWidget(widget)
Script.complete()

// ------------------------------------------------

// build the content of the widget
async function createWidget(json) {
  
  widget.backgroundColor = Color.white()
  widget.setPadding(15, 15, 15, 10)
  
  // Create Title
  const titleStack = widget.addStack()
  titleStack.layoutHorizontally()
//   titleStack.leftAlignText()
  createTitleStack(titleStack, "Teams", 95)
  createTitleStack(titleStack, "Scores", 60)
  createTitleStack(titleStack, "Qtr", 40)
  createTitleStack(titleStack, "Dwn", 30)
  createTitleStack(titleStack, "Togo", 35)
  createTitleStack(titleStack, "TV", 45)
  
  widget.addSpacer(2)
//   console.log(json)
  const keys = Object.keys(json)
  
  var i = 0
  for (var key of keys) {
    if ((i == smllMdmWdgtMaxCntnt) && (config.widgetFamily == "medium")) {
      break
    }
    else if ((i == largeWdgtMaxCntnt) && (config.widgetFamily == "large")) {
      break
    }
    
    // Create Stack
    const stack = widget.addStack()
    stack.layoutHorizontally()
    stack.centerAlignContent()
    
    // Load home logo
    const image = await loadImage(`https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${json[key].home.abbr}.png`)
    const imgHomeWidget = stack.addImage(image)
    imgHomeWidget.imageSize = new Size(16, 16)
    
    // Create Teams Stack
    createTextStack(stack, `${json[key].home.abbr}`, 28)
    createTextStack(stack, ` - `, 10)
    createTextStack(stack, `${json[key].away.abbr}`, 27)
    
    // Load away logo
    const image2 = await loadImage(`https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${json[key].away.abbr}.png`)
    const imgAwayWidget = stack.addImage(image2)
    imgAwayWidget.imageSize = new Size(16, 16)
    
    // Create Score Stack
    createTextStack(stack, `${json[key].home.score["T"]}/${json[key].away.score["T"]}`, 60)
    
    if (config.widgetFamily != "small" ) {
      // Create Quater Stack
      createTextStack(stack, `${json[key].qtr}`, 60)
      createTextStack(stack, `${json[key].down}`, 20)
      createTextStack(stack, `${json[key].togo}`, 20)
      createTextStack(stack, `${json[key].media.tv}`, 45)
    }
    
    widget.addSpacer(1)
    
    i++
  }
   // Create Timestamp
  let timeStamp = formatDate(new Date())
  let wDate = widget.addText(timeStamp);
  wDate.font = Font.mediumRoundedSystemFont(8)
  wDate.textColor = Color.gray();
  wDate.centerAlignText();
  
  widget.url = "https://nfl.com"
  
  return widget
}


function createTextStack(stack, text, width) {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(width, 20)
  const widgetText = tmpStack.addText(text)
  widgetText.font = Font.systemFont(defaultFontSize)
  widgetText.textColor = Color.black()
  widgetText.leftAlignText()
  
  return widgetText
}

function createTitleStack(stack, text, width) {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(width, 20)
  const widgetText = tmpStack.addText(text)
  widgetText.font = Font.boldSystemFont(defaultFontSize)
  widgetText.leftAlignText()
  
  return widgetText
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
  let img = await req.loadImage()
  
  return img
}

function formatDate(timestamp) {
  let hours = timestamp.getHours();
  let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
  let time = "Last Update: " + hours + ":" + minutes;
  return time;
}
