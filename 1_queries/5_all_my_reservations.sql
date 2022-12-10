SELECT reservations.id as id, title, start_date, cost_per_night, t.average_rating as average_rating
FROM users
JOIN reservations ON guest_id = users.id
JOIN properties ON reservations.property_id = properties.id
JOIN (
  SELECT property_id, avg(rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  GROUP BY property_id
) t ON t.property_id = properties.id
WHERE users.id = 1
ORDER BY start_date
LIMIT 10;