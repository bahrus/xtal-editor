// minify.js
var Terser = require("terser");
var fs = require("fs");
var path = require("path");

var options = {
    keep_fnames: true
};

function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles.filter(path => path.match(/\.js$/));
}

function minifyFiles(filePaths) {
  filePaths.forEach(filePath => {
    fs.writeFileSync(
      filePath,
      Terser.minify(fs.readFileSync(filePath, "utf8"), options).code
    );
  });
}

const files = getAllFiles("./dist");
minifyFiles(files);