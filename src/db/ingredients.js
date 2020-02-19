const { Model } = require("./objection");

class Ingredients extends Model {
  static get tableName() {
    return "ingredients";
  }

  static extractAll(list) {
    if (list === undefined) {
      return;
    }
    if (list.ingrList === undefined) {
      return;
    }
    list.ingrList.forEach(item => {
      Ingredients.log(item.name);
      Ingredients.extractAll(item);
    });
  }

  static log(name) {
    Ingredients.query()
      .where("name", "=", name)
      .then(ingr => {
        if (ingr.length == 0) {
          this.query()
            .insert({
              name: name
            })
            .then(() => {})
            .catch(() => {});
        }
      })
      .catch(() => {});
  }
}

module.exports = Ingredients;
