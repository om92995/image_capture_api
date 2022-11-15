import base64
import cv2
import os
from datetime import datetime


class CameraCapture:
    def __init__(self):
        pass
    

    def getBase64String(self, capturedImagePath):
        try:
            with open(capturedImagePath, "rb") as image:
                base64Sring = base64.b64encode(image.read())
                return base64Sring.decode('utf-8')
        except Exception as error:
            #logError
            print(error)
            return ""
        
    
    def capture(self, imageWidth, imageHeight, defaultName="captureDeault"):
        captureTime = "Not Logged"
        base64Sring = ""
        imageCaptureCommand = "raspistill -n -t 1000 -w 1200 -h 1200 -a 1036 -ae +25+25 -o " + defaultName + captureTime + ".jpg"
        
        try:
            if imageWidth!="" and imageHeight!="":
                now = datetime.now()
                captureTime = now.strftime("%d-%m-%Y %H:%M:%S").replace(" ", "_")
                command = "raspistill -n -t 1000 -w {} -h {} -a 1036 -ae +25+25 -o /resources" + defaultName + captureTime + ".jpg"
                imageCaptureCommand = command.format(imageWidth, imageHeight)
            os.system(imageCaptureCommand)
            imageName = defaultName + captureTime + ".jpg"
            imageSring = self.getImencodeStringCv2(imageName)
            return captureTime, imageName, imageSring
        except Exception as error:
            #logError
            print(error)
            imageName = defaultName + captureTime + ".jpg"
            return captureTime, imageName, base64Sring
