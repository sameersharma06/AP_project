# RouteShield - Requirements

## 1. Project Overview
RouteShield is a road hazard reporting platform where users can
report road hazards and view active reports nearby.

## 2. User Roles
- USER: Can create reports, view reports and confirm hazards.
- MODERATOR: Can review, reject or resolve reports.

## 3. Core Features
1. User registration and login.
2. Create a road hazard report.
3. View active hazard reports.
4. Find reports near a given location.
5. Confirm a report through upvotes.
6. Moderator can review reports.
7. Old reports can expire automatically.

## 4. Initial Database Entities
- users
- hazard_reports
- hazard_votes
- moderation_actions

## 5. Hazard Report Fields
- id
- user_id
- hazard_type
- description
- latitude
- longitude
- status
- created_at
- updated_at
- expires_at

## 6. Report Status
- ACTIVE
- RESOLVED
- REJECTED
- EXPIRED

## 7. Business Rules
- One user can confirm a report only once.
- A report must belong to its creator.
- Only moderators can perform moderation actions.
- Only active reports should appear in nearby reports.
