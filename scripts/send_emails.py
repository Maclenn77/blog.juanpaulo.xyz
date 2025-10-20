import os
import json
import requests
from datetime import datetime

# Load environment variables

# Sendgrid settings          
api_key = os.environ['SENDGRID_API_KEY']
sender_email = os.environ['SENDER_EMAIL']
template_id = os.environ['SENDGRID_TEMPLATE_ID']
sender_name = os.environ.get('SENDER_NAME', 'Blog Notification')
unsubscribe_group_id = os.environ.get('SENDGRID_UNSUBSCRIBE_GROUP_ID')

# P
title = os.environ.get('POST_TITLE', 'New Blog Post')
description = os.environ.get('POST_DESCRIPTION', '')
post_url = os.environ['POST_URL']
post_date = os.environ.get('POST_DATE', '')
city = os.environ.get('POST_CITY', '')
country = os.environ.get('POST_COUNTRY', 'México')

# Functions

# Date formatting function
def format_template_date(date_str):
    """
    Formatea fecha para el template de SendGrid
    """
    MONTHS = {
        1: 'enero', 2: 'febrero', 3: 'marzo', 4: 'abril',
        5: 'mayo', 6: 'junio', 7: 'julio', 8: 'agosto',
        9: 'septiembre', 10: 'octubre', 11: 'noviembre', 12: 'diciembre'
    }
    
    date = datetime.strptime(date_str, "%Y-%m-%d %H:%M %z")
    
    return f"{int(date.day)} de {MONTHS[int(date.month)]} de {date.year}"

# send email function
def send_mail_with_template(contacts, template_data) -> bool:
    """
    Envía emails usando Mail Send API con datos dinámicos del template
    """
    if not contacts:
        print("✗ There are no contacts to send emails to.")
        return False
    
    # Construir personalizations para cada contacto
    personalizations = []
    for contact in contacts:
        personalization = {
            "to": [
                {
                    "email": contact.get('email'),
                    "name": contact.get('name', '')
                }
            ],
            "dynamic_template_data": {
                "recipient_name": contact.get('name')
            } | template_data
        }
        personalizations.append(personalization)
    
    # Payload completo
    payload = {
        "from": {
            "email": sender_email,
            "name": sender_name
        },
        "template_id": template_id,
        "personalizations": personalizations,
        "asm": {
                "group_id": int(unsubscribe_group_id),
            },
        "tracking_settings": {
                "click_tracking": {"enable": True},
                "open_tracking": {"enable": True}
            }
    }
    
    # Enviar
    url = 'https://api.sendgrid.com/v3/mail/send'
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        print(f"✓ Sent emails successfully to {len(contacts)} contacts.")
        return True
    
    except requests.exceptions.RequestException as e:
        print(f"✗ There was an error sending emails: {e}")
        if hasattr(e.response, 'text'):
            print(f"Detalles: {e.response.text}")
        return False


# Get contacts from subscribers.json     
with open('subscribers.json', 'r') as f:
  subscribers = json.load(f)

# Get content from output.html
with open('output.html', 'r') as f:
    html_content = f.read()

# Prepare request headers
headers = {
    'Authorization': f'Bearer {os.environ['SENDGRID_API_KEY']}',
    'Content-Type': 'application/json'
}

# Prepare template data
template_data = {
        "content": html_content,
        "description": description,
        "title": title,
        "city": city,
        "country": country,
        "original_post": post_url,
        "date": format_template_date(post_date)
    }

# Send emails
result = send_mail_with_template(subscribers, template_data)

if not result:
    print("✗ Email sending failed.")
    exit(1)
else:
    print("✓ Email sending completed successfully.")
    exit(0)
