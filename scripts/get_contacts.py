import os
import json
import urllib.request
          
api_key = os.environ['SENDGRID_API_KEY']
list_id = os.environ['SENDGRID_LIST_ID']
          
url = "https://api.sendgrid.com/v3/marketing/contacts/search"

headers = {
  "Authorization": f"Bearer {api_key}",
  "Content-Type": "application/json"
}
          
payload = {
  "query": f"CONTAINS(list_ids, '{list_id}')"
}
          
req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers=headers,
    method='POST'
)
          
try:
  with urllib.request.urlopen(req) as response:
      result = json.loads(response.read().decode('utf-8'))
      contacts = result.get('result', [])
      subscribers = [ { "email": contact['email'], "first_name": contact.get('first_name', '')} for contact in contacts] 
      print(f"Found {len(subscribers)} subscribers")
      with open('subscribers.json', 'w') as f:
              json.dump(subscribers, f)
except Exception as e:
  print(f"Error: {e}")
  exit(1)
