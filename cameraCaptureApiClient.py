import requests
import os
import time

cameraApiIpAddress = "192.168.54.1"
cameraApiPort = "5006"
methodToGet = "getCameraCapture"
captureImageWidth = 1200
captureImageHeight = 1200


def main():
    requestString = "http://" + cameraApiIpAddress + ":" + cameraApiPort + os.sep + methodToGet
    
    try:
        start = time.time()
        response = requests.get(requestString)
        print(time.time()-start)
    except Exception as error:
        #logError
        print(error)
        
    
if __name__=="__main__":
    main()