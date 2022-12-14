const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE users.email LIKE $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE users.id = $1`, [Number(id)])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {
  const userName = user.name;
  const userEmail = user.email;
  const userPassword = user.password;
  return pool
    .query(`INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3)
            RETURNING *;`, [userName, userEmail, userPassword])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, avg(rating) as average_rating
            FROM reservations
            JOIN properties ON reservations.property_id = properties.id
            JOIN property_reviews ON properties.id = property_reviews.property_id
            WHERE reservations.guest_id = $1
            GROUP BY properties.id, reservations.id
            ORDER BY reservations.start_date
            LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = function(options, limit = 10) {
  // Setup an array to hold any parameters
  const queryParams = [];
  let countOptions;
  countOptions = 0;
  // Start the query with all information that comes before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // Add the city to the params array and create a WHERE clause for the city
  if (options.city) {
    countOptions += 1;
    const cityNameLength = options.city.length;
    queryParams.push(`%${options.city.slice(1, cityNameLength - 1)}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // Add the owner_id query
  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `WHERE properties.owner_id = $${queryParams.length} `;
  }

  // Add the minimum_price_per_night query
  if (options.minimum_price_per_night) {
    countOptions += 1;
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    if (countOptions > 1) {
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    }
  }

  // Add the maximum_price_per_night query
  if (options.maximum_price_per_night) {
    countOptions += 1;
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    if (countOptions > 1) {
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    }
  }

  // Add the minimum_rating query
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `
    GROUP BY properties.id, property_reviews.property_id
    HAVING avg(property_reviews.rating) >= $${queryParams.length} 
    `;
  } else {
    queryString += `
    GROUP BY properties.id, property_reviews.property_id
    `;
  }

  // Add result limit query
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // Run the query
  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function(property) {
  const input = [];
  const keys = ["owner_id", "title", "description", "thumbnail_photo_url", "cover_photo_url", "cost_per_night", "street", "city", "province", "post_code", "country", "parking_spaces", "number_of_bathrooms", "number_of_bedrooms"];
  for (const key of keys) {
    input.push(property[key]);
  }
  return pool
    .query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;`, input)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addProperty = addProperty;
