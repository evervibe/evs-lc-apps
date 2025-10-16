-- Initialize MySQL databases for Last Chaos
CREATE DATABASE IF NOT EXISTS db_auth;
CREATE DATABASE IF NOT EXISTS db_db;
CREATE DATABASE IF NOT EXISTS db_data;
CREATE DATABASE IF NOT EXISTS db_logs;

-- Use db_auth for stored procedures
USE db_auth;

-- Create basic user table structure
CREATE TABLE IF NOT EXISTS bg_user (
    user_code INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    passwd VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cash INT DEFAULT 0,
    activated TINYINT DEFAULT 0,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_flag INT DEFAULT 0
);

-- Stored Procedure: Create Game Account
DELIMITER //
CREATE PROCEDURE sp_create_game_account(
  IN p_user_id VARCHAR(64),
  IN p_password_hash VARCHAR(255),
  IN p_email VARCHAR(255),
  OUT p_user_code INT
)
BEGIN
  INSERT INTO bg_user(user_id, passwd, email, activated, create_date)
  VALUES (p_user_id, p_password_hash, p_email, 1, NOW());
  SET p_user_code = LAST_INSERT_ID();
END//

-- Stored Procedure: Add Cash
CREATE PROCEDURE sp_add_cash(
  IN p_user_code INT,
  IN p_amount INT,
  IN p_reason VARCHAR(64)
)
BEGIN
  UPDATE bg_user SET cash = cash + p_amount WHERE user_code = p_user_code;
END//

DELIMITER ;

-- Create read-only user
CREATE USER IF NOT EXISTS 'lc_ro'@'%' IDENTIFIED BY 'read_only';
GRANT SELECT ON db_auth.* TO 'lc_ro'@'%';
GRANT SELECT ON db_db.* TO 'lc_ro'@'%';
GRANT SELECT ON db_data.* TO 'lc_ro'@'%';
GRANT SELECT ON db_logs.* TO 'lc_ro'@'%';

-- Create write user (for stored procedures)
CREATE USER IF NOT EXISTS 'lc_rw'@'%' IDENTIFIED BY 'only_exec_sp';
GRANT EXECUTE ON db_auth.* TO 'lc_rw'@'%';
GRANT EXECUTE ON db_db.* TO 'lc_rw'@'%';
GRANT INSERT, UPDATE ON db_auth.bg_user TO 'lc_rw'@'%';

FLUSH PRIVILEGES;

-- Use db_db for game data
USE db_db;

-- Create basic character table structure
CREATE TABLE IF NOT EXISTS t_characters (
    char_id INT AUTO_INCREMENT PRIMARY KEY,
    char_name VARCHAR(64) UNIQUE NOT NULL,
    user_code INT NOT NULL,
    level INT DEFAULT 1,
    exp BIGINT DEFAULT 0,
    class INT DEFAULT 0,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create basic guild table structure
CREATE TABLE IF NOT EXISTS t_guild (
    guild_id INT AUTO_INCREMENT PRIMARY KEY,
    guild_name VARCHAR(64) UNIQUE NOT NULL,
    guild_level INT DEFAULT 1,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_guildmember (
    char_id INT PRIMARY KEY,
    guild_id INT NOT NULL,
    guild_rank INT DEFAULT 0,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guild_id) REFERENCES t_guild(guild_id) ON DELETE CASCADE
);
