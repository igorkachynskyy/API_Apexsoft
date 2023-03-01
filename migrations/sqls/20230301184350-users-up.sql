CREATE TABLE users (
    name_ varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password_ varchar(255) NOT NULL,
    is_deleted BOOLEAN NOT NULL,
    created_at date DEFAULT NOW(),
    updated_at date UNIQUE
);
CREATE OR REPLACE FUNCTION user_change() RETURNS TRIGGER as $user_change$
BEGIN
   if new."password" not like new."password" then
      insert into users values(OLD."name_", OLD."email", NEW."password_", OLD."is_deleted", OLD."created_at", GETDATE());
   end if;
   return new;
END;
$user_change$
language PLPGSQL;
CREATE TRIGGER changed_trigger 
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE user_change();