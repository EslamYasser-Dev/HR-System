
import httpx

async def fetch_cameras(camera_url):
    async with httpx.AsyncClient(verify=False) as client:  
        try:
            response = await client.get(camera_url)
            response.raise_for_status()
            print("cameras return:", response.json())
            return response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e}")
        except httpx.RequestError as e:
            print(f"Request error occurred: {e}")
        return []