import cv2
import concurrent.futures
import face_recognition
import pickle
import os
import numpy as np
import httpx
import asyncio
import base64


def load_known_faces(filename: str) -> tuple[list, list]:
    """
    Load the embeddings of known faces from the pickle file to be used in the comparison with the feed taken from cameras.
    
    Args:
        filename (str): the pickle file that contains the embeddings of known faces

    Returns:
        tuple: a tuple containing two lists:
               - List of embeddings of known faces.
               - List of names corresponding to the known faces.
    """
    if os.path.exists(filename):
        with open(filename, 'rb') as file:
            return pickle.load(file)
    return [], []

def save_known_faces(filename: str, known_faces: list, known_names: list) -> None:
    """
    Save the embeddings of the faces introduced in the faces directory.
    The pickle file saved also includes the names of the known faces.
    
    Args:
        filename (str): The name of the pickle file to save.
        known_faces (list): The embeddings of known faces.
        known_names (list): The names of the known.
    
    Returns:
        None
    """
    with open(filename, 'wb') as file:
        pickle.dump((known_faces, known_names), file)

async def get_faces_from_api(endpoint: str, filename: str) -> None:
    """
    Fetch employee images from an API endpoint and add them to the pickle file 
    so that they can be compared with unknown faces during production.
    
    Args:
        endpoint (str): API endpoint URL where employee images are stored.
        filename (str): Filename of the pickle file to save embeddings.
    
    Returns:
        None
    """
    # Ensure not to overwrite existing embeddings
    if os.path.exists(filename):
        print(f"Embeddings file {filename} already exists. Skipping embedding process.")
        return

    known_faces, known_names = load_known_faces(filename)
    async with httpx.AsyncClient(verify=False) as client:
        response = await client.get(endpoint)
        employees = response.json()

    for employee in employees:
        person_name = f"{employee['employeeName']}_{employee['_id']}"
        base64_image = employee['img']  

        try:
            # Decode the base64 string
            image_bytes = base64.b64decode(base64_image)
            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

            # Use face recognition to get face encodings
            known_face_encodings = face_recognition.face_encodings(image)
            if known_face_encodings:
                known_faces.append(known_face_encodings[0])
                known_names.append(person_name)
                print(f"Added face encoding for {person_name}")
        except Exception as e:
            print(f"Failed to process image for {person_name}: {e}")

    save_known_faces(filename, known_faces, known_names)


def get_faces_locally(directory: str, filename: str) -> None:
    """
    Add face encodings from images in a local directory to a pickle file.

    Args:
        directory (str): Path to the root directory containing subdirectories for each person.
        filename (str): Path to the pickle file where encodings will be stored.

    Returns:
        None
    """
    if os.path.exists(filename):
        print(f"Embeddings file {filename} already exists. Skipping embedding process.")
        return

    known_faces, known_names = load_known_faces(filename)

    for person_name in os.listdir(directory):

        person_path = os.path.join(directory, person_name)

        if not os.path.isdir(person_path):
            continue  

        for image_name in os.listdir(person_path):
            image_path = os.path.join(person_path, image_name)
            try:
                image = cv2.imread(image_path)
                if image is None:
                    print(f"Skipping invalid image: {image_path}")
                    continue

                # Use face recognition to get face encodings
                known_face_encodings = face_recognition.face_encodings(image)
                if known_face_encodings:
                    known_faces.append(known_face_encodings[0])
                    known_names.append(person_name)
                    print(f"Added face encoding for {person_name} from {image_name}")
            except Exception as e:
                print(f"Failed to process image {image_name} for {person_name}: {e}")

    save_known_faces(filename, known_faces, known_names)
    print(f"Face encodings saved to {filename}")
    

def recognize_one_face(face_encoding: np.ndarray, filename="known_faces.pkl") -> str:
    """
    Compare face encoding of an unknown face taken from the stream/shot with the embeddings in the 
    pickle file and then assign the name of this face if recognized.

    Args:
        face_encoding (np.ndarray): face encoding of unknown face.
        filename (str): filename of the pickle file.

    Returns:
        str: name of the recognized face.
    """
    known_faces, known_names = load_known_faces(filename)
    matches = face_recognition.compare_faces(known_faces, face_encoding)
    name = "Unknown"
    if True in matches:
        first_match_index = matches.index(True)
        name = known_names[first_match_index]
    return name

def recognize_faces(processed_frame: np.ndarray, frame: np.ndarray, small_frame: np.ndarray, factor: int = 1) -> tuple[np.ndarray, np.ndarray, list[str]]:
    """
    Extracts face locations and take them as cropped images, then encode them and 
    send them to the recognize_one_face function to recognize each face and assign 
    his/her name.

    Args:
        processed_frame (np.ndarray): The frame where face detections will be drawn.
        frame (np.ndarray): The original frame taken from the camera/stream source.
        small_frame (np.ndarray): Resized for optimization.
        factor (int): Resize factor for the passed frame.
    
    Returns:
        tuple: raw frame without changes, processed frame, and a list of names recognized in the given frame.
    """
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        names = list(executor.map(lambda enc: recognize_one_face(enc, "known_faces.pkl"), face_encodings))
    
    raw_frame = frame.copy()
    for (top, right, bottom, left), name in zip(face_locations, names):
        cv2.rectangle(processed_frame, (left * factor, top * factor - 50), (right * factor, bottom * factor + 10), (0, 255, 0), 4)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(processed_frame, name, (left * factor + 6, bottom * factor + 4), font, 0.8, (255, 255, 255), 1)

    return raw_frame, processed_frame, names

