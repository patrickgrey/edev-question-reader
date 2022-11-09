const xml2js = require('xml2js');
const fs = require('fs').promises;
var util = require('util');

module.exports = async function () {

  const manifestFolders = ['ACAS-TCAS'];
  var parser = new xml2js.Parser({ explicitArray: false });

  async function loadXML(folder) {
    const path = `not-processed/_xml/${folder}/imsmanifest.xml`;
    return await fs.readFile(path, "utf8");
  }

  // Recursive traverse object utility function.
  const traverse = function (o, fn, scope = []) {
    for (let i in o) {
      fn.apply(this, [i, o[i], scope]);
      if (o[i] !== null && typeof o[i] === "object") {
        traverse(o[i], fn, scope.concat(i));
      }
    }
  };

  function findNode(keyFind) {
    traverse(data, (key, value, scope) => {
      if (keyFind === key) {
        console.log(`${key}: ${value}: ${scope}`);
      }
    });
  }



  let options = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    attributesGroupName: "@_"
  };

  function showResult(data) {
    // console.log("data.length: ", data);

    for (let indexM = 0; indexM < data.length; indexM++) {
      // console.log("data[indexM]: ", data[indexM]);



      const manifest = data[indexM].manifest;
      // console.log("manifest: ", manifest.metadata["imsmd:lom"]["imsmd:title"]["imsmd:string"]["_"]);

      const title = manifest.metadata["imsmd:lom"]["imsmd:title"]["imsmd:string"]["_"] || "No title";

      // console.log("manifest.resources: ", manifest.resources.resource);


      for (let indexR = 0; indexR < manifest.resources.resource.length; indexR++) {
        // console.log("hi")
        const resource = manifest.resources.resource[indexR];
        console.log("resource: ", resource.$.href);
      }
    }
  }

  let xmlFilesArray = [];

  for (let index = 0; index < manifestFolders.length; index++) {
    const manifest = manifestFolders[index];
    const xml = await loadXML(manifest);
    parser.parseStringPromise(xml).then(function (result) {
      xmlFilesArray.push(result);
      showResult(xmlFilesArray)
    })
      .catch(function (err) {
        // Failed
      });

  }

  // console.log("data: ", JSON.stringify(data));






  // findNode("imsmd:string", "0");

  // let jsonObj;
  // try {
  //   jsonObj = parser.parse(xml, options);
  //   console.log("jsonObj: ", jsonObj);
  // } catch (error) {
  //   jsonObj = { error: error.message }
  //   console.log(error.message)
  // }
  // console.log("xml: ", xml);



  // let data = json.feed.entry.map((video) => {
  //   video.code = video['yt:videoId'];
  //   video.image = video['media:group']['media:thumbnail'].url;
  //   video.date = video.published;
  //   return video;
  // });
  return {};
};