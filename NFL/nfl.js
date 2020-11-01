var url='http://www.nfl.com/liveupdate/scores/scores.json'

const json = await get ({ 'url': url })
console.log(json)
