from inference.face_rec import *
from inference.ppe_detection import *
from utils import *
import cv2

# # the following is an illustration for using the full system in terms of:
# # checking on ppe module, face recognition module and retriving the violations-per-worker functionality.
video_capture = cv2.VideoCapture(0)
counter = 5
while counter!=0:
    counter -= 1
    
    ret, img = video_capture.read()
    img_raw, img_modified, detected_items = detect_ppe(img)
    person_to_violations = matching_violations_faces(img_raw, detected_items, recognize_faces)

    
print(person_to_violations)


    

