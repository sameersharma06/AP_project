# RouteShield - Database Normalization

## 1. Functional Dependencies

### User
id -> name, email, passwordHash, role, createdAt

### HazardReport
id -> userId, hazardType, description, latitude,
longitude, status, createdAt, updatedAt, expiresAt

### HazardVote
(userId, reportId) -> createdAt

### ModerationAction
id -> moderatorId, reportId, action, reason, createdAt

## 2. First Normal Form (1NF)

All columns store atomic values.
There are no repeating groups or multi-valued attributes.

## 3. Second Normal Form (2NF)

All models with single-column primary keys satisfy 2NF
if they satisfy 1NF.

HazardVote uses a composite primary key:
(userId, reportId).

Its non-key attribute createdAt depends on the
complete composite key.

Therefore, no partial dependency exists.

## 4. Third Normal Form (3NF)

Non-key attributes depend on keys, the whole keys,
and nothing but the keys.

User information is stored only in User.
Hazard report information is stored only in HazardReport.
Vote information is stored only in HazardVote.
Moderation information is stored only in ModerationAction.

No transitive dependency has been identified
under the functional dependencies listed above.

## 5. Conclusion

The proposed schema is designed to satisfy 1NF, 2NF
and 3NF under the stated functional dependencies.
