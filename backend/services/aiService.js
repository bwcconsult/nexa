/**
 * AI Service
 * 
 * Core AI/ML service for Nexa CRM
 * Handles predictions, scoring, and recommendations
 */

const { Lead, Contact, Deal, Activity, AIInsight, AIPrediction } = require('../models');
const { Op } = require('sequelize');

class AIService {
  
  /**
   * Calculate lead score using multiple factors
   * @param {string} leadId - Lead UUID
   * @returns {Promise<number>} Score from 0-100
   */
  async calculateLeadScore(leadId) {
    try {
      const lead = await Lead.findByPk(leadId, {
        include: [
          { model: Activity, as: 'activities' },
          { model: Contact, as: 'contact' }
        ]
      });
      
      if (!lead) return 0;
      
      let score = 0;
      const factors = {};
      
      // Factor 1: Engagement level (0-30 points)
      const activityCount = lead.activities?.length || 0;
      const engagementScore = Math.min(30, activityCount * 3);
      score += engagementScore;
      factors.engagement = engagementScore;
      
      // Factor 2: Lead source quality (0-20 points)
      const sourceScores = {
        'referral': 20,
        'website': 15,
        'social_media': 12,
        'email': 10,
        'cold_call': 5,
        'other': 5
      };
      const sourceScore = sourceScores[lead.source] || 5;
      score += sourceScore;
      factors.source = sourceScore;
      
      // Factor 3: Response time (0-20 points)
      const daysSinceCreation = lead.created_at 
        ? Math.floor((new Date() - new Date(lead.created_at)) / (1000 * 60 * 60 * 24))
        : 999;
      let recencyScore = 0;
      if (daysSinceCreation <= 1) recencyScore = 20;
      else if (daysSinceCreation <= 3) recencyScore = 15;
      else if (daysSinceCreation <= 7) recencyScore = 10;
      else if (daysSinceCreation <= 14) recencyScore = 5;
      score += recencyScore;
      factors.recency = recencyScore;
      
      // Factor 4: Status progress (0-20 points)
      const statusScores = {
        'contacted': 5,
        'qualified': 15,
        'proposal': 18,
        'negotiation': 20
      };
      const statusScore = statusScores[lead.status] || 0;
      score += statusScore;
      factors.status = statusScore;
      
      // Factor 5: Company size (0-10 points)
      if (lead.company_size) {
        if (lead.company_size === 'enterprise') score += 10;
        else if (lead.company_size === 'mid-market') score += 7;
        else if (lead.company_size === 'small') score += 5;
        factors.company_size = score;
      }
      
      // Store prediction
      await AIPrediction.create({
        prediction_type: 'lead_score',
        entity_type: 'lead',
        entity_id: leadId,
        predicted_value: { score, factors },
        confidence: 0.85,
        model_version: 'v1.0',
        features_used: {
          activity_count: activityCount,
          source: lead.source,
          status: lead.status,
          days_since_creation: daysSinceCreation
        }
      });
      
      // Update lead score
      await lead.update({ score: Math.min(100, score) });
      
      return Math.min(100, score);
      
    } catch (error) {
      console.error('Error calculating lead score:', error);
      return 0;
    }
  }
  
  /**
   * Generate AI-powered email draft
   * @param {Object} context - Email context (recipient, purpose, tone)
   * @returns {Promise<Object>} Generated email
   */
  async generateEmailDraft(context) {
    const { recipient, purpose, tone = 'professional', previous_context = '' } = context;
    
    // Email templates based on purpose
    const templates = {
      'follow_up': {
        subject: `Following up on our conversation`,
        body: `Hi ${recipient.first_name || 'there'},\n\nI wanted to follow up on our previous conversation about ${previous_context || 'your interest in our services'}.\n\nI'd love to schedule a quick call to discuss how we can help ${recipient.company || 'your organization'} achieve its goals.\n\nWhen would be a good time for you this week?\n\nBest regards`
      },
      'introduction': {
        subject: `Introduction - ${recipient.company || 'Partnership Opportunity'}`,
        body: `Hi ${recipient.first_name || 'there'},\n\nMy name is [Your Name] and I'm reaching out because I think there could be a great fit between our companies.\n\n[Brief value proposition - 2-3 sentences]\n\nWould you be open to a brief call next week to explore this further?\n\nLooking forward to connecting!`
      },
      'proposal': {
        subject: `Proposal for ${recipient.company || 'Your Review'}`,
        body: `Hi ${recipient.first_name},\n\nThank you for taking the time to discuss your needs with us.\n\nBased on our conversation, I've prepared a proposal that outlines how we can help you [specific goal].\n\nI've attached the proposal for your review. I'd be happy to walk you through it at your convenience.\n\nPlease let me know if you have any questions.\n\nBest regards`
      },
      'meeting_request': {
        subject: `Meeting Request - ${recipient.company || ''}`,
        body: `Hi ${recipient.first_name || 'there'},\n\nI'd like to schedule a meeting to discuss [topic/opportunity].\n\nWould any of these times work for you?\n- [Option 1]\n- [Option 2]\n- [Option 3]\n\nThe meeting should take about 30 minutes.\n\nLooking forward to speaking with you!`
      },
      'check_in': {
        subject: `Checking in`,
        body: `Hi ${recipient.first_name || 'there'},\n\nI wanted to check in and see how things are going with [project/initiative].\n\nIs there anything I can help with or any questions I can answer?\n\nFeel free to reach out anytime.\n\nBest regards`
      }
    };
    
    const template = templates[purpose] || templates['follow_up'];
    
    // Adjust tone
    let { subject, body } = template;
    if (tone === 'casual') {
      body = body.replace('Best regards', 'Cheers').replace('Hi ', 'Hey ');
    } else if (tone === 'formal') {
      body = body.replace('Hi ', 'Dear ').replace('Best regards', 'Sincerely');
    }
    
    return {
      subject,
      body,
      suggested_send_time: this.getSuggestedSendTime(),
      confidence: 0.8,
      personalization_score: recipient.first_name ? 0.9 : 0.5
    };
  }
  
