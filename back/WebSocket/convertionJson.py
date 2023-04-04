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


#Convert from status to Json
#input = (owner : int, drones: drone[], blockeZones: zone[], time : int)
#return = message : str
#TODO bien formater l'envoi de la liste de drone et des zones
def statusToJson(owner, drones, blockedZones, time):
    x={
        "code":200,
        "data":{
            "owner":{"ID":owner},
            "drones":drones,
            "blocked_Zones":blockedZones,
            "time":time
        }
    }
    return json.dumps(x)

#Convert from drone to Json
#input = (id : int, name : str, owner : int, priority : int
#   path : list of points([[x,y]]), start : point([x,y])
#   destination : point([x,y]))
#return = message : str
def droneToJson(id, name, owner, priority, path, start, destination):
    auxPath=[]
    for point in path:
        auxPath.append({"x":point[0],"y":point[1]})
    x={
        "code":200,
        "data":{
            "ID":id,
            "name":name,
            "owner":{"ID":owner},
            "priority":priority,
            "path":{"points":auxPath},
            "start":{"x":start[0],"y":start[1]},
            "destination":{"x":destination[0],"y":destination[1]}
        }
    }
    return json.dumps(x)

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
    y=json.loads(message)
    drone=y["data"]
    id=drone["ID"]
    name=drone["name"]
    owner=drone["owner"]["ID"]
    priority=drone["priority"]
    start=[drone["start"]["x"],drone["start"]["y"]]
    destination=[drone["destination"]["x"],drone["destination"]["y"]]
    return id,name,owner,priority,start,destination


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