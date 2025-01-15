import requests

# Define the URL
url = "http://127.0.0.1:3362/v1/api/employees"

# Define the payload
payload = {
    "deviceId":352,
    "employeeName": "John Doe",
    "category": "Technician",
    "site": "Headquarters",
    "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkICQoLDBYQDg4VEB0XEB4cFxcZGg8hIC8oIxIlJBwkKCArMzQ9I0cbKEMmMz48/wAARCAFhAmoDASIAAhEBAx4gF5yV12Y9y8bMz9VZpIC8m8CHjoK4zBeJVsH/JYp4M0cGnSMuJk6/U7sFgV4Cwt5D7SO7L3xwCp7CpcAohEz9A7tHRo4="
}

# Send the POST request
try:
    response = requests.post(url, json=payload)

    # Print the response
    if response.status_code == 201:
        print("Request successful:")
    else:
        print("Request failed:")
    
    print(response.json())
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
