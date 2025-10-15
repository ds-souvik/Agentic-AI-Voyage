# FocusedRoom Database Schema

## Tables Overview

### **customer**
Main customer table with demographic information.

| Column | Type | Description |
|--------|------|-------------|
| customer_id | INTEGER (PK) | Unique customer identifier |
| email_id | VARCHAR(255) UNIQUE | Customer email (no duplicates) |
| name | VARCHAR(255) | Customer name |
| age | INTEGER | Customer age |
| profession | TEXT | Customer profession/career |
| career_stage | VARCHAR(100) | Career stage (Early Career, Mid Career, etc.) |
| purpose | TEXT | Primary goal/purpose |
| channel_id | INTEGER (FK) | Acquisition channel (1=Big Five Test, 2=eBook, 3=Mobile App) |
| create_dt | TIMESTAMP | Account creation date |
| opt_in | BOOLEAN | Email consent (GDPR compliance) |

**Indexes:**
- PRIMARY KEY on customer_id
- UNIQUE on email_id
- INDEX on create_dt
- INDEX on channel_id

---

### **channel_details**
Reference table for customer acquisition channels.

| channel_id | channel_name | Description |
|------------|--------------|-------------|
| 1 | Big Five Test | Customer acquired through personality test |
| 2 | eBook Download | Customer acquired through eBook download |
| 3 | Mobile App | Customer acquired through mobile app |

---

### **big_five_result**
Stores Big Five personality test results.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Unique result identifier |
| customer_id | INTEGER (FK) | Links to customer.customer_id (NULL for anonymous) |
| report_id | INTEGER | Test number for this customer (1st, 2nd, 3rd, etc.) |
| scores | JSON | Personality scores (scores, percentiles, raw_scores) |
| suggestions | TEXT | AI-generated personality insights |
| created_at | TIMESTAMP | Test completion timestamp |

**Indexes:**
- PRIMARY KEY on id
- INDEX on (customer_id, report_id) - for finding customer's test history
- INDEX on created_at
- FOREIGN KEY customer_id → customer.customer_id

---

### **blog_engagement**
Tracks blog post engagement metrics.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Unique engagement identifier |
| post_slug | VARCHAR(255) | Blog post identifier |
| engagement_type | VARCHAR(50) | Type: 'like', 'helpful_yes', 'helpful_no' |
| user_identifier | VARCHAR(255) | Hashed IP + User Agent for anonymous tracking |
| feedback_text | TEXT | Optional feedback for 'helpful_no' responses |
| created_at | TIMESTAMP | Engagement timestamp |

**Unique Constraint:**
- (post_slug, engagement_type, user_identifier) - prevents duplicate engagement

---

## Key Relationships

```
customer (1) ←→ (many) big_five_result
customer (many) → (1) channel_details
```

---

## Business Logic

### **New Customer Flow:**
1. User fills Big Five test form with demographics
2. System checks if email_id exists in customer table
3. If new: creates customer with channel_id=1, report_id=1
4. If existing: updates demographics, calculates next report_id
5. Stores test result in big_five_result with customer_id and report_id

### **Returning Customer:**
- Same email_id is NOT duplicated
- Demographics are updated if provided
- report_id increments (2nd test, 3rd test, etc.)
- Full test history preserved per customer

---

## Data Quality

**Current State (47 customers):**
- ✅ 100% have channel_id
- ✅ 100% have unique email_id (no duplicates)
- ✅ 91.5% have names
- ✅ 91.5% have career stages
- ⚠️ Some have NULL for age/profession/purpose (being collected going forward)

---

## Important Notes

1. **No Duplicate Emails:** email_id is UNIQUE - existing customers are updated, not duplicated
2. **Report Tracking:** report_id tracks which test number this is for each customer
3. **Anonymous Tests:** customer_id can be NULL for users who don't provide email
4. **GDPR Compliance:** opt_in field tracks email consent
5. **Backward Compatibility:** Subscriber = Customer alias in models.py

---

**Last Updated:** October 15, 2025  
**Schema Version:** 2.0 (Customer-centric with demographics)
