
import numpy as np
import cv2 
import base64
from datetime import datetime

def within_person(person_boundaries: dict, item_boundaries: dict) -> bool:
    """
    Cheking if the boundaries of a given item is within the person boundaries
    this is done by making sure that the four edges of a given item are all inside
    the boundaries of the person class

    Args:
        person_boundaries(dict): person boundaries coordinates  
            Expected keys: 'x_left', 'y_top', 'x_right', 'y_bottom'
        item_boundaries(dict): item boundaries coordinates
            Expected keys: 'x_left', 'y_top', 'x_right', 'y_bottom'

    Returns:
        bool: True if the boundaries all fall with the person class otherwise False
    """
    if (item_boundaries["x_left"] >= person_boundaries["x_left"] and \
       item_boundaries["y_top"] >= person_boundaries["y_top"]) and \
       (item_boundaries["x_right"] <= person_boundaries["x_right"] and \
        item_boundaries["y_bottom"] <= person_boundaries["y_bottom"]):
        return True
    return False

    


def matching_violations_faces(img: np.ndarray, detected_items: list, recognize_faces: callable, site_name: str="webcam") -> dict:
    """
    Assigning for each person class detected the face associated with this person. if more than
    one face is detected or detected no face, it will ignore this person. Otherwise it will
    look for the vilations if any. The focus here is not to assume a violation while there is not.

    Args:
        img (np.ndarray): frame captured from a given camera
        detected_items (list): return results of the yolo ppe model
        recognized_faces (callable): the function used to recognize faces
        site_name (str): the name of the site at which the camera is located

    Returns:
        dict: a dictionary containing each person's name as a key and associated violations as the 
              the value which is also a dictionary
    """
    person_to_violations = {}
    for item in detected_items:
        if item[0] == 'Person':
            person_boundaries = {'x_left': item[2][0], 'y_top': item[2][1], 'x_right': item[2][2], 'y_bottom': item[2][3]}

            face_crop = img[person_boundaries['y_top']:person_boundaries['y_bottom'], person_boundaries['x_left']:person_boundaries['x_right']].copy()

            _, _, person_names = recognize_faces(face_crop, face_crop, face_crop)

            # if len(person_names)==1: # and person_names[0]!="Unknown":    
            if True: # and person_names[0]!="Unknown":    
                
                # person_name = person_names[0]
                # name_part = person_names[0]
                name_part = "Worker"
                # person_name = "Mohamed Elsayed_120188188"
                # current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                # name_part, id_part = person_name.split('_')
                person_to_violations[name_part] = {
                                                    "site": site_name,
                                                    # "employeeId": id_part,
                                                    "noHardhat": 0,
                                                    "noSafetyVest": 0,
                                                    "noMask": 0

                                                    # "timestamp": current_timestamp
                                                    }
                # Check for violations
                for violation in detected_items:
                    if violation[0] != 'Person':
                        violation_boundaries = {'x_left': violation[2][0], 'y_top': violation[2][1], 'x_right': violation[2][2], 'y_bottom': violation[2][3]}
                        if within_person(person_boundaries, violation_boundaries):
                            if violation[0] == "NO-Hardhat":
                                person_to_violations[name_part]["noHardhat"] = 1
                            elif violation[0] == "NO-Safety Vest":
                                person_to_violations[name_part]["noSafetyVest"] = 1
                            else:
                                person_to_violations[name_part]["noMask"] = 1

    return person_to_violations

def choose_best_result(results, processed_img_10):
    best_result = None
    jpg_as_text = None
    max_violations = 0
    max_index = 0
    for i in range(len(results)):
        violations_count = 0
        for person in results[i]:
            violations_count += int(results[i][person]["noMask"]) + \
                                 int(results[i][person]["noHardhat"]) + \
                                 int(results[i][person]["noSafetyVest"])
            print("\n\n\n\n\nresults[i][person][noHardhat]", results[i][person]["noHardhat"],"\n\n\n\n")
        print(violations_count)
        if violations_count > max_violations:
            max_index = i
            max_violations = violations_count
    
    best_result = results[max_index]
    _, buffer = cv2.imencode('.jpg', processed_img_10[max_index])
    jpg_as_text = base64.b64encode(buffer).decode()
    
    return best_result, jpg_as_text


