// search for md files

(function () {
  const fs = require('fs');
  let mdFile = "index.md";
  let str = fs.readFileSync(mdFile,'utf8');

    // See if the file exists
    fs.exists(mdFile, function(exists) {
      if(!exists) {
        console.log('nope');
      } else {
        console.log('yep');
      }
    });
})();


// convert md to html

// create new html file where 
// folder = name of md file &&
// index.html is added to folder
// with md file contents in index.html