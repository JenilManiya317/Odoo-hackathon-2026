"""
Travel chatbot training data — curated Q&A pairs organized by intent.
Used to train the TF-IDF + cosine similarity NLP model.
"""

TRAVEL_QA_PAIRS = [
    # ── Greetings ──────────────────────────────────────────────────────────────
    ("hello", "Hi there! I'm Trotter AI, your personal travel assistant. Where are you dreaming of going?"),
    ("hi", "Hey! 👋 I'm Trotter AI. Ask me anything about travel — destinations, itineraries, visas, or tips!"),
    ("hey", "Hello! Ready to plan your next adventure? I'm here to help you explore the world. 🌍"),
    ("good morning", "Good morning! ☀️ A perfect day to plan a trip. Where shall we explore today?"),
    ("good evening", "Good evening! 🌙 Planning a getaway? Tell me your dream destination!"),
    ("what's up", "Just helping travelers discover amazing places! What destination are you curious about?"),
    ("how are you", "I'm great and ready to help you plan an amazing trip! What's on your travel wish list?"),
    ("greetings", "Greetings, explorer! I'm Trotter AI, your travel companion. How can I help you today?"),

    # ── Bot Identity ────────────────────────────────────────────────────────────
    ("who are you", "I'm Trotter AI 🌐 — your intelligent travel assistant built into GlobeTrotter. I can help with destinations, itineraries, packing tips, visa info, budgets, and more!"),
    ("what can you do", "I can help you with: 🗺️ destination recommendations, 📅 itinerary planning, 💰 budget tips, 🛂 visa info, 🌤️ weather advice, 🍽️ food recommendations, and ✈️ flight tips!"),
    ("what are you", "I'm an AI travel assistant. Think of me as your knowledgeable friend who's been everywhere! Ask me about any destination."),
    ("are you a bot", "Yes, I'm Trotter AI — a smart travel bot! I use natural language processing to understand your travel questions and give you useful, actionable answers."),
    ("help", "I'm here to help! You can ask me about: destinations, best time to visit, visa requirements, local food, budget planning, packing lists, safety tips, and much more! 🌍"),

    # ── Farewells ───────────────────────────────────────────────────────────────
    ("bye", "Goodbye! Safe travels and happy adventures! ✈️ Come back whenever you need travel advice."),
    ("goodbye", "Farewell, explorer! May your journeys be filled with wonder. 🗺️ See you soon!"),
    ("thanks", "You're welcome! Happy to help plan your adventures. Bon voyage! 🌟"),
    ("thank you", "My pleasure! If you have more travel questions, I'm always here. Happy travels! ✈️"),
    ("see you", "See you next time! May every journey be an adventure! 🌍"),

    # ── Popular Destinations ────────────────────────────────────────────────────
    ("paris", "Paris 🗼 is the City of Love! Must-sees: Eiffel Tower, Louvre, Notre-Dame, Montmartre. Best time: April–June or Sep–Oct. Budget: ~€100–200/day. Try croissants at local boulangeries!"),
    ("france", "France offers incredible diversity — Paris for culture, Provence for lavender fields, Côte d'Azur for beaches, and Alps for skiing. The food and wine alone are worth the trip!"),
    ("bali", "Bali 🌴 is a paradise of temples, rice terraces, and beaches! Visit Ubud for culture, Seminyak for nightlife, Nusa Penida for cliffs. Best time: April–October (dry season). Very budget-friendly!"),
    ("tokyo", "Tokyo 🗾 is an incredible blend of ultra-modern and traditional Japan! Visit Shibuya, Shinjuku, Asakusa temple, and day-trip to Mt. Fuji. Best time: March–May (cherry blossoms) or Oct–Nov."),
    ("japan", "Japan is magical! 🎋 Tokyo for city life, Kyoto for temples, Osaka for food, Hiroshima for history. Get a JR Pass for bullet trains. Best time: spring (cherry blossoms) or autumn (foliage)."),
    ("new york", "New York City 🗽 never sleeps! Must-dos: Central Park, Times Square, Brooklyn Bridge, MoMA. Budget: $150–350/day. Best time: April–June or Sep–Nov. The food scene is world-class!"),
    ("london", "London 🎡 is a treasure trove of history and culture! Visit Big Ben, Tower of London, British Museum, and Buckingham Palace. Best time: June–August. Budget: £80–200/day."),
    ("rome", "Roma! 🏛️ The Eternal City has the Colosseum, Vatican, Trevi Fountain, and amazing pasta. Best time: April–May or Sep–Oct to avoid summer crowds. Budget: €80–150/day."),
    ("italy", "Italy 🍕 is a dream destination — Rome for history, Florence for art, Venice for canals, Amalfi Coast for scenery. The cuisine is unforgettable. Rent a car to explore the countryside!"),
    ("maldives", "The Maldives 🏝️ offers crystal-clear lagoons and overwater bungalows. Perfect for honeymooners! Best time: November–April (dry season). Budget-tip: male city hotels + day trips to atolls."),
    ("dubai", "Dubai 🌇 dazzles with the Burj Khalifa, Palm Jumeirah, and world-class shopping. Also explore the old souks and desert safaris. Best time: November–March. Tax-free shopping is amazing!"),
    ("singapore", "Singapore 🦁 packs incredible diversity into a tiny city-state! Gardens by the Bay, Marina Bay Sands, Hawker food, and Sentosa Island. Very safe and clean. Best time: any — it's year-round!"),
    ("thailand", "Thailand 🐘 has it all — Bangkok's temples, Chiang Mai's culture, Phuket's beaches, Koh Samui's islands. Food is delicious and cheap! Best time: Nov–March (cool dry season)."),
    ("barcelona", "Barcelona 🌊 is stunning! Sagrada Família, Park Güell, La Boqueria market, and beautiful beaches. Best time: May–June or Sep–Oct. Tapas and sangria are a must!"),
    ("spain", "Spain ❤️ offers diverse experiences — Barcelona's architecture, Madrid's museums (Prado!), Seville's flamenco, Costa del Sol's beaches. Food culture is exceptional!"),
    ("greece", "Greece ⛵ has iconic white-washed Santorini, historic Athens (Acropolis!), party island Mykonos, and beautiful Crete. Best time: May–June or Sep–Oct. The Mediterranean food is incredible!"),
    ("new zealand", "New Zealand 🏔️ is an outdoor paradise — fjords, volcanoes, bungee jumping, and Lord of the Rings landscapes! Best time: Dec–Feb (summer). North Island for geysers, South Island for mountains."),
    ("australia", "Australia 🦘 is vast and diverse — Sydney Opera House, Great Barrier Reef, Uluru, and amazing wildlife. Best time varies by region. Budget: AUD$150–250/day."),
    ("canada", "Canada 🍁 offers stunning nature — Banff, Niagara Falls, Vancouver, and Quebec City. Amazing in both summer (hiking) and winter (skiing). Very multicultural and friendly!"),
    ("india", "India 🕌 is a sensory explosion! Taj Mahal in Agra, Jaipur's palaces, Kerala's backwaters, Goa's beaches, Mumbai's energy. Incredibly diverse food. Budget-friendly for most travelers."),
    ("morocco", "Morocco 🏜️ is exotic and fascinating — Marrakech's medina, Sahara Desert camel treks, Atlas Mountains, and coastal Essaouira. Haggling in souks is an experience! Best time: March–May."),
    ("peru", "Peru 🦙 is home to Machu Picchu, the Sacred Valley, Lake Titicaca, and the Amazon rainforest. Best time: May–September (dry season). Altitude sickness tip: acclimatize in Cusco first!"),
    ("mexico", "Mexico 🌮 is incredibly diverse — Mexico City's culture, Yucatán's Mayan ruins, Cancún's beaches, Oaxaca's food scene, and Copper Canyon. Very friendly people!"),
    ("portugal", "Portugal 🍷 is Europe's best-kept secret! Lisbon's trams and pastéis de nata, Porto's wine caves, Algarve's dramatic cliffs, and Sintra's fairy-tale palaces. Affordable and beautiful!"),
    ("switzerland", "Switzerland 🏔️ is breathtaking — Zermatt & Matterhorn, Interlaken for adventure sports, Zurich & Geneva for city life, and the Jungfrau region for skiing. Expensive but absolutely stunning!"),
    ("egypt", "Egypt 🐫 holds ancient wonders — Great Pyramids of Giza, Sphinx, Luxor's temples, and a Nile cruise. Best time: October–April (avoid summer heat). Budget-friendly outside tourist spots."),
    ("iceland", "Iceland 🌋 is otherworldly — Northern Lights (Sep–Mar), midnight sun (Jun–Jul), geysers, waterfalls, and glaciers. Ring Road is the ultimate road trip! Expensive but unforgettable."),
    ("south africa", "South Africa 🦁 offers incredible safari experiences — Kruger National Park, plus Cape Town's Table Mountain, wine country, and the Garden Route. Best time: May–Sep for wildlife."),
    ("vietnam", "Vietnam 🍜 is amazing value — Ha Long Bay, Hoi An's ancient town, Hanoi's street food, Ho Chi Minh City's energy, and Sapa's rice terraces. Pho and banh mi are incredible!"),

    # ── Travel Planning ─────────────────────────────────────────────────────────
    ("how to plan a trip", "Great question! Here's a trip planning framework: 1️⃣ Choose destination & dates, 2️⃣ Set a budget, 3️⃣ Book flights early (2–3 months ahead), 4️⃣ Book accommodation, 5️⃣ Research visa requirements, 6️⃣ Plan activities, 7️⃣ Get travel insurance. Which step do you need help with?"),
    ("trip planning", "I'd love to help you plan! Tell me: 📍 Where do you want to go? 📅 How many days? 💰 What's your budget? 🎯 What kind of trip (adventure, culture, relaxation, family)? With that info, I can create a personalized plan!"),
    ("itinerary", "I can help build an itinerary! Key tips: don't over-pack your schedule (2–3 main sights per day), include buffer time, book popular attractions in advance, mix busy days with relaxed ones. Which destination's itinerary do you need?"),
    ("7 day itinerary", "A 7-day itinerary is a great length! I can suggest detailed day-by-day plans for most popular destinations. Which country or city are you planning to visit?"),
    ("best time to visit", "The best time varies by destination! Generally: ☀️ Avoid peak summer crowds (go shoulder season), 🌧️ Check monsoon/rainy seasons, ❄️ Winter can be great for off-season deals. Which specific destination are you asking about?"),
    ("where should i go", "I'd love to help you find your perfect destination! Tell me: 🎯 What type of trip? (beach, city, adventure, culture), 💰 Budget range?, 📅 How long?, 🌍 Any regions you prefer? I'll give you my top picks!"),
    ("travel recommendations", "My top recommendations depend on your travel style! 🏖️ Beach lovers: Maldives, Bali, Greece, Thailand 🏛️ Culture seekers: Italy, Japan, Morocco, Peru 🌿 Adventure: New Zealand, Nepal, Costa Rica, Iceland 🏙️ City trips: Tokyo, New York, London, Singapore. What's your style?"),

    # ── Budget & Money ──────────────────────────────────────────────────────────
    ("budget travel", "Budget travel tips: ✈️ Use Google Flights/Skyscanner for cheap flights, 🏠 Stay in hostels or Airbnb, 🍜 Eat local street food, 🚌 Use public transport, 🎫 Get city passes for attractions, 📱 Get local SIM cards. Many amazing destinations are very affordable!"),
    ("cheap destinations", "Best budget-friendly destinations in 2025: 🇻🇳 Vietnam (~$30–50/day), 🇮🇩 Bali ($30–60/day), 🇵🇹 Portugal ($60–100/day), 🇲🇽 Mexico ($40–70/day), 🇨🇿 Czech Republic ($50–80/day), 🇮🇳 India ($25–50/day). All offer incredible experiences!"),
    ("how much does it cost", "Travel costs vary widely! A rough daily budget guide: 💸 Budget: $30–60 (SE Asia, Eastern Europe), 💰 Mid-range: $60–150 (Mediterranean, South America), 💎 Luxury: $200+ (Switzerland, Maldives, Japan). What destination are you budgeting for?"),
    ("save money travel", "Smart ways to save on travel: 1) Book flights on Tuesdays/Wednesdays, 2) Travel shoulder season, 3) Use travel credit cards with miles, 4) Cook some meals yourself, 5) Walk instead of taxis, 6) Free museum days, 7) Book accommodation with free cancellation and compare prices!"),
    ("travel insurance", "Travel insurance is highly recommended! It covers: medical emergencies, trip cancellation, lost luggage, and delays. Look for policies with good medical coverage (min $100k) especially for adventure activities. Compare at InsureMyTrip or World Nomads."),

    # ── Visa & Documents ────────────────────────────────────────────────────────
    ("visa", "Visa requirements depend on your passport and destination. 📋 Key tips: Apply at least 4–6 weeks before travel, check the official embassy website, ensure your passport is valid for 6+ months beyond travel dates. Which country's visa do you need info about?"),
    ("passport", "Passport tips: ✅ Ensure validity 6+ months beyond your return date, 📄 Some countries need blank pages, 📱 Keep a digital copy in email/cloud, 🆔 Carry it (or a copy) at all times. Renew your passport well before your trip — processing can take 6–8 weeks!"),
    ("visa on arrival", "Many countries offer visa on arrival or e-visa for most passport holders — Thailand, Indonesia, Sri Lanka, Kenya, Tanzania, and more. Check VisaHQ.com or the official immigration website for your destination to confirm eligibility."),
    ("do i need a visa", "Visa requirements depend on your nationality. I'd recommend checking: 🌐 VisaHQ.com, 🌐 IATA Travel Centre, or 🌐 The official embassy website of your destination country. Which country are you traveling to, and what passport do you hold?"),

    # ── Packing ─────────────────────────────────────────────────────────────────
    ("what to pack", "Packing essentials: 👕 Versatile clothing (layers!), 🔌 Universal adapter, 💊 First aid kit & medications, 📄 Documents (passport, insurance, bookings), 🔋 Power bank, 💧 Reusable water bottle, 🎒 Day pack, 📱 Offline maps downloaded. Pack light — you can buy most things locally!"),
    ("packing tips", "Pro packing tips: 🎒 Use packing cubes to organize, 👖 Roll clothes instead of folding (saves space), 👟 Wear your heaviest shoes on the plane, 🌂 Pack a compact rain jacket, 📦 Leave room for souvenirs, ✅ Use a checklist app like PackPoint!"),
    ("packing list", "A solid packing list: Documents, Money/cards, Phone+charger, Power bank, Clothes (versatile/layered), Toiletries (travel-size), First aid kit, Sunscreen, Insect repellent, Day bag, Snacks for travel, Camera, Earplugs, Travel pillow. Anything specific to your destination?"),

    # ── Transportation ──────────────────────────────────────────────────────────
    ("flights", "Flight booking tips: ✈️ Book 6–8 weeks ahead for domestic, 2–4 months for international, 📅 Fly on Tuesdays/Wednesdays for cheaper fares, 🔔 Set price alerts on Google Flights/Skyscanner, 🌅 Early morning flights are often cheaper, 🔄 Check nearby airports too!"),
    ("cheap flights", "Find cheap flights: Use Google Flights (great for flexible date search), Skyscanner, Hopper (price prediction), Kayak. Pro tip: Clear your browser cookies/use incognito when searching — prices can increase with repeated searches!"),
    ("train travel", "Train travel is often the best way to see a country! 🚂 Europe: Eurail Pass is excellent. Japan: JR Pass for bullet trains. India: book IRCTC in advance. It's scenic, relaxing, and often city-center to city-center!"),
    ("how to get around", "Getting around tips: 🚌 Public transit is cheapest (learn the metro/bus system), 🚗 Rent a car for rural/road trips, 🛵 Scooters in SE Asia, 🚕 Grab/Bolt apps for taxis (safer than street taxis), 🚶 Walk when possible — you'll discover hidden gems!"),
    ("airport tips", "Airport survival tips: ⏰ Arrive 2–3 hours early (international), 📲 Download airline app for mobile boarding pass, 💳 Lounge access with Priority Pass, 🧳 Use TSA PreCheck/Global Entry if US-based, 💱 Don't exchange currency at airports (bad rates!), 🔌 Charge all devices before boarding!"),

    # ── Accommodation ───────────────────────────────────────────────────────────
    ("where to stay", "Accommodation options: 🏨 Hotels (comfort, service), 🏠 Airbnb (local feel, often cheaper for groups), 🛏️ Hostels (social, budget-friendly), 🏡 B&Bs (personal touch), 🏕️ Glamping (unique experience). Best depends on your budget, travel style, and destination!"),
    ("best hotels", "For finding great hotels: 🌟 Booking.com (largest selection), 🌟 Airbnb (local experience), 🌟 Hotels.com (loyalty rewards), 🌟 Agoda (great for Asia). Look for properties with free cancellation, read recent reviews, and book in the right neighborhood!"),
    ("hostel", "Hostels are amazing for solo travelers! 🛏️ You get to meet people from around the world. Tips: Book private rooms if you want privacy, check reviews for cleanliness and social vibe, many hostels offer free walking tours and social events. Hostelworld is the best booking platform!"),
    ("airbnb", "Airbnb is great for: longer stays, group travel, kitchen access (saves on food costs), and experiencing neighborhoods like a local. Tips: Check Superhost status, read all reviews carefully, communicate with the host before booking, and understand cancellation policies!"),

    # ── Food & Culture ───────────────────────────────────────────────────────────
    ("local food", "Experiencing local food is one of the best parts of travel! Tips: 🍜 Eat where locals eat (not tourist traps), 🌮 Try street food (often the most authentic), 🍽️ Visit local markets, 📱 Use TripAdvisor/Google Maps reviews, 🌿 Tell restaurants about dietary restrictions in the local language!"),
    ("food safety", "Food safety abroad: ✅ Eat hot, freshly cooked food, 💧 Drink bottled water in developing countries, 🥗 Be cautious with raw vegetables washed in tap water, 🧊 Avoid ice unless restaurant is reliable, 🍦 Choose busy food stalls (high turnover = fresher food). Carry antidiarrheal meds just in case!"),
    ("cultural tips", "Cultural etiquette tips: 🙏 Research local customs before visiting, 👗 Dress modestly at religious sites, 📸 Ask before photographing people, 💰 Learn a few local phrases (locals love it!), 🥢 Follow local dining etiquette, 🤝 Greeting customs vary widely by culture!"),
    ("language tips", "Language tips for travel: 📱 Download Google Translate offline, 🗣️ Learn basic phrases: hello, thank you, please, where is..., 📖 Duolingo for basics before your trip, 🌐 Most tourist areas in major cities have English speakers, 💌 Show written addresses to taxi drivers!"),

    # ── Safety ──────────────────────────────────────────────────────────────────
    ("is it safe", "Safety is a reasonable concern! Most popular destinations are safe for tourists with common-sense precautions. Tips: 📋 Check your government's travel advisories, 📱 Share your itinerary with someone, 💼 Use hotel safes for valuables, 🚫 Avoid displaying expensive items, 🌙 Be extra cautious at night. Which destination are you asking about?"),
    ("travel safety tips", "Essential safety tips: 🔒 Keep digital/physical copies of all documents, 📱 Have local emergency numbers saved, 💳 Carry minimal cash, use cards, 🏥 Know where the nearest hospital is, 🚨 Register with your embassy for long trips, 📦 Use TSA-approved luggage locks, 🤝 Trust your instincts!"),
    ("pickpockets", "Protect yourself from pickpockets: 👜 Use a money belt under your clothes, 🎒 Keep backpack in front in crowds, 🚫 Don't use phone in crowded areas, 💳 Spread money across different pockets, 📋 Never leave bags unattended, 🌊 Beach: use waterproof cases and don't bring valuables!"),
    ("solo travel", "Solo travel is incredible and life-changing! Tips: 🌍 Start with safe, solo-friendly destinations (Portugal, Japan, Iceland), 🏠 Stay in social hostels to meet people, 📱 Share your location with family/friends, 🗺️ Plan loosely — spontaneity is the joy of solo travel, 💪 Trust yourself — you're more capable than you think!"),

    # ── Health ──────────────────────────────────────────────────────────────────
    ("travel health", "Health tips for travel: 💉 Check required/recommended vaccines 4–6 weeks before travel, 💊 Bring prescription medications (with documentation), 🦟 Malaria prophylaxis for affected regions, ☀️ Use SPF 50 sunscreen, 💧 Stay hydrated, 🩺 Get comprehensive travel insurance with medical coverage!"),
    ("jet lag", "Beat jet lag: ✈️ Adjust sleep schedule 2–3 days before, ☀️ Get sunlight on arrival, 💧 Stay hydrated, ❌ Avoid alcohol on the plane, 🌙 Don't nap on arrival — push to local bedtime, 💊 Melatonin helps regulate sleep (ask your doctor). It typically takes 1 day per timezone crossed to adjust!"),
    ("altitude sickness", "Altitude sickness prevention: 🏔️ Ascend gradually (no more than 300–500m gain per day above 3000m), 💧 Drink lots of water, ❌ Avoid alcohol and strenuous exercise initially, 💊 Acetazolamide (Diamox) can help — consult your doctor, 📍 Acclimatize in cities like Cusco or La Paz before higher altitudes!"),
    ("vaccinations", "Common travel vaccines: 💉 Hepatitis A & B, Typhoid (developing countries), Yellow Fever (Africa/South America), Malaria prophylaxis (tropical regions), Japanese Encephalitis (rural Asia). Visit a travel health clinic 4–6 weeks before departure. Check CDC or NHS travel health pages for your destination!"),

    # ── Weather & Seasons ───────────────────────────────────────────────────────
    ("weather", "Weather varies dramatically by destination and season! The best strategy: avoid monsoon/rainy seasons for outdoor destinations, consider shoulder seasons (spring/fall) for fewer crowds and good weather. Which destination's weather are you curious about?"),
    ("best season to travel", "For most destinations: 🌸 Spring (March–May): Mild weather, fewer crowds, flowers blooming. ☀️ Summer (Jun–Aug): Peak season, hot, crowded. 🍂 Autumn (Sep–Nov): Beautiful colors, cooling down, good value. ❄️ Winter (Dec–Feb): Low season discounts, winter sports. Tell me your destination for specific advice!"),
    ("rainy season", "Rainy season tips: 🌧️ Pack a compact umbrella and waterproof jacket, 📅 Prices are often 30–50% cheaper, 🏖️ Many beach destinations have brief afternoon showers only, 🌿 Jungles and rice terraces are lush and beautiful, 💦 Some activities still operate in light rain. It can be great if you're flexible!"),

    # ── Special Trip Types ──────────────────────────────────────────────────────
    ("honeymoon", "Top honeymoon destinations: 🏝️ Maldives (overwater bungalows!), 🇮🇹 Italy (Amalfi Coast + Venice), 🇫🇷 Paris & Provence, 🇯🇵 Kyoto & Tokyo, 🇬🇷 Santorini, 🇮🇩 Bali. Tips: Book well in advance, mention it's your honeymoon for upgrades, consider all-inclusive resorts for stress-free relaxation!"),
    ("family travel", "Family travel tips: 👨‍👩‍👧‍👦 Choose family-friendly destinations (Disney parks, beach resorts, national parks), 📅 Travel during school holidays, 🎡 Balance adult interests with kid-friendly activities, 🏠 Book apartments for more space, 🌡️ Bring first aid kit and children's medications, ✈️ Request kids' meals on flights!"),
    ("adventure travel", "Adventure travel destinations: 🏔️ Nepal (trekking, Everest base camp), 🇳🇿 New Zealand (bungee, skydiving), 🇨🇷 Costa Rica (zip-lining, rafting), 🇵🇪 Peru (Inca Trail), 🇮🇸 Iceland (glacier hiking, diving). Always book through reputable operators and get appropriate travel insurance!"),
    ("luxury travel", "Luxury travel tips: ✨ Book 6–12 months ahead for top hotels and experiences, 🌟 Use travel agents for complex luxury itineraries, 💳 Premium credit cards offer lounge access and hotel upgrades, 🛳️ Consider luxury river cruises or boutique lodges, 🎭 Private guides transform experiences!"),
    ("backpacking", "Backpacking tips: 🎒 Pack light — 30–40L bag, 🛏️ Stay in hostels to meet fellow travelers, 🚌 Use overnight buses/trains to save on accommodation, 📱 Download offline maps, 🌏 Classic routes: Southeast Asia, Europe, South America. Start with an itinerary but stay flexible — best experiences are often unplanned!"),
    ("road trip", "Road trip essentials: 🗺️ Plan your route but keep flexibility, ⛽ Know your gas situation (remote areas!), 🏕️ Camp or use motels to save money, 📱 Download offline maps (Google Maps or Maps.me), 🎵 Build an epic playlist, 🧰 Carry emergency kit, 📷 Stop at every scenic viewpoint — no rush!"),

    # ── Sustainability ──────────────────────────────────────────────────────────
    ("sustainable travel", "Sustainable travel tips: ✈️ Choose direct flights (fewer emissions), 🏠 Stay in locally-owned accommodation, 🛍️ Buy local souvenirs from artisans, 🚶 Walk or use public transport, 🌊 Respect wildlife and ecosystems, ♻️ Reduce single-use plastic, 🤝 Support ethical tour operators, 💧 Carry a reusable water bottle!"),
    ("eco tourism", "Ecotourism is a wonderful way to travel! Look for certified eco-lodges, responsible wildlife tours, and community-based tourism initiatives. Great eco destinations: Costa Rica, Iceland, Kenya, Rwanda (gorilla trekking), Galápagos Islands, Borneo. Travel slowly, leave no trace!"),

    # ── Miscellaneous ───────────────────────────────────────────────────────────
    ("travel apps", "Must-have travel apps: ✈️ Google Flights/Skyscanner (flights), 🏨 Booking.com (hotels), 🗺️ Google Maps + Maps.me (offline maps), 🌐 Google Translate (language), 💱 XE Currency (exchange rates), 📡 Hopper (price predictions), 🚌 Rome2Rio (transport options), 🍽️ TripAdvisor/Yelp (food)!"),
    ("travel hacks", "Travel hacks that actually work: 💺 Check-in online ASAP for better seats, 🔌 Pack a multi-port USB charger, 💳 Get a fee-free bank card (Wise/Revolut), 📦 Stuff socks inside shoes to save space, ☕ Bring your own coffee cup on flights, 🏃 TSA PreCheck saves hours, 🌍 IYKYK: Google 'city name + free things to do'!"),
    ("currency exchange", "Currency tips: 💱 Use Wise or Revolut for near-interbank exchange rates, 🏧 Withdraw cash from ATMs in local currency (better rate than exchange bureaus), ❌ Avoid exchanging at airports or hotels (worst rates), 💳 Tell your bank you're traveling to avoid blocked cards, 📱 Always know the approximate exchange rate before you go!"),
    ("wifi abroad", "Staying connected abroad: 📡 Buy a local SIM card (cheapest option), 🌐 Get a travel eSIM (Airalo, Holafly), 📶 Check if your phone plan has international add-ons, ☁️ Use VPN for security on public WiFi, 📥 Download offline content (maps, Spotify, Netflix) before leaving!"),
    ("travel photography", "Travel photography tips: 📸 Golden hour (sunrise/sunset) is magical, 🌅 Wake up early to beat crowds at popular spots, 🤳 Ask locals or fellow travelers for photos of you, 📱 Phone cameras are incredible now — don't stress if you don't have a DSLR, 🎨 Focus on people and details, not just landmarks!"),
    ("northern lights", "Aurora Borealis tips: 🌌 Best locations: Iceland, Norway (Tromsø), Finland (Lapland), Canada (Yukon/Northwest Territories), Sweden. Best time: September–March, on clear nights away from light pollution. Apps like Aurora Forecast help track activity. Be patient — it's worth waiting for!"),
    ("travel bucket list", "Classic travel bucket list items: 🌋 Hike Machu Picchu, 🏔️ Trek to Everest Base Camp, 🐘 Safari in the Serengeti, 🏝️ Swim in Maldives, 🎌 See cherry blossoms in Japan, 🌊 Dive the Great Barrier Reef, 🌌 See Northern Lights, 🗼 Watch Eiffel Tower sparkle at night, 🌄 Sunrise at Angkor Wat! What's on yours?"),
]
