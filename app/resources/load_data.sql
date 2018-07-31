INSERT INTO auction_user (user_id, user_username, user_givenname, user_familyname, user_email, user_password, user_accountbalance, user_reputation)
VALUES
(1, 'black.panther', 'T', 'Challa', 'black.panther@super.heroes', 'Wakanda', '0.00' , '500'),
(2, 'superman', 'Clark', 'Kent', 'superman@super.heroes', 'kryptonite', '0.00', '900'),
(3, 'batman', 'Bruce', 'Wayne', 'dark.knight@super.heroes', 'frankmiller', '0.00', '850'),
(4, 'spiderman', 'Peter', 'Parker', 'spiderman@super.heroes', 'arachnid', '0.00', '500'),
(5, 'ironman', 'Tony', 'Stark', 'ironman@super.heroes', 'robertdowney', '0.00', '700'),
(6, 'captain.america', 'Steve', 'Rogers', 'captain.america@super.heroes', 'donaldtrump', '0.00', '300'),
(7, 'dr.manhatten', 'Jonathan', 'Osterman', 'dr.manhatten@super.heroes', 'hydrogen', '0.00', '1000'),
(8, 'vampire.slayer', 'Buffy', 'Summers', 'vampire.slayer@super.heroes', 'sarahgellar', '0.00' , '600'),
(9, 'Ozymandias', 'Adrian', 'Veidt', 'Ozymandias@super.villains', 'shelley', '0.00' , '200'),
(10, 'Rorschach', 'Walter', 'Kovacs', 'Rorschach@super.villains', 'Joseph', '0.00' , '200'),
(11, 'power.woman', 'Jessica', 'Jones', 'power.woman@super.heroes', 'lukecage', '0.00' , '200')
;

INSERT INTO category (category_id, category_title, category_description)
VALUES
(1, 'apparel', 'Clothing, for example capes, masks, belts, boots, gloves etc'),
(2, 'equipment', 'Rings of power, hammers from the gods, grappling hooks, lassos of truth, and such like'),
(3, 'vehicles', 'Various forms of transportation, such as surf boards, tanks, jetpacks, etc'),
(4, 'property', 'For examples: planets, orbiting space stations, ice palaces at the North Pole.'),
(5, 'other', 'Other oddities.')
;


INSERT INTO auction (
auction_id,
auction_title,
auction_categoryid,
auction_description,
auction_reserveprice,
auction_startingprice,
auction_creationdate,
auction_startingdate,
auction_endingdate,
auction_userid)
VALUES
(1, 'Super cape', '1', 'One slightly used cape', '10.00', '0.01', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-03-14 00:00:00', '2'),
(2, 'Broken pyramid', '4', 'One very broken pyramid. No longer wanted. Buyer collect', '1000000.00', '1.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-02-28 00:00:00', '9'),
(3, 'One boot', '1', 'One boot. Lost the other in a battle with the Joker', '10.00', '0.50', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-03-14 00:00:00', '3'),
(4, 'Intrinsic Field Subtractor', '5', 'Hard to write about, but basically it changed me. A lot. ', '100.00', '1.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-06-30 00:00:00', '7'),
(5, 'A cache of vibranium', '5', 'A cache of vibranium stolen from Wakanda. ', '500000.00', '10000.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-06-30 00:00:00', '10')
;

INSERT INTO bid (
  bid_userid,
  bid_auctionid,
  bid_amount,
  bid_datetime)
values
('1', '1', '10.00', '2018-02-20 00:01:00'),
('9', '3', '100.00', '2018-02-20 00:10:00'),
('7', '3', '150.00', '2018-02-20 00:20:00'),
('9', '3', '200.00', '2018-02-20 00:30:00'),
('9', '3', '250.00', '2018-02-20 00:40:00'),
('7', '3', '350.00', '2018-02-20 00:50:00'),
('9', '3', '400.00', '2018-02-20 01:00:00'),
('7', '4', '1000.00', '2018-02-20 01:00:00')
;