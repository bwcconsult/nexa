# 🔗 Nexa CRM - Integration & Data Synchronization

## **How Nexa CRM Connects & Syncs With External Systems**

---

## Table of Contents
1. [Integration Architecture](#1-integration-architecture)
2. [Email & Calendar Sync](#2-email--calendar-sync)
3. [Payment & Billing Integration](#3-payment--billing-integration)
4. [Marketing Automation Sync](#4-marketing-automation-sync)
5. [Support & Helpdesk Integration](#5-support--helpdesk-integration)
6. [Data Import/Export Flows](#6-data-importexport-flows)

---

# 1. Integration Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SYSTEMS                          │
├─────────────┬────────────┬──────────────┬────────────┬───────────┤
│   Email     │  Calendar  │   Payments   │ Marketing  │  Support  │
│  (Gmail,    │  (Google,  │   (Stripe,   │ (Mailchimp,│ (Zendesk, │
│  Outlook)   │  Outlook)  │   PayPal)    │  SendGrid) │  Intercom)│
└─────┬───────┴─────┬──────┴──────┬───────┴─────┬──────┴─────┬─────┘
      │             │             │             │            │
      ▼             ▼             ▼             ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXA CRM API LAYER                            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   OAuth     │  │  Webhooks   │  │  API Keys   │            │
│  │   Handler   │  │   Listener  │  │   Manager   │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          │                                      │
│                ┌─────────▼────────┐                            │
│                │ Integration Hub  │                            │
│                │  • Transforms    │                            │
│                │  • Maps data     │                            │
│                │  • Syncs         │                            │
│                └─────────┬────────┘                            │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      NEXA CRM DATABASE                           │
│  (Contacts, Leads, Deals, Activities, Emails, Tasks, etc.)      │
└──────────────────────────────────────────────────────────────────┘
```

## Integration Types

| Type | Method | Direction | Use Case |
|------|--------|-----------|----------|
| **Real-time Sync** | Webhooks | Bi-directional | Email, Calendar, Chat |
| **Batch Sync** | API Polling | Uni/Bi-directional | Analytics, Reporting |
| **Event-Driven** | Webhooks | Inbound | Payments, Form submissions |
| **Manual** | Import/Export | One-time | Data migration, Backup |

---

# 2. Email & Calendar Sync

## Gmail Integration

### Setup Flow

```
User Journey:
┌──────────────┐
│ User clicks  │
│ "Connect     │
│  Gmail"      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Redirect to  │
│ Google OAuth │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ User grants  │
│ permissions: │
│ • Read email │
│ • Send email │
│ • Calendar   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Exchange     │
│ access token │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Nexa stores  │
│ token &      │
│ starts sync  │
└──────────────┘
```

### Email Sync Logic

```javascript
// Real-time email sync (via Gmail API + Pub/Sub)
GmailIntegration.sync(user_id) {
  
  // 1. Watch for new emails
  gmail.watch({
    userId: 'me',
    labelIds: ['INBOX', 'SENT'],
    topicName: 'nexa-email-sync'
  })
  
  // 2. When new email arrives (webhook)
  onNewEmail(email) {
    
    // Check if sender/recipient is in CRM
    const contact = Contact.findByEmail(email.from)
    const lead = Lead.findByEmail(email.from)
    
    if (contact || lead) {
      // Create activity record
      Activity.create({
        type: 'email',
        direction: email.labelIds.includes('SENT') ? 'outbound' : 'inbound',
        subject: email.subject,
        body: email.snippet,
        html_body: email.payload.body.data,
        from: email.from,
        to: email.to,
        cc: email.cc,
        timestamp: email.internalDate,
        
        // Link to CRM records
        contact_id: contact?.id,
        lead_id: lead?.id,
        account_id: contact?.account_id,
        
        // Store Gmail ID for threading
        external_id: email.id,
        thread_id: email.threadId,
        
        // AI analysis
        sentiment: AI.analyzeSentiment(email.snippet),
        intent: AI.classifyIntent(email.subject, email.snippet)
      })
      
      // Update last contact time
      if (contact) {
        contact.update({last_contacted: now()})
      }
      if (lead) {
        lead.update({last_contacted: now()})
        // Re-calculate lead score (engagement = +points)
        AI.recalculateLeadScore(lead.id)
      }
    }
  }
  
  // 3. Bi-directional sync: Send from Nexa
  Email.sendViaGmail(email_draft) {
    gmail.send({
      userId: 'me',
      to: email_draft.to,
      subject: email_draft.subject,
      body: email_draft.body,
      threadId: email_draft.reply_to_thread // Maintains conversation
    })
    
    // Log in CRM
    Activity.create({
      type: 'email',
      direction: 'outbound',
      ...email_draft,
      external_id: response.id,
      sent_via: 'gmail'
    })
  }
}
```

### Calendar Sync

```javascript
// Google Calendar Integration
CalendarIntegration.sync(user_id) {
  
  // Watch for calendar changes
  calendar.watch({
    calendarId: 'primary',
    type: 'web_hook',
    address: 'https://nexa-crm.com/webhooks/google-calendar'
  })
  
  // On new/updated event
  onCalendarEvent(event) {
    
    // Check if attendees are CRM contacts
    const attendees = event.attendees.map(a => 
      Contact.findByEmail(a.email) || Lead.findByEmail(a.email)
    ).filter(Boolean)
    
    if (attendees.length > 0) {
      // Create/update meeting in CRM
      Meeting.upsert({
        external_id: event.id,
        title: event.summary,
        description: event.description,
        start_time: event.start.dateTime,
        end_time: event.end.dateTime,
        location: event.location,
        meet_link: event.hangoutLink,
        
        // Link to CRM records
        attendees: attendees.map(a => a.id),
        account_id: attendees[0].account_id,
        
        // Sync status
        synced_from: 'google_calendar',
        last_synced: now()
      })
      
      // Create reminder task
      Task.create({
        title: `Prepare for: ${event.summary}`,
        due_date: event.start.dateTime - 1.hour,
        related_to: meeting.id
      })
    }
  }
  
  // Bi-directional: Create in Nexa, sync to Google
  Meeting.onCreate(meeting) {
    calendar.events.insert({
      calendarId: 'primary',
      summary: meeting.title,
      description: meeting.description,
      start: {dateTime: meeting.start_time},
      end: {dateTime: meeting.end_time},
      attendees: meeting.attendees.map(a => ({
        email: a.email,
        displayName: a.name
      })),
      conferenceData: {
        createRequest: {
          requestId: meeting.id,
          conferenceSolutionKey: {type: 'hangoutsMeet'}
        }
      }
    })
    
    // Store Google Calendar event ID
    meeting.update({
      external_id: response.id,
      meet_link: response.hangoutLink
    })
  }
}
```

---

# 3. Payment & Billing Integration

## Stripe Integration

### Use Case: Subscription Management

**Flow:** Deal closed → Create Stripe subscription → Sync payment status

```javascript
// When deal is won
Deal.onClose(deal) {
  if (deal.stage === 'closed_won') {
    
    // Create Stripe customer (if doesn't exist)
    const stripeCustomer = await Stripe.customers.create({
      email: deal.primary_contact.email,
      name: deal.account.name,
      metadata: {
        nexa_account_id: deal.account.id,
        nexa_deal_id: deal.id
      }
    })
    
    // Create subscription
    const subscription = await Stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: deal.line_items.map(item => ({
        price: item.stripe_price_id,
        quantity: item.quantity
      })),
      billing_cycle_anchor: 'now',
      metadata: {
        nexa_deal_id: deal.id,
        nexa_account_id: deal.account.id
      }
    })
    
    // Store in CRM
    Account.update(deal.account.id, {
      stripe_customer_id: stripeCustomer.id,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      mrr: subscription.plan.amount / 100,
      next_billing_date: subscription.current_period_end
    })
  }
}

// Listen for Stripe webhooks
Webhook.on('stripe.invoice.payment_succeeded', (event) => {
  const account = Account.findBy({
    stripe_subscription_id: event.data.object.subscription
  })
  
  // Log payment
  Activity.create({
    type: 'payment_received',
    account_id: account.id,
    amount: event.data.object.amount_paid / 100,
    invoice_id: event.data.object.id,
    status: 'paid',
    paid_at: event.data.object.status_transitions.paid_at
  })
  
  // Update account health
  account.update({
    last_payment_date: now(),
    payment_status: 'current',
    health_score: account.health_score + 5 // On-time payment = +5
  })
})

Webhook.on('stripe.invoice.payment_failed', (event) => {
  const account = Account.findBy({
    stripe_subscription_id: event.data.object.subscription
  })
  
  // Alert CS team
  Alert.create({
    type: 'payment_failed',
    severity: 'urgent',
    account_id: account.id,
    message: `Payment failed for ${account.name} - ${event.data.object.amount_due / 100}`,
    assigned_to: account.csm
  })
  
  // Update health score
  account.update({
    payment_status: 'overdue',
    health_score: account.health_score - 15, // Failed payment = -15
    churn_risk: 'high'
  })
  
  // Create follow-up task
  Task.create({
    title: `URGENT: Payment failed for ${account.name}`,
    due_date: 'today',
    priority: 'urgent',
    assigned_to: account.csm,
    type: 'payment_recovery'
  })
})
```

---

# 4. Marketing Automation Sync

## Mailchimp Integration

### Use Case: Sync contact lists for campaigns

```javascript
// Sync Nexa Contact List → Mailchimp Audience
ContactList.onUpdate(list_id) {
  const list = ContactList.find(list_id, {include: 'contacts'})
  
  // Find or create Mailchimp audience
  let mailchimpAudience = Mailchimp.audiences.findBy({
    name: list.name
  })
  
  if (!mailchimpAudience) {
    mailchimpAudience = await Mailchimp.audiences.create({
      name: list.name,
      permission_reminder: "You signed up for our mailing list",
      email_type_option: true,
      contact: {
        company: "Nexa CRM",
        address1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        country: "US"
      },
      campaign_defaults: {
        from_name: "Nexa CRM",
        from_email: "marketing@nexa-crm.com",
        subject: "",
        language: "en"
      }
    })
  }
  
  // Sync contacts (batch update)
  const members = list.contacts.map(contact => ({
    email_address: contact.email,
    status: contact.email_opt_in ? 'subscribed' : 'unsubscribed',
    merge_fields: {
      FNAME: contact.first_name,
      LNAME: contact.last_name,
      COMPANY: contact.account?.name,
      PHONE: contact.phone
    },
    tags: contact.tags
  }))
  
  await Mailchimp.audiences.batchUpdate(mailchimpAudience.id, {
    members,
    update_existing: true
  })
  
  // Store sync status
  list.update({
    mailchimp_audience_id: mailchimpAudience.id,
    last_synced_at: now(),
    sync_status: 'completed',
    synced_count: members.length
  })
}

// Listen for Mailchimp campaign events
Webhook.on('mailchimp.campaign.sent', (event) => {
  const campaign = Campaign.findBy({
    mailchimp_campaign_id: event.data.id
  })
  
  campaign.update({
    status: 'sent',
    sent_at: event.fired_at,
    total_sent: event.data.emails_sent
  })
})

Webhook.on('mailchimp.campaign.opened', (event) => {
  const contact = Contact.findBy({email: event.data.email})
  
  if (contact) {
    Activity.create({
      type: 'email_opened',
      contact_id: contact.id,
      campaign_id: event.data.campaign_id,
      timestamp: event.fired_at
    })
    
    // Update engagement score
    contact.increment('engagement_score', 2) // Open = +2
  }
})

Webhook.on('mailchimp.campaign.clicked', (event) => {
  const contact = Contact.findBy({email: event.data.email})
  
  if (contact) {
    Activity.create({
      type: 'email_clicked',
      contact_id: contact.id,
      url: event.data.url,
      campaign_id: event.data.campaign_id,
      timestamp: event.fired_at
    })
    
    // High engagement signal
    contact.increment('engagement_score', 5) // Click = +5
    
    // Re-score if it's a lead
    if (contact.is_lead) {
      AI.recalculateLeadScore(contact.id)
    }
  }
})
```

---

# 5. Support & Helpdesk Integration

## Zendesk Integration

### Use Case: Sync support tickets with CRM

```javascript
// When ticket created in Zendesk
Webhook.on('zendesk.ticket.created', (event) => {
  const ticket = event.ticket
  
  // Find contact by email
  const contact = Contact.findBy({email: ticket.requester.email})
  
  if (contact) {
    // Create ticket in Nexa CRM
    Ticket.create({
      external_id: ticket.id,
      external_source: 'zendesk',
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      type: ticket.type,
      
      // Link to CRM
      contact_id: contact.id,
      account_id: contact.account_id,
      
      // Assignment
      assigned_to: mapZendeskAgent(ticket.assignee_id),
      
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    })
    
    // Update account health if multiple tickets
    const ticketCount = Ticket.count({
      account_id: contact.account_id,
      status: 'open',
      created_at: {gte: 30.days.ago}
    })
    
    if (ticketCount > 3) {
      // High support volume = health risk
      account.update({
        health_score: account.health_score - 10,
        support_intensity: 'high'
      })
      
      Alert.create({
        type: 'high_support_volume',
        account_id: contact.account_id,
        message: `${ticketCount} support tickets in last 30 days`,
        assigned_to: account.csm
      })
    }
  }
})

// Bi-directional: Create ticket in Nexa → Push to Zendesk
Ticket.onCreate(ticket) {
  if (ticket.escalate_to_zendesk) {
    const zendeskTicket = await Zendesk.tickets.create({
      subject: ticket.subject,
      comment: {
        body: ticket.description
      },
      requester: {
        email: ticket.contact.email,
        name: ticket.contact.name
      },
      priority: ticket.priority,
      type: ticket.type,
      tags: ticket.tags,
      custom_fields: [
        {id: 'nexa_account_id', value: ticket.account_id},
        {id: 'nexa_deal_value', value: ticket.account.arr}
      ]
    })
    
    ticket.update({
      external_id: zendeskTicket.id,
      external_source: 'zendesk',
      zendesk_url: zendeskTicket.url
    })
  }
}
```

---

# 6. Data Import/Export Flows

## CSV Import Process

### Use Case: Migrate 10,000 contacts from spreadsheet

```javascript
// Import Job Workflow
ImportJob.create({
  entity_type: 'contacts',
  file_name: 'contacts_export.csv',
  file_size: 2500000, // 2.5 MB
  total_records: 10000,
  created_by: user_id
}) {
  
  // Step 1: Upload & Validate
  file = await S3.upload(csv_file, {
    bucket: 'nexa-imports',
    key: `${user_id}/${timestamp}/contacts.csv`
  })
  
  job.update({
    status: 'validating',
    file_url: file.url
  })
  
  // Step 2: Parse & Map Fields
  const mapping = {
    'First Name': 'first_name',
    'Last Name': 'last_name',
    'Email': 'email',
    'Company': 'account.name',
    'Phone': 'phone',
    'Title': 'title',
    'Tags': 'tags' // comma-separated
  }
  
  const records = await CSV.parse(file, mapping)
  
  // Step 3: Validate Data
  const validation = records.map((record, index) => ({
    row: index + 2, // +2 for header + 0-index
    errors: [
      !record.email && 'Email required',
      !isValidEmail(record.email) && 'Invalid email format',
      record.phone && !isValidPhone(record.phone) && 'Invalid phone'
    ].filter(Boolean)
  })).filter(v => v.errors.length > 0)
  
  if (validation.length > 0) {
    job.update({
      status: 'failed',
      error_count: validation.length,
      errors: validation
    })
    return
  }
  
  // Step 4: Process in Batches (1000 at a time)
  job.update({status: 'processing'})
  
  const batches = chunk(records, 1000)
  let processed = 0
  
  for (const batch of batches) {
    await Promise.all(batch.map(async (record) => {
      
      // Check for duplicates
      let contact = await Contact.findBy({email: record.email})
      
      if (contact) {
        // Update existing
        await contact.update(record)
        job.increment('updated_count')
      } else {
        // Create new
        contact = await Contact.create(record)
        job.increment('created_count')
      }
      
      // Handle account relationship
      if (record.account?.name) {
        let account = await Account.findOrCreate({
          name: record.account.name
        })
        await contact.update({account_id: account.id})
      }
      
      processed++
      job.update({
        processed_count: processed,
        progress: (processed / job.total_records) * 100
      })
    }))
  }
  
  // Step 5: Complete
  job.update({
    status: 'completed',
    completed_at: now(),
    summary: {
      total: job.total_records,
      created: job.created_count,
      updated: job.updated_count,
      skipped: job.total_records - job.created_count - job.updated_count
    }
  })
  
  // Step 6: Notify user
  Email.send({
    to: user.email,
    template: 'import_complete',
    data: {
      entity: 'Contacts',
      total: job.total_records,
      created: job.created_count,
      updated: job.updated_count,
      duration: job.completed_at - job.created_at
    }
  })
}
```

## CSV Export Process

```javascript
// Export Job Workflow
ExportJob.create({
  entity_type: 'contacts',
  export_format: 'csv',
  filters: {
    tags: ['customer', 'enterprise'],
    created_after: '2025-01-01'
  },
  selected_fields: [
    'first_name', 'last_name', 'email', 'phone',
    'company', 'title', 'tags', 'created_at'
  ],
  created_by: user_id
}) {
  
  job.update({status: 'processing'})
  
  // Step 1: Query data
  const contacts = await Contact.where(job.filters)
    .select(job.selected_fields)
    .limit(100000) // Max export size
  
  job.update({total_records: contacts.length})
  
  // Step 2: Transform to CSV
  const csv = createCSV({
    headers: job.selected_fields,
    data: contacts.map(c => job.selected_fields.map(field => c[field]))
  })
  
  // Step 3: Upload to S3
  const file = await S3.upload(csv, {
    bucket: 'nexa-exports',
    key: `${user_id}/${job.id}/contacts_export.csv`,
    contentType: 'text/csv',
    expires: 7.days // Link expires in 7 days
  })
  
  // Step 4: Complete
  job.update({
    status: 'completed',
    file_name: `contacts_export_${Date.now()}.csv`,
    file_url: file.url,
    file_size: file.size,
    expires_at: 7.days.from_now,
    completed_at: now()
  })
  
  // Step 5: Notify
  Email.send({
    to: user.email,
    template: 'export_ready',
    data: {
      entity: 'Contacts',
      count: contacts.length,
      download_url: file.url,
      expires: '7 days'
    }
  })
}
```

---

## Integration Best Practices

### 1. Error Handling
```javascript
Integration.withRetry(async () => {
  // API call
}, {
  maxRetries: 3,
  backoff: 'exponential',
  onError: (error, attempt) => {
    Log.error(`Integration failed (attempt ${attempt})`, error)
    
    if (attempt === 3) {
      Alert.create({
        type: 'integration_failure',
        service: 'stripe',
        error: error.message,
        assigned_to: admin_team
      })
    }
  }
})
```

### 2. Rate Limiting
```javascript
RateLimiter.throttle('gmail_api', {
  requests: 1000,
  per: 'minute',
  queue: true
})
```

### 3. Data Mapping
```javascript
DataMapper.transform(external_data, {
  'firstName': 'first_name',
  'lastName': 'last_name',
  'companyName': 'account.name',
  'customFields.industry': 'industry'
})
```

---

**All integration patterns documented. Nexa CRM is fully connected!** 🔗

*Part 4 of 4 - Integration & Data Sync*
