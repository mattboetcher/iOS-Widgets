// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
const widget = new ListWidget()
await createWidget()

var date = new Date()

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// ------------------------------------------------

// build the content of the widget
async function createWidget() {
  
  widget.backgroundColor = new Color("#002d39")
  
  stack = widget.addStack()
  stack.size = new Size(160, 160)
  stack.centerAlignContent()
  stack.layoutVertically()
  stack.backgroundColor = Color.clear()
  stack.cornerRadius = 25
  stack.useDefaultPadding()
  stack.topAlignContent()
  stack.borderColor = new Color("fffA96")
  stack.borderWidth = 25
  stack.setPadding(20, 20, 10, 0)
  
  
  let week = stack.addText("WEEK")
  week.font = new Font("Arial Black", 35)
  week.textColor = new Color("ff9090")
  week.centerAlignText()
  
  let weekNumber = getCurrentWeek()
  let number = stack.addText(`${weekNumber}`)
  number.textColor = new Color("ff9090")
  number.font = new Font("Arial Black", 70)
  number.centerAlignText()
  
  return widget
}

function getCurrentWeek() {
  var date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  var week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}
  

