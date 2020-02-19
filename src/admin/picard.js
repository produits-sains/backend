const cheerio = require("cheerio");
const request = require("request");
const parser = require("../parser.js");
const { preparePage } = require("./utils");
const ingredients = require("../db/ingredients"); 

const MAX_PICARD_ID = 100000;

//generate a number lefpaded by 'max' zeros
const leftpad = function(num, max) {
  const length = (num + '').length;
  let pad = '';
  for(let i = 0; i < max - length; i += 1) {
    pad += '0';
  }

  return pad + num;
}

//extract product information from the picard website
const parseProductAndExtractDataById = function (id, done) {
  
  //generate request to the picard website
  request('http://www.picard.fr/produits/a-'+leftpad(id, 18)+'.html', function (error, response, html) {
    try {
      if (!error && response.statusCode == 200) {
        //data are loaded, we need to parse them
        const $ = cheerio.load(html);
        const output = {raw: {}, parsed: {}, id: id};
        
        //extract ingredient list
        
        const children = $(".commercial_info").parent().children("p");
        for(let idx in children) {
          const txt = children.eq(idx).text().trim();
          if(txt != "") {
            output.raw.ingrList = txt;
            break;
          }
        }
        
        //check data
        if(output.raw.ingrList == "") {
          done(null, {error: "Unable to parse data", data: output});
          return;
        }
        
        //parse website data
        parser(output);
        
        //extract all ingredients data
        ingredients.extractAll(output.parsed);
        
        console.log("extracted: " + id);
        
        //send output to callback with no error
        done(output, null);
      }
      else if (error) {
        //log request error
        done(null, {error: "Request error", data: error});
      }
      else {
        //log bad response from website
        done(null, {error: "Unexpected status code", data: response.statusCode});
      }
    }
    catch(e) {
      console.log(e);
      done(null, {error: "Unexpected error", data: JSON.stringify(e, Object.getOwnPropertyNames(e))});
    }
  });
};

const extractAllProducts = function(last_extracted = null) {
  if(last_extracted == null) {
    last_extracted = -1;
  }
  
  if(last_extracted < MAX_PICARD_ID) {
    parseProductAndExtractDataById(last_extracted, () => extractAllProducts(last_extracted + 1));
  }
}

module.exports = function(app) {
  app.get("/admin/picard", app.locals.need_logged, function(req, res) {
     preparePage(req, res, "Picard")
      .renderActions(
        "Picard",
        ["Extraction complete"]
      )
      .render();
  });
  
  app.post("/admin/picard/action", app.locals.need_logged, function(req, res) {
    switch(req.body.action) {
      case "Extraction complete":
        extractAllProducts();
        break;
    }
    res.redirect("/admin/picard");
  });
  
  app.locals.picard = {
    parseProductAndExtractDataById: parseProductAndExtractDataById,
  }
};
