import json


#Error raised when we can't decode the type of the message
class MessageTypeError(Exception):
    pass


#Create an error message to send to the client
def errorMessage():
    x={
        "code":401
    }
    return json.dumps(x)


#Create an ack message to send to the client
def ackMessage():
    x={
        "code":200
    }
    return json.dumps(x)

#Convert a Zone to the right format in order to send it to the client
def formatBlockedZones(zones):
    formatedZones = []
    for square in zones:
        auxPoint=[]
        for point in square:
            auxPoint.append({"x":point[0],"y":point[1]})
        formatedZones.append({"points":auxPoint})
    return formatedZones

#Convert a Path to the right format in order to send it to the client
def formatPath(path):
    pathFormated = []
    for point in path:
        pathFormated.append({"x":point[0],"y":point[1]})
    return pathFormated

#Convert a drone to the right format in order to send it to the client
def formatDrone(drone):
    formatedDrone={}
    formatedDrone["name"] = drone["name"]
    formatedDrone["owner"] = {"ID" : drone["owner"]}
    formatedDrone["priority"] = drone["priority"]
    formatedDrone["path"] = formatPath(drone["path"])
    formatedDrone["start"] = {"x": drone["start"][0],"y":drone["start"][1]}
    formatedDrone["destination"] = {"x": drone["destination"][0],"y":drone["destination"][1]}  
    return(formatedDrone)


#Convert a list of drone to the right format in order to send it to the client
def formatDroneList(listDrone):
    formatedListDrone = []
    for drone in listDrone:
        formatedListDrone.append(formatDrone(drone))
    return formatedListDrone


#Convert from status to Json
#input = (owner : int, drones: drone[], blockeZones: zone[], time : int)
#return = message : str
#TODO bien formater l'envoi de la liste de drone et des zones
def statusToJson(owner, drones, blockedZones, time):
    try:
        formatedDrones = formatDroneList(drones)
        formatedZones = formatBlockedZones(blockedZones)
        x={
            "code":200,
            "data":{
                "owner":{"ID":owner},
                "drones": formatedDrones,
                "blocked_Zones":formatedZones,
                "time":time
            }
        }
        return json.dumps(x)
    except:
        print("Erreur lors du formatage du drone")
        return None


#Convert from drone to Json
#input = drone : Drone
#return = message : str
def droneToJson(drone):
    try:
        x={
            "code":200,
            "data":formatDrone(drone)
        }
        return json.dumps(x)
    except:
        print("Erreur lors du formatage du drone")
        return None

#Convert from Json to type the message
#input = str
#return = str (type of the message) or raise MessageTypeError if error
def jsonToType(message):
    try:
        y=json.loads(message)
        print(y)
        return(y["type"])
    except:
        raise MessageTypeError()


#Convert from JSON to Drone
#input = message : str
#return = ID:int, name:str, owner:int,
#   priority:int, start:list[x,y], destination:list[x,y]
def jsonToDrone(message):
    droneReceived = {}
    y=json.loads(message)
    drone=y["data"]
    droneReceived["id"]=drone["ID"]
    droneReceived["name"]=drone["name"]
    droneReceived["owner"]=drone["owner"]["ID"]
    droneReceived["priority"]=drone["priority"]
    droneReceived["path"]=[]
    droneReceived["start"]=[drone["start"]["x"],drone["start"]["y"]]
    droneReceived["destination"]=[drone["destination"]["x"],drone["destination"]["y"]]
    return droneReceived


#Convert from Json to Owner
#input = message : str
#return = owner : int
def jsonToOwner(message) -> int:
    y=json.loads(message)
    if(type(y["owner"]["ID"])==int):
        return(y["owner"])
    else:
        raise MessageTypeError


#Convert from Json to Squares
#input = message : str
#return = square : list[points]
def jsonToZone(message):
    y=json.loads(message)
    zone = y["data"]
    if(len(zone["square"]["points"])==4):
        return zone["square"]["points"]
    else:
        raise MessageTypeError


#def jsonToNewPathResponse(): #TODO A implémenter (voir avec Killian et Joel)


########## TEST ECRITURE ######################
# fichier = open("testEcriture.json","w",encoding="utf-8")
# json.dump(statusToJson(3,5,6,7),fichier,ensure_ascii=False,indent=4)
# fichier.close()
# ########## TEST LECTURE #######################
# fichier = open("testEcriture.json","r")
# contenu = fichier.read()
# print(f"Fichier json de base : {contenu}")
# test=jsonToOwner(contenu)
# print(f"Owner obtenu depuis le fichier {test}")
# fichier.close()
# print(jsonToZone("{\"squares\":[]}"))