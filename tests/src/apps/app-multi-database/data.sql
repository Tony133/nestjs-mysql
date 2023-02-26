CREATE TABLE users (
    id INT(11) AUTO_INCREMENT, 
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(50) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE posts (
    id INT(11) AUTO_INCREMENT, 
    title VARCHAR(100) NOT NULL,
    description VARCHAR(150) NOT NULL, 
    PRIMARY KEY (id)
);
