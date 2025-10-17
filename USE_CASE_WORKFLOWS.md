# 🔄 Nexa CRM - Complete Workflow Scenarios

## **Cross-Module Business Workflows & Data Synchronization**

---

## Table of Contents
1. [Marketing to Sales Handoff](#1-marketing-to-sales-handoff)
2. [Sales to Customer Success](#2-sales-to-customer-success)
3. [Support to Product Feedback Loop](#3-support-to-product-feedback-loop)
4. [Complete Customer Lifecycle](#4-complete-customer-lifecycle)
5. [Team Collaboration Workflows](#5-team-collaboration-workflows)

---

# 1. Marketing to Sales Handoff

## Scenario: Inbound Marketing Campaign

**Business Context:** Tech company runs webinar, needs to convert attendees to sales opportunities.

### Workflow Diagram

```
MARKETING                           SALES
    │                                 │
    ▼                                 │
┌─────────────────┐                  │
│ Create Campaign │                  │
│ "Product Webinar"│                 │
└────────┬────────┘                  │
         │                            │
         ▼                            │
┌─────────────────┐                  │
│ Upload Lead List│                  │
│ 500 registrants │                  │
└────────┬────────┘                  │
         │                            │
         ▼                            │
┌─────────────────────────┐          │
│ Auto-create Leads in CRM│          │
│ • Name                   │          │
│ • Email                  │          │
│ • Company                │          │
│ • Source: Webinar        │          │
└────────┬────────────────┘          │
         │                            │
         ▼                            │
┌─────────────────────────┐          │
│ AI Lead Scoring         │          │
│ • High (75+): 50 leads  │──────────┼────→ Priority Queue
│ • Medium (50-74): 200   │──────────┼────→ Standard Queue
│ • Low (<50): 250        │──────────┼────→ Nurture Campaign
└────────┬────────────────┘          │
         │                            │
         ▼                            ▼
┌─────────────────────────┐   ┌──────────────────┐
│ Send Thank You Email    │   │ Sales Reps       │
│ + Resources             │   │ Receive Alerts   │
└─────────────────────────┘   └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │ Follow-up Within │
                              │ 24 Hours (Task)  │
                              └──────────────────┘
```

### Detailed Flow

**Step 1: Campaign Setup (Marketing)**
```javascript
// Marketing Manager creates campaign
Campaign.create({
  name: "Q4 Product Webinar",
  type: "webinar",
  start_date: "2025-11-15",
  goal: "Generate 100 qualified leads",
  budget: 5000,
  target_audience: "Enterprise IT Managers"
})
```

**Step 2: Lead Import**
- CSV uploaded with 500 registrants
- System auto-creates Lead records
- Each lead tagged with: `source: "Webinar Q4"`, `campaign_id: [campaign_uuid]`

**Step 3: AI Scoring (Automatic)**
```javascript
// For each lead, AI analyzes:
LeadScore.calculate(lead_id) {
  factors: {
    company_size: "enterprise" → +10 points
    title: "IT Director" → +15 points
    source: "webinar" → +15 points
    engagement: "registered_early" → +10 points
    email_opened: true → +5 points
  }
  total_score: 55 // Medium priority
}
```

**Step 4: Auto-Assignment**
```javascript
// High-score leads → Senior reps
if (lead.score >= 75) {
  lead.assigned_to = seniorSalesRep
  Task.create({
    title: "Call hot webinar lead",
    due_date: "within_24_hours",
    priority: "urgent"
  })
}

// Medium leads → Standard reps  
else if (lead.score >= 50) {
  lead.assigned_to = salesRep
  Task.create({
    title: "Follow up on webinar attendee",
    due_date: "within_48_hours"
  })
}

// Low leads → Marketing nurture
else {
  ContactList.add(lead, "Webinar Nurture Campaign")
  Email.sendSequence(lead, "Webinar_Followup_Series")
}
```

**Step 5: Sales Follow-up**
- Rep receives notification: "5 new high-priority leads assigned"
- Opens lead record, sees:
  - AI score: 85/100
  - Attended webinar: Yes
  - Questions asked: 2
  - Content downloaded: Product brochure
  - AI recommendation: "High buying intent, call within 24h"

**Step 6: Conversion Tracking**
```javascript
// When sales rep converts lead:
Lead.convert(lead_id) {
  // Creates:
  contact = Contact.create(from: lead)
  account = Account.create(company: lead.company)
  deal = Deal.create({
    account: account,
    primary_contact: contact,
    amount: 50000,
    source: "Webinar Q4",
    stage: "Qualification"
  })
  
  // Updates campaign metrics:
  Campaign.increment('leads_converted')
  Campaign.calculate_roi() // Compare cost vs pipeline value
}
```

**Result Metrics:**
- 500 leads generated
- 50 high-priority → 30 converted (60% conversion)
- 200 medium → 40 converted (20% conversion)
- 250 low → nurtured for future
- Total pipeline created: $3.5M
- Campaign ROI: 700% ($5K spend → $3.5M pipeline)

---

# 2. Sales to Customer Success Handoff

## Scenario: Deal Closed-Won Transition

**Business Context:** Enterprise deal closes, needs smooth handoff from sales to onboarding team.

### Workflow Diagram

```
SALES                    AUTOMATION                CUSTOMER SUCCESS
  │                           │                            │
  ▼                           │                            │
┌────────────────┐            │                            │
│ Deal Closed Won│            │                            │
│ $50K Annual    │            │                            │
└───────┬────────┘            │                            │
        │                     │                            │
        │ Trigger             │                            │
        ├────────────────────→│                            │
        │                     ▼                            │
        │            ┌──────────────────┐                  │
        │            │ Automation Fires │                  │
        │            │ "Deal Won"       │                  │
        │            └────────┬─────────┘                  │
        │                     │                            │
        │            ┌────────┴─────────┐                  │
        │            │                  │                  │
        │            ▼                  ▼                  │
        │      ┌──────────┐      ┌───────────┐            │
        │      │Update    │      │Create     │            │
        │      │Account   │      │Onboarding │            │
        │      │Status    │      │Project    │            │
        │      └──────────┘      └─────┬─────┘            │
        │                              │                  │
        │                              ▼                  │
        │                     ┌─────────────────┐         │
        │                     │Auto-Create:     │         │
        │                     │• Welcome email  │─────────┼────→ Customer
        │                     │• 20 tasks       │─────────┼────→ CS Team
        │                     │• Kickoff meeting│─────────┼────→ Calendar
        │                     │• Training docs  │─────────┼────→ Portal
        │                     └─────────────────┘         │
        │                                                 │
        └─────────────────────────────────────────────────┘
                        Handoff Complete
```

### Detailed Flow

**Step 1: Deal Marked as Closed-Won**
```javascript
// Sales rep updates deal
Deal.update(deal_id, {
  stage: "closed_won",
  close_date: today,
  actual_amount: 50000,
  contract_signed: true,
  contract_url: "s3://contracts/acme_2025.pdf"
})

// This triggers workflow automation
```

**Step 2: Automated Workflow Triggers**
```javascript
// Workflow: "New Customer Onboarding"
Workflow.trigger("deal_closed_won") {
  
  // Action 1: Update Account
  Account.update({
    type: "customer", // was "prospect"
    customer_since: today,
    arr: 50000,
    contract_end_date: today + 12.months,
    health_score: 100 // starts perfect
  })
  
  // Action 2: Create onboarding project
  Project.create({
    name: "Acme Corp Onboarding",
    type: "customer_onboarding",
    account: account_id,
    owner: customerSuccessManager,
    due_date: today + 30.days,
    status: "not_started"
  })
  
  // Action 3: Generate 20 onboarding tasks
  tasks = [
    {title: "Schedule kickoff call", due: today + 2.days, priority: "urgent"},
    {title: "Send welcome email", due: today + 1.day, priority: "high"},
    {title: "Create customer portal account", due: today + 1.day},
    {title: "Assign customer success manager", due: today},
    {title: "Provision user accounts", due: today + 3.days},
    {title: "Schedule product training", due: today + 7.days},
    {title: "Configure integrations", due: today + 14.days},
    {title: "Setup data import", due: today + 7.days},
    {title: "Customize dashboard", due: today + 10.days},
    {title: "30-day check-in meeting", due: today + 30.days},
    // ... 10 more tasks
  ]
  
  tasks.forEach(task => Task.create(task))
  
  // Action 4: Send welcome email
  Email.send({
    to: primary_contact.email,
    template: "customer_welcome",
    variables: {
      customer_name: contact.first_name,
      csm_name: csManager.name,
      csm_email: csManager.email,
      kickoff_link: meeting.join_url
    }
  })
  
  // Action 5: Schedule kickoff meeting
  Meeting.create({
    title: "Acme Corp - Implementation Kickoff",
    date: today + 3.days,
    attendees: [primary_contact, csManager, implementation_specialist],
    agenda: "Review timeline, roles, deliverables"
  })
  
  // Action 6: Create internal handoff note
  Note.create({
    account: account_id,
    type: "handoff",
    content: `
      Deal: $50K Annual
      Products: Enterprise Plan (50 users)
      Special requirements: Salesforce integration, SSO
      Key contacts: Sarah (primary), Tom (IT), Lisa (admin)
      Sales notes: Very engaged, high adoption likely
      Timeline: Go-live by end of month
    `,
    created_by: sales_rep,
    visible_to: [csManager, implementation_team]
  })
  
  // Action 7: Notify CS team
  Notification.send({
    to: [csManager, implementation_team],
    type: "new_customer",
    message: "New customer: Acme Corp ($50K ARR) - Kickoff in 3 days",
    action_url: "/accounts/acme-corp"
  })
}
```

**Step 3: Customer Success Manager Takes Over**
- Receives notification + email
- Reviews account details (full history from sales)
- Sees all auto-created tasks in kanban board
- Joins kickoff meeting (auto-scheduled)

**Step 4: 30-Day Onboarding Journey**

```
Day 1:  ✅ Welcome email sent
        ✅ Portal account created
        ✅ CSM assigned

Day 3:  ✅ Kickoff meeting held
        ✅ Timeline confirmed

Day 7:  ✅ User accounts provisioned
        ✅ Training scheduled
        ✅ Data import started

Day 14: ✅ Salesforce integration configured
        ✅ First team training session

Day 21: ✅ Dashboard customized
        ✅ Second training session
        ✅ Power users identified

Day 30: ✅ Go-live!
        ✅ 30-day check-in meeting
        ✅ Success metrics reviewed
        ✅ Health score: 95 (excellent)
```

**Step 5: Continuous Monitoring**
```javascript
// AI monitors customer health
HealthScore.calculate(account_id) {
  factors: {
    product_usage: 85% // Daily active users
    support_tickets: 2 // Low volume
    feature_adoption: 70% // Good
    payment_status: "current" // On-time
    engagement: "high" // Responsive
    nps_score: 9 // Promoter
  }
  
  health_score: 95 // Excellent
  risk_level: "low"
  renewal_probability: 98%
}

// If health drops:
if (health_score < 70) {
  Alert.create({
    type: "churn_risk",
    account: account_id,
    message: "Health score dropped to 65, immediate action needed",
    assigned_to: csManager
  })
  
  AI.recommend({
    action: "Schedule executive business review",
    reason: "Usage declining, support tickets increasing"
  })
}
```

---

# 3. Support to Product Feedback Loop

## Scenario: Customer Reports Bug, Drives Product Improvement

**Business Context:** SaaS company uses support tickets to identify product issues and prioritize roadmap.

### Workflow Diagram

```
CUSTOMER        SUPPORT         PRODUCT TEAM      ENGINEERING
   │               │                  │                │
   ▼               │                  │                │
┌──────┐           │                  │                │
│Submit│           │                  │                │
│Ticket│───────────→                  │                │
└──────┘           │                  │                │
                   ▼                  │                │
            ┌─────────────┐           │                │
            │Auto-classify│           │                │
            │Type: Bug    │           │                │
            │Priority: High│          │                │
            └──────┬──────┘           │                │
                   │                  │                │
                   ▼                  │                │
            ┌─────────────┐           │                │
            │Assign to    │           │                │
            │Support Rep  │           │                │
            └──────┬──────┘           │                │
                   │                  │                │
                   ▼                  │                │
            ┌─────────────┐           │                │
            │Investigate  │           │                │
            │& Reproduce  │           │                │
            └──────┬──────┘           │                │
                   │                  │                │
            Confirmed Bug             │                │
                   │                  │                │
                   ▼                  │                │
            ┌─────────────┐           │                │
            │Escalate to  │───────────→                │
            │Product Team │           │                │
            └─────────────┘           ▼                │
                   │          ┌────────────────┐       │
                   │          │Review & Triage │       │
                   │          │Priority: P1    │       │
                   │          └───────┬────────┘       │
                   │                  │                │
                   │                  ▼                │
                   │          ┌────────────────┐       │
                   │          │Create Feature  │       │
                   │          │Request / Bug   │───────→
                   │          └────────────────┘       │
                   │                  │                ▼
                   │                  │        ┌──────────────┐
                   │                  │        │Add to Sprint │
                   │                  │        │Fix Bug       │
                   │                  │        └──────┬───────┘
                   │                  │               │
                   │                  │               ▼
                   │                  │        ┌──────────────┐
                   │                  │        │Deploy Fix    │
                   │                  │        └──────┬───────┘
                   │                  │               │
                   ▼                  ▼               ▼
            ┌─────────────┐   ┌──────────────┐ ┌──────────────┐
            │Notify       │←──│Update Status │←│Mark Complete │
            │Customer     │   │to "Resolved" │ └──────────────┘
            └─────────────┘   └──────────────┘
```

### Detailed Flow

**Step 1: Customer Submits Ticket**
```javascript
// Via email, chat, or web form
Ticket.create({
  subject: "Export function not working",
  description: "When I try to export contacts to CSV, I get an error message",
  type: "bug", // Auto-classified by AI
  priority: "high", // Based on keywords
  customer_impact: "blocking_work",
  account: account_id,
  contact: contact_id,
  channel: "email" // or "chat", "phone", "web"
})

// AI analyzes ticket content
AI.analyzeTicket(ticket_id) {
  sentiment: "frustrated",
  urgency: "high",
  category: "product_bug",
  affected_feature: "data_export",
  similar_tickets: 5 // Others reported same issue
  recommended_priority: "P1" // Multiple customers affected
}
```

**Step 2: Auto-Routing & Assignment**
```javascript
// Workflow automation
if (ticket.type === "bug" && ticket.priority === "high") {
  ticket.assigned_to = seniorSupportAgent
  
  Notification.send({
    to: seniorSupportAgent,
    message: "Urgent bug ticket assigned",
    action: "Investigate within 2 hours"
  })
  
  // Also notify product team
  Notification.send({
    to: productManager,
    message: "Potential P1 bug: Export function",
    details: "5 similar tickets in last week"
  })
}
```

**Step 3: Support Investigation**
```javascript
// Support agent logs investigation
Activity.create({
  ticket_id: ticket_id,
  type: "internal_note",
  content: `
    Reproduced issue:
    Steps: Dashboard → Contacts → Export → Select CSV
    Error: "Module csv-parser not found"
    Impact: All customers on v2.1.5 affected
    Root cause: Missing dependency in deployment
    Severity: Critical - blocks core functionality
  `,
  next_steps: "Escalate to engineering immediately"
})

// Update ticket
Ticket.update({
  priority: "critical",
  status: "escalated",
  escalated_to: "engineering_team",
  severity: "p1"
})
```

**Step 4: Create Engineering Task**
```javascript
// Product manager creates bug ticket in project management
Bug.create({
  title: "CSV export failing - missing dependency",
  description: "Export feature broken for all users on v2.1.5",
  severity: "p1",
  assigned_to: engineeringLead,
  sprint: "current_sprint",
  story_points: 2,
  linked_support_tickets: [ticket_id], // Link back to customer ticket
  customer_impact: "50+ customers affected",
  workaround: "Use JSON export temporarily"
})
```

**Step 5: Customer Communication**
```javascript
// Support sends update to customer
Email.send({
  to: customer,
  template: "bug_acknowledged",
  content: `
    Hi ${customer.name},
    
    Thank you for reporting this issue. We've confirmed the bug and 
    our engineering team is actively working on a fix.
    
    Status: In Progress
    Priority: Critical (P1)
    ETA: Fix deployed within 24 hours
    
    Workaround: You can use JSON export in the meantime.
    
    We'll notify you as soon as the fix is deployed.
    
    Best regards,
    Support Team
  `
})

// Update ticket timeline
Timeline.add(ticket_id, {
  event: "customer_updated",
  message: "Customer informed of status and workaround"
})
```

**Step 6: Engineering Fix & Deploy**
```javascript
// 12 hours later: Fix deployed
Deployment.create({
  version: "2.1.6",
  changes: ["Fixed CSV export dependency issue"],
  affected_features: ["data_export"],
  deployment_type: "hotfix",
  rollout: "immediate" // Critical fix
})

// Auto-update linked tickets
Ticket.update({
  status: "resolved",
  resolution: "Fix deployed in v2.1.6",
  resolved_at: now(),
  resolved_by: engineering_team
})

// Notify customer
Email.send({
  to: customer,
  template: "bug_resolved",
  content: `
    Good news! The CSV export issue has been fixed and deployed.
    
    Please try exporting again. If you encounter any issues, 
    just reply to this email.
    
    Thank you for your patience!
  `
})
```

**Step 7: Product Feedback Loop**
```javascript
// Product team analyzes bug patterns
ProductAnalytics.weekly_review() {
  top_bugs_this_week: [
    {feature: "data_export", tickets: 5, impact: "high"},
    {feature: "email_sync", tickets: 3, impact: "medium"},
    {feature: "dashboard_load", tickets: 8, impact: "low"}
  ]
  
  recommendations: [
    "Invest in export feature testing",
    "Add integration tests for dependencies",
    "Improve error messaging"
  ]
  
  roadmap_impact: "Prioritize data export improvements in Q1"
}

// Create feature request based on feedback
FeatureRequest.create({
  title: "Enhanced export options (Excel, bulk, scheduled)",
  source: "customer_feedback",
  votes: 15, // From support tickets
  business_value: "High - frequently requested",
  engineering_effort: "Medium",
  target_quarter: "Q1 2026"
})
```

**Metrics Tracked:**
- Time to acknowledge: 15 minutes (target: <1 hour)
- Time to resolve: 12 hours (target: <24 hours for P1)
- Customer satisfaction: 9/10
- Bug recurrence: 0% (fix verified)
- Similar tickets closed: 5 (all resolved by same fix)

---

**Continue reading:**
- [USE_CASE_AI_FEATURES.md](./USE_CASE_AI_FEATURES.md) - AI-powered workflows
- [USE_CASE_INTEGRATIONS.md](./USE_CASE_INTEGRATIONS.md) - External system sync

---

*Part 2 of 4 - Workflow Scenarios*
