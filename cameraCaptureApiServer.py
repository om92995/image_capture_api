# imports are here
from flask import Flask, jsonify
from datetime import datetime
import os
import cv2
import base64
from threading import Thread

# creating glask app
app = Flask(__name__)

# global variables
imageStringDictionary = {} # this will save base64 string
latestCaptueImageName = "" # this will store latest key for base64 string


def capture(imagePath, imageWidth="3500", imageHeight="3500"):
    global latestCaptueImageName 
    imageCaptureCommand = ""
    try:
        command = "raspistill -n -t 1 w {} -h {} -o {}"
        imageCaptureCommand = command.format(imageWidth, imageHeight, imagePath)
        os.system(imageCaptureCommand)
        imageName = imagePath.split(os.sep)[-1] 
        saveBase64String(imageName, imagePath)
        latestCaptueImageName = imageName       
    except Exception as error:
        #logError
        print(error)

def saveBase64String(imageName, imagePath):
    global imageStringDictionary
    try:
        with open(imagePath, "rb") as image:
            base64Sring = base64.b64encode(image.read())
            imageStringDictionary[imageName] = base64Sring.decode('utf-8')     
    except Exception as error:
        print(error)


def startCapture():
    counter = 0
    while True:
        counter = counter % 10
        imagePath = "logs" + os.sep + "capture_logs" + os.sep + str(counter) + ".jpg"
        capture(imagePath)
        counter+=1


class CameraCapture:
    def __init__(self):
        pass


@app.route('/getCameraCapture', methods=["GET", "POST"])
def getCameraCapture():
    responseDictionary = {"information" : "", "data" : None}
    data = {}
    global latestCaptueImageName
    global imageStringDictionary
    try:
        data["imageString"] = imageStringDictionary[latestCaptueImageName]
        responseDictionary["information"] = "success"
        responseDictionary["data"] = data
        return(jsonify(responseDictionary))
    except Exception as error:
        #logError
        print(error)
        responseDictionary["information"] = "failure"
        return(jsonify(responseDictionary))
    

@app.route('/home', methods=["GET", "POST"])
def welcome():
    return "ENCO Camera Capture API Online"


if True:
    myThread = None
    try:
        hostIpAddress = '192.168.54.3'
        connectionPort = 5004
        myThread = Thread(target=startCapture)
        myThread.start()
        app.run(host=hostIpAddress, port=connectionPort)
    except Exception as error:
        #logError
        print(error)
        myThread.join()
