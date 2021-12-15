const brackets = /[|][|]/g;
const problem = /[\w|\W|\s]*[cpp|java|py3|js|kt][\s]*[|][|][\w|\W|\s]*[|][|]/g;
var all = new RegExp(problem);

var k = paragraph.search(all);

console.log(paragraph[paragraph.search(all)]);