  /**
   * Get suggested send time for emails (based on recipient timezone)
   * @returns {Date} Suggested send time
   */
  getSuggestedSendTime() {
    const now = new Date();
    const hour = now.getHours();
    
    // Best times: 10AM, 2PM, 4PM
    let suggestedHour = 10;
    if (hour >= 10 && hour < 14) suggestedHour = 14;
    else if (hour >= 14 && hour < 16) suggestedHour = 16;
    else if (hour >= 16) {
      // Next day at 10AM
      now.setDate(now.getDate() + 1);
      suggestedHour = 10;
    }
    
    now.setHours(suggestedHour, 0, 0, 0);
    return now;
  }
  
  /**
   * Get next best action recommendation
   * @param {string} entityType - Entity type (lead, deal, contact)
   * @param {string} entityId - Entity UUID
   * @returns {Promise<Object>} Recommended action
   */
  async getNextBestAction(entityType, entityId) {
    try {
      let entity;
      let recommendations = [];
      
      if (entityType === 'lead') {
        entity = await Lead.findByPk(entityId, {
          include: [{ model: Activity, as: 'activities' }]
        });
        
        if (!entity) return null;
        
        const daysSinceLastActivity = entity.activities?.length > 0
          ? Math.floor((new Date() - new Date(entity.activities[0].created_at)) / (1000 * 60 * 60 * 24))
          : 999;
        
        // No recent activity
        if (daysSinceLastActivity > 7) {
          recommendations.push({
            action: 'send_follow_up_email',
            title: 'Send Follow-up Email',
            description: `It's been ${daysSinceLastActivity} days since last contact. Send a follow-up to re-engage.`,
            priority: 'high',
            confidence: 0.9,
            estimated_impact: 'High conversion probability'
          });
        }
        
        // Lead is hot (high score, recent activity)
        if (entity.score > 75 && daysSinceLastActivity < 3) {
          recommendations.push({
            action: 'schedule_demo',
            title: 'Schedule Product Demo',
            description: 'Lead is highly engaged. Schedule a demo to move forward.',
            priority: 'urgent',
            confidence: 0.85,
            estimated_impact: '60% chance of conversion'
          });
        }
        
        // Missing key information
        if (!entity.phone || !entity.email) {
          recommendations.push({
            action: 'collect_info',
            title: 'Collect Contact Information',
            description: 'Missing key contact details. Reach out to complete profile.',
            priority: 'medium',
            confidence: 0.7,
            estimated_impact: 'Improves outreach success'
          });
        }
        
      } else if (entityType === 'deal') {
        entity = await Deal.findByPk(entityId);
        
        if (!entity) return null;
        
        const daysSinceUpdate = Math.floor(
          (new Date() - new Date(entity.updated_at)) / (1000 * 60 * 60 * 24)
        );
        
        // Deal stagnant
        if (daysSinceUpdate > 14) {
          recommendations.push({
            action: 'revive_deal',
            title: 'Revive Stagnant Deal',
            description: `Deal hasn't moved in ${daysSinceUpdate} days. Schedule check-in call.`,
            priority: 'high',
            confidence: 0.75,
            estimated_impact: 'Prevent deal from going cold'
          });
        }
        
        // Close date approaching
        if (entity.close_date) {
          const daysToClose = Math.floor(
            (new Date(entity.close_date) - new Date()) / (1000 * 60 * 60 * 24)
          );
          if (daysToClose <= 7 && daysToClose > 0) {
            recommendations.push({
              action: 'final_push',
              title: 'Final Push Before Close Date',
              description: `Only ${daysToClose} days until expected close. Send proposal or schedule closing call.`,
              priority: 'urgent',
              confidence: 0.9,
              estimated_impact: 'Maximize close probability'
            });
          }
        }
      }
      
      // Return highest priority recommendation
      if (recommendations.length === 0) {
        return {
          action: 'monitor',
          title: 'Continue Monitoring',
          description: 'No immediate action required. Keep monitoring progress.',
          priority: 'low',
          confidence: 0.6
        };
      }
      
      // Sort by priority
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      recommendations.sort((a, b) => 
        priorityOrder[b.priority] - priorityOrder[a.priority]
      );
      
      // Store insight
      const topRecommendation = recommendations[0];
      await AIInsight.create({
        insight_type: 'next_best_action',
        entity_type: entityType,
        entity_id: entityId,
        title: topRecommendation.title,
        description: topRecommendation.description,
        confidence_score: topRecommendation.confidence,
        priority: topRecommendation.priority,
        action_recommended: {
          action: topRecommendation.action,
          estimated_impact: topRecommendation.estimated_impact
        }
      });
      
      return topRecommendation;
      
    } catch (error) {
      console.error('Error getting next best action:', error);
      return null;
    }
  }
  
