# Description

A database application project developed as a part of Lighthouse Labs Web development course. The front-end is forked from lighthouse-labs/LightBnB_WebApp Install the LightBnB_WebApp npm install, run it npm run local, and view it at localhost:3000.

# Project Structure
* Setup related files
  * `docs` documentation info
  * `migrations` files related to creating the database, and its schema
  * `seeds` database fake data used
  * `1_queries` sample database queries
* `LightBnB_WebApp-master`
  * `public` contains all of the HTML, CSS, and client side JavaScript. 
    * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
    * `javascript` contains all of the client side javascript files.
      * `index.js` starts up the application by rendering the listings.
      * `network.js` manages all ajax requests to the server.
      * `views_manager.js` manages which components appear on screen.
      * `components` contains all of the individual html components. They are all created using jQuery.
  * `sass` contains all of the sass files. 
  * `server` contains all of the server side and database code.
    * `server.js` is the entry point to the application. This connects the routes to the database.
    * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
    * `json` is a directory that contains a bunch of dummy data in `.json` files.
    * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.

# ERD
## Diagram

# ERD Info
* `users`
  * `id`: Primary Key
  * `name`
  * `email`
  * `password`

* `property_types`
  * `id`: Primary Key
  * `type`

* `properties
  * `id`: Primary Key
  * `title`
  * `description`
  * `thumbnail_photo_url`
  * `cover_photo_url`
  * `owner_id` : Foreign Key users(id)
  * `cost_per_night`
  * `country`
  * `street`
  * `city`
  * `province`
  * `postal_code`
  * `parking_spaces`
  * `number_of_bedrooms`
  * `number_of_washrooms`
  * `property_type` : Optional, defaults to 1, in future may references property_types(id)
  * `active`

* `reservations
  * `id`: Primary Key
  * `start_date`
  * `end_date`
  * `property_id` : Foreign Key properties(id)
  * `guset_id` : Foreign Key users_id(id)

* `property_reviews
  * `id`: Primary Key
  * `guest_id` : Foreign Key users(id)
  * `property_id` : Foreign Key properties(id)
  * `reservation_id` : Foreign Key reservations(id)
  * `message`
  * `rating`

# Migrations
## schema.sql
Creates database `lightbnb` and switches to it.

# Sample Queries
## 1_user_login.sql
Selects *id, name, email & password* of a given user; here 'tristanjacobs@gmail.com'.

 id |     name      |          email          |   password
----+---------------+-------------------------+--------------
  1 | Devin Sanders | tristanjacobs@gmail.com |  $2a$10$FB...
(1 row)

## 2_average_length_of_reservation.sql
Selects the average duration of all reservations.

  average_duration   
---------------------
 14.6636000000000000
(1 row)

## 3_property_listings_by_city.sql
Shows all details about properties located in Vancouver including their average rating.

 id  |       title        | cost_per_night |   average_rating   
-----+--------------------+----------------+--------------------
 224 | Nature bite        |          10526 | 4.1000000000000000
 197 | Build they         |          34822 | 4.1000000000000000
  47 | Aside age          |          35421 | 4.2500000000000000
 149 | Present television |          53062 | 4.2222222222222222
(4 rows)

## 4_most_visited_cities.sql
Gets a list of the most visited cities. Selects the name of the city and the number of reservations for that city.

       city        | total_reservations 
-------------------+--------------------
 Carcross          |                405
 Town of Hay River |                379
 Whitehorse        |                376
 Town of Inuvik    |                298
 (251 rows)

## 5_all_my_reservations.sql
Shows all past reservations for a user; in this case user with users.id = 1.

- Selects all columns from the
  - reservations table,
  - properties table and the average rating of the property.
- Orders the results from most recentto least recent.
- Limits the results to 10.