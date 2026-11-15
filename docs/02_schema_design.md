# RouteShield - Database Schema Design

## 1. Users
- Primary Key: id
- Unique Key: email
- Stores user and moderator account details.

## 2. Hazard Reports
- Primary Key: id
- Foreign Key: user_id -> users.id
- Stores road hazard information and location.

## 3. Hazard Votes
- Composite Primary Key: (user_id, report_id)
- Foreign Keys:
  - user_id -> users.id
  - report_id -> hazard_reports.id
- Prevents duplicate votes by the same user on the same report.

## 4. Moderation Actions
- Primary Key: id
- Foreign Keys:
  - moderator_id -> users.id
  - report_id -> hazard_reports.id
- Stores moderator decisions and reasons.

## 5. Constraints
- users.email must be unique.
- A user can vote only once on a particular report.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.
- Report status must be ACTIVE, RESOLVED, REJECTED or EXPIRED.
- Only moderators can perform moderation actions.

## 6. Normalization Goals
- First Normal Form (1NF): Atomic column values.
- Second Normal Form (2NF): No partial dependency on a composite key.
- Third Normal Form (3NF): No transitive dependency between non-key attributes.