  /**
   * Detect anomalies in data patterns
   * @returns {Promise<Array>} Detected anomalies
   */
  async detectAnomalies() {
    const anomalies = [];
    
    try {
      // Anomaly 1: Sudden drop in conversion rate
      const recentLeads = await Lead.count({
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      });
      
      const convertedLeads = await Lead.count({
        where: {
          status: 'converted',
          updated_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      });
      
      const conversionRate = recentLeads > 0 ? (convertedLeads / recentLeads) * 100 : 0;
      
      if (conversionRate < 10) { // Threshold: below 10% is anomaly
        anomalies.push({
          type: 'low_conversion_rate',
          title: 'Low Conversion Rate Detected',
          description: `Current conversion rate is ${conversionRate.toFixed(1)}%, below normal range.`,
          severity: 'high',
          recommendation: 'Review lead quality and follow-up processes',
          data: { conversionRate, recentLeads, convertedLeads }
        });
      }
      
      // Anomaly 2: Deals stuck in pipeline
      const stuckDeals = await Deal.count({
        where: {
          stage: {
            [Op.in]: ['proposal', 'negotiation']
          },
          updated_at: {
            [Op.lt]: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // Not updated in 3 weeks
          }
        }
      });
      
      if (stuckDeals > 5) {
        anomalies.push({
          type: 'stuck_deals',
          title: 'Multiple Deals Stalled',
          description: `${stuckDeals} deals haven't moved in 3+ weeks`,
          severity: 'medium',
          recommendation: 'Review and re-engage stalled opportunities',
          data: { stuckDeals }
        });
      }
      
      // Store anomaly insights
      for (const anomaly of anomalies) {
        await AIInsight.create({
          insight_type: 'anomaly_detection',
          entity_type: 'account', // System-wide
          entity_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          title: anomaly.title,
          description: anomaly.description,
          confidence_score: 0.8,
          priority: anomaly.severity === 'high' ? 'urgent' : 'high',
          action_recommended: {
            recommendation: anomaly.recommendation,
            data: anomaly.data
          }
        });
      }
      
      return anomalies;
      
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return [];
    }
  }
  
  /**
   * Generate conversation summary using AI
   * @param {Array} messages - Array of messages
   * @returns {Object} Summary
   */
  async summarizeConversation(messages) {
    if (!messages || messages.length === 0) {
      return { summary: 'No messages to summarize', key_points: [], sentiment: 'neutral' };
    }
    
    // Extract key information
    const messageCount = messages.length;
    const participants = [...new Set(messages.map(m => m.from_name).filter(Boolean))];
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['thank', 'great', 'excellent', 'happy', 'love', 'perfect', 'yes'];
    const negativeWords = ['issue', 'problem', 'concern', 'disappointed', 'no', 'cannot', 'frustrated'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    messages.forEach(msg => {
      const text = (msg.body_text || '').toLowerCase();
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
    });
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount + 2) sentiment = 'positive';
    else if (negativeCount > positiveCount + 2) sentiment = 'negative';
    
    // Extract key points (simplified - first and last messages)
    const keyPoints = [];
    if (messages.length > 0) {
      keyPoints.push(`Initial contact: ${messages[0].body_text?.substring(0, 100)}...`);
    }
    if (messages.length > 1) {
      keyPoints.push(`Latest update: ${messages[messages.length - 1].body_text?.substring(0, 100)}...`);
    }
    
    return {
      summary: `Conversation with ${messageCount} messages between ${participants.join(', ')}. Overall sentiment: ${sentiment}.`,
      key_points: keyPoints,
      sentiment,
      message_count: messageCount,
      participants,
      confidence: 0.7
    };
  }
}

module.exports = new AIService();
