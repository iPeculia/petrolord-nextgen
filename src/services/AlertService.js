import { notificationService } from './NotificationService';

class AlertService {
    // Basic Rule Evaluation Logic
    evaluateAlertRules(event, rules) {
        const triggeredRules = [];
        
        rules.forEach(rule => {
            if (!rule.is_active) return;
            
            // Simple condition check (extensible)
            try {
                const condition = rule.trigger_condition;
                let isTriggered = false;

                // Example: { "type": "grade", "operator": "<", "value": 50 }
                if (condition.type === event.type) {
                    if (condition.operator === '<' && event.value < condition.value) isTriggered = true;
                    if (condition.operator === '>' && event.value > condition.value) isTriggered = true;
                    if (condition.operator === '==' && event.value === condition.value) isTriggered = true;
                }

                if (isTriggered) {
                    triggeredRules.push(rule);
                }
            } catch (err) {
                console.error(`Error evaluating rule ${rule.rule_name}:`, err);
            }
        });

        return triggeredRules;
    }

    async triggerAlert(rule, userId, contextData) {
        try {
            const title = `Alert: ${rule.rule_name}`;
            const message = this.formatMessage(rule.action.message_template, contextData);
            
            await notificationService.createNotification(
                userId,
                title,
                message,
                'warning',
                'alert',
                { ruleId: rule.id, ...contextData }
            );
            
            console.log(`Alert triggered for user ${userId}: ${rule.rule_name}`);
        } catch (error) {
            console.error('Error triggering alert:', error);
        }
    }

    formatMessage(template, data) {
        // Simple variable substitution
        let message = template || "Alert triggered";
        Object.keys(data).forEach(key => {
            message = message.replace(`{{${key}}}`, data[key]);
        });
        return message;
    }
}

export const alertService = new AlertService();