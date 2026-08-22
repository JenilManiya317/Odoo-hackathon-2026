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
insert into activities (city_id, name, type, cost, description) values
((select id from cities where name = 'Paris'), 'Eiffel Tower Visit', 'sightseeing', 30, 'Iconic iron tower with panoramic city views'),
((select id from cities where name = 'Paris'), 'Louvre Museum Tour', 'sightseeing', 20, 'World-famous art museum, home to the Mona Lisa'),
((select id from cities where name = 'Paris'), 'Seine River Dinner Cruise', 'food', 90, 'Evening cruise with a multi-course French dinner'),

((select id from cities where name = 'Tokyo'), 'Senso-ji Temple', 'sightseeing', 0, 'Historic Buddhist temple in Asakusa'),
((select id from cities where name = 'Tokyo'), 'Sushi Making Class', 'food', 60, 'Hands-on sushi workshop with a local chef'),
((select id from cities where name = 'Tokyo'), 'Mount Fuji Day Hike', 'adventure', 120, 'Guided hike with scenic views'),

((select id from cities where name = 'Bangkok'), 'Grand Palace Tour', 'sightseeing', 15, 'Former royal residence and temple complex'),
((select id from cities where name = 'Bangkok'), 'Street Food Night Tour', 'food', 25, 'Guided tasting tour of local night markets'),
((select id from cities where name = 'Bangkok'), 'Muay Thai Class', 'adventure', 20, 'Beginner-friendly martial arts training'),

((select id from cities where name = 'New York'), 'Statue of Liberty Ferry', 'sightseeing', 25, 'Ferry ride and tour of Liberty Island'),
((select id from cities where name = 'New York'), 'Broadway Show', 'entertainment', 150, 'Evening at a Broadway theatre'),
((select id from cities where name = 'New York'), 'Central Park Bike Tour', 'adventure', 35, 'Guided cycling tour through Central Park'),

((select id from cities where name = 'Rome'), 'Colosseum Tour', 'sightseeing', 25, 'Guided tour of the ancient amphitheatre'),
((select id from cities where name = 'Rome'), 'Pasta Making Class', 'food', 55, 'Learn to make fresh pasta from scratch'),

((select id from cities where name = 'Bali'), 'Ubud Rice Terrace Trek', 'adventure', 20, 'Scenic trek through the Tegalalang terraces'),
((select id from cities where name = 'Bali'), 'Balinese Cooking Class', 'food', 30, 'Traditional cooking class with market visit'),

((select id from cities where name = 'Barcelona'), 'Sagrada Familia Tour', 'sightseeing', 28, 'Gaudi''s unfinished masterpiece basilica'),
((select id from cities where name = 'Barcelona'), 'Tapas Walking Tour', 'food', 45, 'Sample tapas across multiple local bars'),

((select id from cities where name = 'Cape Town'), 'Table Mountain Cable Car', 'sightseeing', 30, 'Ride to the summit for panoramic views'),
((select id from cities where name = 'Cape Town'), 'Shark Cage Diving', 'adventure', 180, 'Cage diving experience with great white sharks'),

((select id from cities where name = 'Dubai'), 'Burj Khalifa Observation Deck', 'sightseeing', 40, 'Views from the world''s tallest building'),
((select id from cities where name = 'Dubai'), 'Desert Safari', 'adventure', 70, 'Dune bashing, camel rides, and BBQ dinner'),

((select id from cities where name = 'Sydney'), 'Sydney Opera House Tour', 'sightseeing', 35, 'Guided backstage tour of the iconic venue'),
((select id from cities where name = 'Sydney'), 'Bondi to Coogee Coastal Walk', 'adventure', 0, 'Scenic free walk along Sydney''s coastline');
