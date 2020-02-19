const { Model } = require('objection');
const Knex = require('knex');
const KnexConfig = require('../../knexfile');

// Initialize knex.
const knex = Knex(KnexConfig.development);

// Give the knex object to objection.
Model.knex(knex);

module.exports = {
    knex,
    Model
}