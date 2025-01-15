
import base64
import json
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
from service.camera_service import fetch_cameras
from service.socket_service import post_alert


app = FastAPI()

host_url = "http://localhost:3362"
node_url_post_alerts = host_url + "/v1/api/attendance/notifactions"
node_url_get_emps = host_url + '/v1/api/employees/imgs'
node_url_get_cameras = host_url + "/v1/api/devices"

local_pickle_file = 'known_faces.pkl'
local_faces_dir = './faces'

class StreamData(BaseModel):
    rtsp_url: str
    site_name: str


async def process_stream_all():
    
    cameras = await fetch_cameras(node_url_get_cameras)
    
    while True:
        
        for camera in cameras:

            # rtsp_url = "rtsp://testtest:000000@192.168.1.67:554/stream1"
            rtsp_url = camera['deviceUrl']
            
            # cap = cv2.VideoCapture("./video.mp4") # for sake of illustration
            cap = cv2.VideoCapture(rtsp_url)
            # cap = cv2.VideoCapture(0)

            ret, frame = cap.read()
            if not ret:
                break

            raw_img = frame.copy()
            processed_img = raw_img
            _, processed_img, names = recognize_faces(processed_img, raw_img, raw_img)

            # for name in names:
                
            #     request_body = {}
                
            #     print(result[0])
            
            #     request_body = {
            #         "area": site_name,
            #         "employeeId": "67626faf7c866d8744bc9a48", 
            #         "personImg": base64.b64encode(jpg_as_text).decode('utf-8')
            #     }
                
            #     print("Sending: ", request_body)
            #     await post_alert(node_url_post_alerts , request_body)       


            if len(names) != 0: 
                print(names)
                result = names[0]
                result_formated = []
                request_body = {}

                print(result) # prints Mahmoud Taha

                _, buffer = cv2.imencode('.jpg', raw_img)
                base64Image = base64.b64encode(buffer).decode('utf-8')

                if ("_" in result):
                    print(f"\n\n\nCam Loc: {camera['deviceLocation']}\n\n\n")

                    request_body = {
                        "area": camera['deviceLocation'],
                        "employeeId": result.split("_")[1],
                        "img": base64Image 
                        }
              
                 
                    
                   

    
                    print("Sending: ", request_body['employeeId'])
                    await post_alert(node_url_post_alerts , request_body)
                else:
                    print("Found Unknown")  


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

@app.on_event("startup")
async def startup_event():
    print("Flag: start up")
    # get_faces_locally(local_faces_dir, local_pickle_file)
    await get_faces_from_api(node_url_get_emps, local_pickle_file)
    await process_stream_all()

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


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
