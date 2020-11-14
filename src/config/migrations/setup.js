exports.up = function(knex) {
    return knex.schema
        .createTable('country', table => {
            table.uuid('id').unique()
            table.string('name')
        })
        .then(() => {
            return knex.schema.createTable('city', table => {
                table.uuid('id').unique()
                table.string('name')
                table
                    .uuid('countryId')
                    .references('id')
                    .inTable('country')
            })
        })
        .then(() => {
            return knex.schema.createTable('address', table => {
                table.uuid('id').unique()
                table.string('street')
                table.uuid('cityId')
                    .references('id')
                    .inTable('city')
            })
        })
        .then(() => {
            return knex.schema.createTable('user', table => {
                table.uuid('id').unique()
                table.string('username').unique()
                table.string('password')
            })
        })
        .then(() => {
            return knex.schema.createTable('profile', table => {
                table.uuid('id').unique()
                table.string('name')
                table
                    .uuid('addressId')
                    .references('id')
                    .inTable('address')
                table
                    .uuid('userId')
                    .references('id')
                    .inTable('user')
            })
        })
        .then(() => {
            // Inserts seed entries
            const countryId = '4ea4ce1b-ae2e-4b7b-928c-46afac06488e';
            return knex("country")
                .insert([ 
                    { id: countryId, name: 'US' }
                ])
                .then(() => {
                    return knex("city").insert([
                        { id: '14b7cad0-61dd-4f21-9d10-481a9aa75fa4', name: 'NY', countryId },
                        { id: '81dfd30d-3c0a-420e-9d60-a081518f6001', name: 'LA', countryId },
                        { id: '462fe71b-adef-401e-a622-5590ca05e4ae', name: 'FL', countryId }
                    ])
                });
        });
}
  
exports.down = function(knex) {
    return knex.schema
        .dropTable('user')
        .dropTable('country')
        .dropTable('city')
        .dropTable('address')
        .dropTable('profile');
}