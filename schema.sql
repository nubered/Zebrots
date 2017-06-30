-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Create the database
-- ---

DROP DATABASE IF EXISTS `GRAVITAS`;

CREATE DATABASE `GRAVITAS`;

USE `GRAVITAS`;

-- ---
-- Table 'TAKEAWAYS'
--
--
-- ---

DROP TABLE IF EXISTS `TAKEAWAYS`;

CREATE TABLE `TAKEAWAYS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `takeaway` VARCHAR(50) NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'INVITES'
--
-- ---

DROP TABLE IF EXISTS `TOPICS`;

CREATE TABLE `TOPICS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_q_id` INTEGER NOT NULL,
  `topic` VARCHAR(50) NOT NULL,
  `user_a_id` INTEGER NULL,
  `takeaway_id` INTEGER NULL,
  `timestamp` TIMESTAMP DEFAULT NOW(),

   PRIMARY KEY (`id`)
);

-- ---
-- Table 'USERS'
--
-- ---

DROP TABLE IF EXISTS `USERS`;

CREATE TABLE USERS (
  id int NOT NULL AUTO_INCREMENT,
  handle varchar(30) NOT NULL,
  email varchar(50) NOT NULL,
  avatar_url varchar(200) NOT NULL,
  github_token varchar(200) NOT NULL,
  PRIMARY KEY (ID)
);

-- ---
-- Table 'EVENTS'
--
-- ---

DROP TABLE IF EXISTS `EVENTS`;

CREATE TABLE `EVENTS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(32) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `time` DATETIME NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'TAGS'
--
-- ---

DROP TABLE IF EXISTS `TAGS`;

CREATE TABLE `TAGS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `tagname` CHAR(32) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'RSVP'
--
-- ---
DROP TABLE IF EXISTS `RSVP`;

CREATE TABLE `RSVP` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `event_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'TAGS_JOIN_INVITES'
--
-- ---

DROP TABLE IF EXISTS `TAGS_JOIN_INVITES`;

CREATE TABLE `TAGS_JOIN_INVITES` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `tag_id` INTEGER NOT NULL,
  `invite_id` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---
-- ALTER TABLE `TAKEAWAYS` ADD FOREIGN KEY (user_Q_id) REFERENCES `USERS` (`id`);
-- ALTER TABLE `TAKEAWAYS` ADD FOREIGN KEY (user_A_id) REFERENCES `USERS` (`id`);

ALTER TABLE `TOPICS` ADD FOREIGN KEY (user_q_id) REFERENCES `USERS` (`id`);
ALTER TABLE `TOPICS` ADD FOREIGN KEY (user_a_id) REFERENCES `USERS` (`id`);
ALTER TABLE `TOPICS` ADD FOREIGN KEY (takeaway_id) REFERENCES `TAKEAWAYS` (`id`);

ALTER TABLE `EVENTS` ADD FOREIGN KEY (user_id) REFERENCES `USERS` (`id`);
ALTER TABLE `RSVP` ADD FOREIGN KEY (event_id) REFERENCES `EVENTS` (`id`);
ALTER TABLE `RSVP` ADD FOREIGN KEY (user_id) REFERENCES `USERS` (`id`);
ALTER TABLE `TAGS_JOIN_TOPICS` ADD FOREIGN KEY (tag_id) REFERENCES `TAGS` (`id`);
ALTER TABLE `TAGS_JOIN_TOPICS` ADD FOREIGN KEY (invite_id) REFERENCES `TOPICS` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `TAKEAWAYS` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `INVITES` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `USERS` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `EVENTS` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `TAGS` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `TAGS_JOIN_INQUIRIES` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `RSVP` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `TAGS_JOIN_INVITES` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

INSERT INTO `TAKEAWAYS` (`takeaway`,`user_id`) VALUES
('MySQL gets confused about where its files are >_<','5');
INSERT INTO `TAKEAWAYS` (`takeaway`,`user_id`) VALUES
('Programming is fun!','7');
INSERT INTO `TAKEAWAYS` (`takeaway`,`user_id`) VALUES
('Pair-programming is hard','3');

-- INSERT INTO `INVITES` (`id`,`user_Q_id`,`topic`,`user_A_id`,`takeaway_id`,`timestamp`) VALUES
-- ('','','','','','');
-- INSERT INTO `USERS` (`id`,`username`,`email`,`github_id`) VALUES
-- ('','','','');
-- INSERT INTO `EVENTS` (`id`,`title`,`description`,`time`,`user_id`) VALUES
-- ('','','','','');
-- INSERT INTO `TAGS` (`id`,`tagname`) VALUES
-- ('','');
-- INSERT INTO `TAGS_JOIN_INQUIRIES` (`id`,`tag_id`,`invite_id`) VALUES
-- ('','','');
-- INSERT INTO `RSVP` (`id`,`event_id`,`user_id`) VALUES
-- ('','','');
-- INSERT INTO `TAGS_JOIN_INVITES` (`id`,`tag_id`,`invite_id`) VALUES
-- ('','','');

/*  Execute this file from the command line by typing:
 *    mysql -u root < schema.sql  // run this to drop the database and create it
 *  to create the database and the tables.*/
