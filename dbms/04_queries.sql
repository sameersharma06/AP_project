-- ============================================================
-- RouteShield - CP3 Database Queries
-- PostgreSQL
-- Tables: User, HazardReport, HazardVote, ModerationAction
-- ============================================================


-- 1. CREATE A HAZARD REPORT
-- Parameters:
-- $1 = userId
-- $2 = hazardType
-- $3 = description
-- $4 = latitude
-- $5 = longitude

INSERT INTO "HazardReport" (
    "userId",
    "hazardType",
    "description",
    "latitude",
    "longitude",
    "createdAt",
    "updatedAt",
    "expiresAt"
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '24 hours'
)
RETURNING *;


-- 2. FIND NEARBY ACTIVE HAZARDS
-- Parameters:
-- $1 = search latitude
-- $2 = search longitude
-- $3 = radius in kilometres
--
-- First filters candidates using a bounding box.
-- Then calculates exact distance using Haversine formula.

WITH candidate_reports AS (
    SELECT
        r.*,
        u."name" AS "reporterName",
        (
            SELECT COUNT(*)
            FROM "HazardVote" v
            WHERE v."reportId" = r.id
        ) AS "voteCount"
    FROM "HazardReport" r
    JOIN "User" u ON u.id = r."userId"
    WHERE r.status = 'ACTIVE'
      AND r."expiresAt" > CURRENT_TIMESTAMP
      AND r.latitude BETWEEN
          ($1 - $3 / 111.0) AND ($1 + $3 / 111.0)
      AND r.longitude BETWEEN
          ($2 - $3 / (111.0 * COS(RADIANS($1))))
          AND
          ($2 + $3 / (111.0 * COS(RADIANS($1))))
),
distances AS (
    SELECT
        *,
        6371 * 2 * ASIN(
            SQRT(
                LEAST(1.0, GREATEST(0.0,
                    POWER(SIN(RADIANS(latitude - $1) / 2), 2)
                    + COS(RADIANS($1))
                    * COS(RADIANS(latitude))
                    * POWER(SIN(RADIANS(longitude - $2) / 2), 2)
                ))
            )
        ) AS "distanceKm"
    FROM candidate_reports
)
SELECT *
FROM distances
WHERE "distanceKm" <= $3
ORDER BY "distanceKm" ASC;


-- 3. UPVOTE A HAZARD REPORT
-- Parameters:
-- $1 = userId
-- $2 = reportId
--
-- Composite primary key (userId, reportId)
-- prevents duplicate votes.
-- ON CONFLICT avoids a duplicate-key error.

INSERT INTO "HazardVote" ("userId", "reportId")
SELECT $1, r.id
FROM "HazardReport" r
WHERE r.id = $2
  AND r.status = 'ACTIVE'
  AND r."expiresAt" > CURRENT_TIMESTAMP
ON CONFLICT ("userId", "reportId") DO NOTHING
RETURNING *;


-- 4. COUNT VOTES FOR A REPORT
-- Parameter:
-- $1 = reportId

SELECT
    "reportId",
    COUNT(*) AS "voteCount"
FROM "HazardVote"
WHERE "reportId" = $1
GROUP BY "reportId";


-- 5. MODERATOR REVIEW: FETCH ACTIVE REPORTS
-- Includes reporter details and total vote count.

SELECT
    r.id,
    r."hazardType",
    r.description,
    r.latitude,
    r.longitude,
    r.status,
    r."createdAt",
    r."expiresAt",
    u.id AS "reporterId",
    u.name AS "reporterName",
    u.email AS "reporterEmail",
    COUNT(v."userId") AS "voteCount"
FROM "HazardReport" r
JOIN "User" u ON u.id = r."userId"
LEFT JOIN "HazardVote" v ON v."reportId" = r.id
WHERE r.status = 'ACTIVE'
GROUP BY r.id, u.id
ORDER BY r."createdAt" DESC;


-- 6. AUTOMATICALLY EXPIRE OLD HAZARD REPORTS
-- Changes ACTIVE reports to EXPIRED when expiresAt has passed.

UPDATE "HazardReport"
SET
    status = 'EXPIRED',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE status = 'ACTIVE'
  AND "expiresAt" <= CURRENT_TIMESTAMP
RETURNING id, status, "expiresAt";

