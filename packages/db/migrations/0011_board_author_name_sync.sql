update board_posts as post
set author_name = profile.name
from profiles as profile
where post.author_id = profile.id
  and profile.name <> ''
  and post.author_name <> profile.name;

update board_comments as comment
set author_name = profile.name
from profiles as profile
where comment.author_id = profile.id
  and profile.name <> ''
  and comment.author_name <> profile.name;
