# Study Groups API

## Endpoints

### POST /create_group.php
- Create a new group.
- Body JSON: {name, course, time, location, description?}
- Returns: {message, id}

### GET /get_groups.php
- List groups.
- Query: limit, offset, search?, course?
- Returns: array of groups

### GET /get_group.php?id=ID
- Get single group.
- Returns: group object

### PUT /update_group.php
- Update group fields.
- Body JSON: {id, any of name, course, time, location, description}

### DELETE /delete_group.php
- Delete group.
- Body JSON: {id}

### POST /create_comment.php
- Add comment to group.
- Body JSON: {group_id, text}

### GET /get_comments.php?group_id=ID
- List comments for a group
- Returns: array of comments

