import json


#Error raised when we can't decode the type of the message
class MessageTypeError(Exception):
    pass

class ConnectionError(Exception):
    pass

#Create an error message to send to the client
def errorMessage(type):
    x={
        "type":type,
        "code":401
    }
    return json.dumps(x)


#Create an ack message to send to the client
def ackMessage(type):
    x={
        "type":type,
        "code":200
    }
    return json.dumps(x)

#Convert a Zone to the right format in order to send it to the client
def formatBlockedZones(zones):
    formatedZones = []
    for square in zones:
        formatedZones.append({"points":square})
    return formatedZones

#Convert a Path to the right format in order to send it to the client
def formatPath(path):
    pathFormated = []
    for point in path:
        pathFormated.append({"x":int(point[0]),"y":int(point[1])})
    return pathFormated

#Convert a drone to the right format in order to send it to the client
def formatDrone(drone):
    formatedDrone={}
    formatedDrone["name"] = drone["name"]
    formatedDrone["owner"] = {"ID" : drone["owner"]["ID"]}
    formatedDrone["priority"] = drone["priority"]
    formatedDrone["path"] = formatPath(drone["path"])
    formatedDrone["start"] = drone["start"]
    formatedDrone["destination"] = drone["destination"]
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
def statusToJson(owner, drones, blockedZones, time, changedNameList):
    # try:
        formatedDrones = formatDroneList(drones)
        formatedZones = formatBlockedZones(blockedZones)
        x={
            "code":200,
            "type":"get_status",
            "data":{
                "owner":{"ID":owner},
                "drones": formatedDrones,
                "blocked_Zones":formatedZones,
                "time":time,
                "changed" : changedNameList
            }
        }
        return json.dumps(x)
    # except:
    #     print("Erreur lors du formatage du drone")
    #     return None

def jsonToDrone(message):
    try:
        y = json.loads(message)
        return y["data"]
    except:
        raise MessageTypeError

#Convert from drone to Json
#input = drone : Drone
#return = message : str
def droneToJson(drone):
    # try:
        x={
            "code":200,
            "type":"new_drone",
            "data":formatDrone(drone)
        }
        return json.dumps(x)
    # except:
    #     print("Erreur lors du formatage du drone")
    #     return None

#Convert from Json to type the message
#input = str
#return = str (type of the message) or raise MessageTypeError if error
def jsonToType(message):
    try:
        y=json.loads(message)
        #print(y)
        return(y["type"])
    except:
        raise MessageTypeError()


#Convert from JSON to Drone to be implemented by the Dijkstra
#input = message : str
#return = ID:int, name:str, owner:int,
#   priority:int, start:list[x,y], destination:list[x,y]
def jsonToDroneDijkstra(message):
    y=json.loads(message)
    drone=y["data"]
    #id=drone["ID"]
    owner=drone["owner"]["ID"]
    priority=drone["priority"]
    start=[drone["start"]["x"],drone["start"]["y"]]
    destination=[drone["destination"]["x"],drone["destination"]["y"]]
    return owner, priority, start, destination

#Convert from Json to Owner
#input = message : str
#return = owner : int
def jsonToOwner(message) -> str:
    y=json.loads(message)
    if(type(y["data"]["owner"]["ID"])== str):
        return y["data"]["owner"]["ID"]
    else:
        raise ConnectionError

#Convert from Json to Squares
#input = message : str
#return = square : list[points]
def jsonToZone(message):
    y=json.loads(message)
    data = y["data"]
    zone = data["square"]["points"]
    if(len(zone)==4):
        return zone
    else:
        raise MessageTypeError
    
# Format a zone to be implemented by the Dijkstra
# input = message : str
# return = list[[x,y]]
def formatZoneDijkstra(zone):
    formatedZone = []
    for point in zone:
        formatedZone.append([point["x"],point["y"]])
    return formatedZone


def jsonToNewPathResponse(message): 
    y = json.load(message)
    return y["data"]["response"],y["data"]["drone"]

## Problème : [115,421],[197,421],[204,365],[124,361]



