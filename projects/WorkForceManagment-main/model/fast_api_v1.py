
import base64
import json
import httpx
import time
import shutil
import requests
import cv2
import time
import uvicorn
import asyncio
import threading
from utils import *
from pydantic import BaseModel
from inference.face_rec import *
from inference.ppe_detection import *
from fastapi import FastAPI, BackgroundTasks, WebSocket


app = FastAPI()

host_url = "http://localhost:3362"
# host_url = "https://safesound.onrender.com"

node_uri_post_alerts = host_url + "/v1/api/attendance/notifactions"
# node_urt_get_emps = host_url + "/api/v1/employees"
# node_uri_get_cameras = host_url + "/api/v1/cameras"

# async def fetch_cameras():
#     async with httpx.AsyncClient(verify=False) as client:  
#         try:
#             response = await client.get(node_uri_get_cameras)
#             response.raise_for_status()
#             print("cameras return:", response.json())
#             return response.json()
#         except httpx.HTTPStatusError as e:
#             print(f"HTTP error occurred: {e}")
#         except httpx.RequestError as e:
#             print(f"Request error occurred: {e}")
#         return []

async def post_alert(data: dict):
    """ Sends alert data to the specified endpoint. """
    async with httpx.AsyncClient(verify=False) as client:  
        try:
            response = await client.post(node_uri_post_alerts, json=data)
            response.raise_for_status()
            print("Alert posted successfully.")
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred while posting alert: {e}")
        except httpx.RequestError as e:
            print(f"Request error occurred while posting alert: {e}")


class StreamData(BaseModel):
    rtsp_url: str
    site_name: str


async def process_stream_all():
    
    # camera_data = await fetch_cameras()
    camera_data = [1]
    # for _ in range(10):  
    while True:
        
        for camera in camera_data:
        # for camera in range(1):
            # rtsp_url = camera['IP']
            # site_name = camera['cameraSite']
            # site_name = "site"
            # cap = cv2.VideoCapture("./video.mp4") # for sake of illustration
            # cap = cv2.VideoCapture(rtsp_url)
            # cap = cv2.VideoCapture(0)
            cap = cv2.VideoCapture('rtsp://testtest:000000@192.168.1.67:554/stream1')
            results_10 = []
            processed_img_10 = []
            ret, frame = cap.read()
            if not ret:
                break
            raw_img = frame.copy()
            processed_img = raw_img
            # raw_img, processed_img, detected_items = detect_ppe(img)
            _, processed_img, names = recognize_faces(processed_img, raw_img, raw_img)
            # result = matching_violations_faces(frame, detected_items, recognize_faces, site_name)
            # results_10.append(result)
            # print("time: " + str(time.time() - start_t))
            ## time between each candidate frame
            
            # print(processed_img_10)
            jpg_as_text = processed_img
            if len(names) != 0: 
                result = names[0]
                result_formated = []
                sample = {}
                # result[result]['personImg'] = jpg_as_text

                print(result[0])
            
                sample = {
                    "area": "Site 1",
                    "employeeId": "67626faf7c866d8744bc9a48", 
                    "personImg": base64.b64encode(jpg_as_text).decode('utf-8')
                }
                
                print("Sending: ", sample)
                await post_alert(sample)


# async def fetch_employee_images():
#     async with httpx.AsyncClient(verify=False) as client:
#         try:
#             response = await client.get(node_urt_get_emps)
#             response.raise_for_status()
#             return response.json()
#         except httpx.HTTPStatusError as e:
#             print(f"HTTP error occurred: {e}")
#         except httpx.RequestError as e:
#             print(f"Request error occurred: {e}")
#         return

# async def add_faces_from_api(endpoint: str, filename: str):
#     if os.path.exists(filename):
#         print(f"Embeddings file {filename} already exists. Skipping embedding process.")
#         return

#     known_faces, known_names = load_known_faces(filename)
#     employees = await fetch_employee_images()
#     async with httpx.AsyncClient(verify=False) as client:
#         for employee in employees:
#             person_name = f"{employee['firstName']} {employee['lastName']}_{employee['_id']}"
#             base64_image = employee['img']  

#             try:
#                 # Decode the base64 string
#                 image_bytes = base64.b64decode(base64_image)
#                 image_array = np.frombuffer(image_bytes, dtype=np.uint8)
#                 image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

#                 # Use face recognition to get face encodings
#                 known_face_encodings = face_recognition.face_encodings(image)
#                 if known_face_encodings:
#                     known_faces.append(known_face_encodings[0])
#                     known_names.append(person_name)
#                     print(f"Added face encoding for {person_name}")
#             except Exception as e:
#                 print(f"Failed to process image for {person_name}: {e}")

#     save_known_faces(filename, known_faces, known_names)


@app.on_event("startup")
async def startup_event():
    print("Flag: start up")

    add_faces_locally('./faces', 'known_faces.pkl')
    # await add_faces_from_api(host_url + '/v1/api/employees/imgs', 'known_faces.pkl')
    while True:
        pass
        await process_stream_all()


async def process_stream(rtsp_url: str, site_name: str, websocket: WebSocket=None):
    cap = cv2.VideoCapture(rtsp_url if rtsp_url else 0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        ret, raw_img = cap.read()
        # raw_img, processed_img, detected_items = detect_ppe(img)
        _, processed_img, _ = recognize_faces(processed_img, raw_img, raw_img)

        # result = matching_violations_faces(frame, detected_items, recognize_faces, site_name)
        # print(result)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/process_rtsp/")
async def process_rtsp_endpoint(stream_data: StreamData, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_stream, stream_data.rtsp_url, stream_data.site_name)
    return {"message": "Stream processing started"}


@app.websocket("/ws/live_stream/")
async def websocket_live_stream(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        try:
            data_dict = json.loads(data)  
            await process_stream(data_dict['rtsp_url'], data_dict['site_name'], websocket=websocket)
        except json.JSONDecodeError:
            await websocket.send_text("Error: Data received is not in valid JSON format.")
        except KeyError:
            await websocket.send_text("Error: Missing 'rtsp_url' or 'site_name' in the data.")

def delete_directory_after_delay(delay, directory):
    """Deletes the specified directory after a delay in seconds."""
    shutil.rmtree(directory, ignore_errors=True)
    print(f"Directory {directory} has been deleted.")



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
