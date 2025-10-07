USE dbsetup;
-- Drop the broken table completely
DROP TABLE IF EXISTS users;

-- Create the CORRECT table structure
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    weight DECIMAL(5,1) NOT NULL,
    height DECIMAL(5,1) NOT NULL,
    phone VARCHAR(250),
    goalWeight DECIMAL(5,1) NOT NULL,
    activityLevel VARCHAR(250) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data with CORRECT activityLevel values
INSERT INTO users (email, password, firstName, lastName, age, weight, height, phone, goalWeight, activityLevel) 
VALUES 
(
    'seifeddinebenyaala424@gmail.com', 
    'har123', 
    'Seif', 
    'Lastname', 
    22, 
    86.6, 
    188.7, 
    '+491631190659', 
    95.0, 
    'moderate' 
),
(
    'harrba50@gmail.com', 
    'fitness2024', 
    'Sarah', 
    'Smith', 
    28, 
    65.2, 
    165.5, 
    '+0987654321', 
    60.0, 
    'light' 
),
(
    'mike.wilson@example.com', 
    'healthfirst', 
    'Mike', 
    'Wilson', 
    45, 
    85.0, 
    180.0, 
    '+1122334455', 
    78.0, 
    'sedentary' 
);
