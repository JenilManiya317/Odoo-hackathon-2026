-- ============================================================
-- GlobeTrotter Backend: 004 - Seed Data
-- Sample cities and activities so search screens have content
-- ============================================================

-- Cities
insert into cities (name, country, cost_index, popularity) values
('Paris', 'France', 78, 95),
('Tokyo', 'Japan', 82, 92),
('Bangkok', 'Thailand', 40, 88),
('New York', 'USA', 90, 90),
('Rome', 'Italy', 70, 87),
('Bali', 'Indonesia', 45, 85),
('Barcelona', 'Spain', 65, 84),
('Cape Town', 'South Africa', 50, 78),
('Dubai', 'UAE', 85, 80),
('Sydney', 'Australia', 88, 82);

-- Activities (linked to cities via subquery on name)
insert into activities (city_id, name, type, cost, duration, description) values
((select id from cities where name = 'Paris'), 'Eiffel Tower Visit', 'sightseeing', 30, '2 hours', 'Iconic iron tower with panoramic city views'),
((select id from cities where name = 'Paris'), 'Louvre Museum Tour', 'sightseeing', 20, '3 hours', 'World-famous art museum, home to the Mona Lisa'),
((select id from cities where name = 'Paris'), 'Seine River Dinner Cruise', 'food', 90, '2 hours', 'Evening cruise with a multi-course French dinner'),

((select id from cities where name = 'Tokyo'), 'Senso-ji Temple', 'sightseeing', 0, '1.5 hours', 'Historic Buddhist temple in Asakusa'),
((select id from cities where name = 'Tokyo'), 'Sushi Making Class', 'food', 60, '2 hours', 'Hands-on sushi workshop with a local chef'),
((select id from cities where name = 'Tokyo'), 'Mount Fuji Day Hike', 'adventure', 120, 'Full day', 'Guided hike with scenic views'),

((select id from cities where name = 'Bangkok'), 'Grand Palace Tour', 'sightseeing', 15, '2 hours', 'Former royal residence and temple complex'),
((select id from cities where name = 'Bangkok'), 'Street Food Night Tour', 'food', 25, '3 hours', 'Guided tasting tour of local night markets'),
((select id from cities where name = 'Bangkok'), 'Muay Thai Class', 'adventure', 20, '1.5 hours', 'Beginner-friendly martial arts training'),

((select id from cities where name = 'New York'), 'Statue of Liberty Ferry', 'sightseeing', 25, '3 hours', 'Ferry ride and tour of Liberty Island'),
((select id from cities where name = 'New York'), 'Broadway Show', 'entertainment', 150, '2.5 hours', 'Evening at a Broadway theatre'),
((select id from cities where name = 'New York'), 'Central Park Bike Tour', 'adventure', 35, '2 hours', 'Guided cycling tour through Central Park'),

((select id from cities where name = 'Rome'), 'Colosseum Tour', 'sightseeing', 25, '2 hours', 'Guided tour of the ancient amphitheatre'),
((select id from cities where name = 'Rome'), 'Pasta Making Class', 'food', 55, '2.5 hours', 'Learn to make fresh pasta from scratch'),

((select id from cities where name = 'Bali'), 'Ubud Rice Terrace Trek', 'adventure', 20, '2 hours', 'Scenic trek through the Tegalalang terraces'),
((select id from cities where name = 'Bali'), 'Balinese Cooking Class', 'food', 30, '3 hours', 'Traditional cooking class with market visit'),

((select id from cities where name = 'Barcelona'), 'Sagrada Familia Tour', 'sightseeing', 28, '1.5 hours', 'Gaudi''s unfinished masterpiece basilica'),
((select id from cities where name = 'Barcelona'), 'Tapas Walking Tour', 'food', 45, '3 hours', 'Sample tapas across multiple local bars'),

((select id from cities where name = 'Cape Town'), 'Table Mountain Cable Car', 'sightseeing', 30, '2 hours', 'Ride to the summit for panoramic views'),
((select id from cities where name = 'Cape Town'), 'Shark Cage Diving', 'adventure', 180, 'Half day', 'Cage diving experience with great white sharks'),

((select id from cities where name = 'Dubai'), 'Burj Khalifa Observation Deck', 'sightseeing', 40, '1.5 hours', 'Views from the world''s tallest building'),
((select id from cities where name = 'Dubai'), 'Desert Safari', 'adventure', 70, 'Half day', 'Dune bashing, camel rides, and BBQ dinner'),

((select id from cities where name = 'Sydney'), 'Sydney Opera House Tour', 'sightseeing', 35, '1 hour', 'Guided backstage tour of the iconic venue'),
((select id from cities where name = 'Sydney'), 'Bondi to Coogee Coastal Walk', 'adventure', 0, '2.5 hours', 'Scenic free walk along Sydney''s coastline');
