#!/bin/bash

# Slack Notification Script
# This script sends deployment status notifications to Slack

set -e  # Exit on any error

# Configuration
GREEN_WEBHOOK="https://hooks.slack.com/services/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"
BLUE_WEBHOOK="https://hooks.slack.com/services/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"

# Function to send Slack notification
send_slack_notification() {
    local environment=$1
    local branch=$2
    local status=$3
    local webhook_url=$4
    
    local color="good"
    local emoji="🎉"
    local status_text="✅ Success"
    
    if [ "$status" != "success" ]; then
        color="danger"
        emoji="🚨"
        status_text="❌ Failed"
    fi
    
    local message="{
        \"text\": \"${emoji} *${environment} Deployment ${status_text}!*\",
        \"attachments\": [
            {
                \"color\": \"${color}\",
                \"fields\": [
                    {
                        \"title\": \"Environment\",
                        \"value\": \"${environment}\",
                        \"short\": true
                    },
                    {
                        \"title\": \"Branch\",
                        \"value\": \"${branch}\",
                        \"short\": true
                    },
                    {
                        \"title\": \"Status\",
                        \"value\": \"${status_text}\",
                        \"short\": true
                    },
                    {
                        \"title\": \"Timestamp\",
                        \"value\": \"$(date -u +'%Y-%m-%d %H:%M:%S UTC')\",
                        \"short\": true
                    }
                ],
                \"footer\": \"Blue-Green Deployment Pipeline\"
            }
        ]
    }"
    
    echo "📢 Sending ${status} notification to Slack..."
    curl -X POST -H 'Content-type: application/json' \
        --data "$message" \
        "$webhook_url"
}

# Main execution
main() {
    local environment=$1
    local branch=$2
    local job_status=$3
    
    case $environment in
        "green")
            send_slack_notification "Green (Staging)" "$branch" "$job_status" "$GREEN_WEBHOOK"
            ;;
        "blue")
            send_slack_notification "Blue (Production)" "$branch" "$job_status" "$BLUE_WEBHOOK"
            ;;
        *)
            echo "❌ Invalid environment: $environment"
            echo "Usage: $0 {green|blue} <branch> <job_status>"
            exit 1
            ;;
    esac
}

# Check if correct number of arguments
if [ $# -ne 3 ]; then
    echo "❌ Invalid number of arguments"
    echo "Usage: $0 {green|blue} <branch> <job_status>"
    exit 1
fi

# Execute main function
main "$1" "$2" "$3"
