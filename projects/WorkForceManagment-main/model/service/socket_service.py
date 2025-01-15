

import httpx

async def post_alert(baseurl , data: dict):
    """ Sends alert data to the specified endpoint. """
    async with httpx.AsyncClient(verify=False) as client:  
        try:
            response = await client.post(baseurl, json=data)
            response.raise_for_status()
            print("Alert posted successfully.")
            # exit()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred while posting alert: {e}")
        except httpx.RequestError as e:
            print(f"Request error occurred while posting alert: {e}")