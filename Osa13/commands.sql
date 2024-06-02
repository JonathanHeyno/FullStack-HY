CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('George Washington', 'http://ihatecherrytrees.com/how-to-cut-a-stupid-tree/', 'How to get rid of a cherry tree');
insert into blogs (author, url, title, likes) values ('Scooby Doo', 'http://scoobydoo.com/woof/', 'Scooby snacks', 1000000000);