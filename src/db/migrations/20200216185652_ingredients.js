
exports.up = function(knex) {
  return knex.schema.createTable('ingredients', (t) => {
        t.increments();
        t.string('name').unique();
        t.enu('type', ['additive', 'product', ',none', 'unknown']).defaultTo('unknown');
        t.integer('score').defaultTo('-1');
        t.string('additiveId');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ingredients');
};
