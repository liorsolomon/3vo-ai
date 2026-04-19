#!/usr/bin/env bash
# Setup UptimeRobot monitors for all 3vo.ai domains.
# Usage: UPTIMEROBOT_API_KEY=<key> TELEGRAM_CHAT_ID=<chat_id> bash scripts/setup-uptimerobot.sh
#
# Requires: UPTIMEROBOT_API_KEY and TELEGRAM_CHAT_ID env vars.
# Free tier: 50 monitors, 5-minute check interval, HTTP checks.
# Docs: https://uptimerobot.com/api/

set -euo pipefail

API_KEY="${UPTIMEROBOT_API_KEY:?Set UPTIMEROBOT_API_KEY}"
CHAT_ID="${TELEGRAM_CHAT_ID:-6302268660}"

DOMAINS=(
  "https://3vo.ai"
  "https://templates.3vo.ai"
  "https://prompts.3vo.ai"
  "https://tools.3vo.ai"
  "https://validate.3vo.ai"
  "https://vc.3vo.ai"
)

# Get or create a Telegram alert contact
echo "Fetching alert contacts..."
CONTACTS_RESP=$(curl -s -X POST "https://api.uptimerobot.com/v2/getAlertContacts" \
  -d "api_key=${API_KEY}&format=json")
echo "$CONTACTS_RESP" | python3 -c "import json,sys; r=json.load(sys.stdin); [print(c['id'], c['type'], c.get('value','')) for c in r.get('alert_contacts',[])]"

echo ""
echo "Creating monitors for all 6 domains..."

for URL in "${DOMAINS[@]}"; do
  NAME=$(echo "$URL" | sed 's|https://||')
  echo -n "Creating monitor for $NAME ... "

  RESP=$(curl -s -X POST "https://api.uptimerobot.com/v2/newMonitor" \
    -d "api_key=${API_KEY}" \
    -d "format=json" \
    -d "type=1" \
    -d "url=${URL}" \
    -d "friendly_name=${NAME}" \
    -d "interval=300")

  STATUS=$(echo "$RESP" | python3 -c "import json,sys; r=json.load(sys.stdin); print(r.get('stat','unknown'))")
  ID=$(echo "$RESP" | python3 -c "import json,sys; r=json.load(sys.stdin); print(r.get('monitor',{}).get('id',''))" 2>/dev/null || echo "")

  if [ "$STATUS" = "ok" ]; then
    echo "OK (id=$ID)"
  else
    echo "FAILED: $RESP"
  fi
done

echo ""
echo "Done. Visit https://dashboard.uptimerobot.com to configure Telegram alert contacts."
echo "Add your Telegram bot as an alert contact, then assign it to each monitor."
