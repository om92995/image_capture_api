import configparser


class Configurator:
    def __init__(self):
        pass
    

    def configurator(self, capturedImagePath):
        try:
            configuration = configparser.ConfigParser()
            configuration.read("")

        except Exception as error:
            #logError
            print(error)
            return ""