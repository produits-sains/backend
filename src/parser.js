const pegjs = require("pegjs");
const logs = require("./db/logs");
const pegjsUtil = require("pegjs-util");

//Create parser grammarpegjs.generate(
const ASTGenerator = pegjs.generate(`
start
  = ingrs:ingr_list (end .*)? { return () => { return ingrs } }

ingr_list
  = ingr1:ingr separator ingr2:ingr_list { ingr2.unshift(ingr1); return ingr2; } 
  / ingr1:ingr { return [ingr1] } 

ingr
  = qty:(quantity " de ")? name:ingr_name attrs:(attributes)* { 
    const out = {name: name}; 
    
    if(qty != null) {
      attrs.push(["qty", qty[0][1]]);
    }
    attrs.forEach((k) => {
      if(out[k[0]] === undefined) {
        out[k[0]] = [];
      }
      k[1].forEach(item => {
        out[k[0]].push(item);
      });
    });
    return out; 
}

attributes
 = space qty:quantity { return qty;}
 / space* open space* list:ingr_list space* close [\*]* { return ["ingrList", list]; }
 / space ext:ingr_name { return ["extras", [ext]]; }
 / space org:origin   { return ["origin", [org]];}

ingr_name
  = start:ingr_part space name:ingr_name { return start + " " + name; }
  / name:ingr_part { return name; } 

space
 = [ ]+

open
 = "("
 / "["

close
 = ")" 
 / "]"

separator
 = [,][ ]*
 / space [;][ ]*

end
 = [\.]

quantity
 = qty:([0-9]+([,][0-9]+)?) percent:[%]? {
  const data = qty[0].join("") + (qty[1] == null ? "" : qty[1].join(""))
  if(percent !== null) {
    return ["qty", [data + percent]]; 
  }
  else {
    return ["extra", [data]]; 
  }
}


origin
 = open "origine : " org:ingr_part [\*]+ close { return org }

ingr_part 
  = (ingr_name_unused_prefix space)* name:([a-zA-Zâàçéèêïîô'_\-]+) [\*]? { return name.join("") }

ingr_name_unused_prefix
  = "émulsifiant" space* ":"
  / "antioxydant :"
  / "conservateur :"
  / "contient :"
  / "épaississants :"
  / "antioxygènes" space* ":"
  / "additifs" [a-zA-Zâàçéèêïîô' _\-]+ ":"
  / "agent de traitement de la farine :"


`);

module.exports = function(product) {
  //product.parsed.ingrList = ASTGenerator.parse(product.raw.ingrList)();
  
  const result = pegjsUtil.parse(ASTGenerator, product.raw.ingrList.replace(/\//g,"_").toLowerCase());
  if (result.error !== null) {
    logs.error("Parsing Failure: " + product.id, pegjsUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
  }
  else { 
    product.parsed.ingrList = result.ast();
  }
};