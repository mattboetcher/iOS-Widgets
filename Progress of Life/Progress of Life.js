// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;

const width = 125
const height = 5
const maxYears = 100
const now = new Date()
let year = args.widgetParameter
if (!year) {
  year = 1950
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
  widget.setPadding(10, 15, 10, 10)
  widget.backgroundColor = Color.white()
  
  createTimeLine(maxYears, now.getFullYear() - year, "My life")
}

function createTimeLine(total, hasPassed, name) {
  const title = widget.addText(name)
  title.textColor = Color.black()
  title.font = Font.boldSystemFont(13)
  widget.addSpacer(5)
  
  const graph = widget.addImage(createProgress(total, hasPassed))
  graph.imageSize = new Size(width, height)
  widget.addSpacer(2)
  
  
  const text = widget.addStack()
  text.textColor = Color.black()
  text.addText("*")
  text.addSpacer()
//   text.addText("-" + (now.getFullYear()-year).toString() + "-")
//   text.addSpacer()
  text.addText("†")
  
}

function createProgress(total,hasPassed) {
  const context = new DrawContext()
  context.size = new Size(width, height)
  context.opaque = false
  context.respectScreenScale = true
  context.setFillColor(new Color("#484848"))
  
  const path = new Path()
  path.addRoundedRect(new Rect(0, 0, width, height), 3, 3)
  context.addPath(path)
  context.fillPath()
  context.setFillColor(Color.green())
  
  const path1 = new Path()
  path1.addRoundedRect(new Rect(0, 0, width * hasPassed / total, height), 3, 3)
  context.addPath(path1)
  context.fillPath()
  return context.getImage()
}
