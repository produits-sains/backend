
exports.up = function(knex) {
  return knex.schema.createTable('logs', (t) => {
        t.increments();
        t.timestamp('created_at').defaultTo(knex.fn.now());
        t.enu('severity', ['debug', 'notice', 'warning', 'error']);
        t.string('module');
        t.string('title');
        t.string('info');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logs');
};
