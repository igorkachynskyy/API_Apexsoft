CREATE TABLE users (
    name_ varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password_ varchar(255) NOT NULL,
    is_deleted BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE OR REPLACE FUNCTION user_change() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER changed_trigger 
BEFORE
UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE user_change();