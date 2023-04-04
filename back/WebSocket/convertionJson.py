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

#Convert from Json to type the message
#input = str
#return = str (type of the message) or raise MessageTypeError if error
def jsonToType(message):
    try:
        y=json.loads(message)
        return(y["type"])
    except:
        raise MessageTypeError()

#Convert from status to Json
#input = (owner : int, drones: drone[], blockeZones: zone[], time : int)
#return = message : str
def statusToJson(owner, drones, blockedZones, time):
    x={
        "owner":owner,
        "drones":drones,
        "blocked_Zones":blockedZones,
        "time":time,
        "code":200
    }
    return json.dumps(x,indent=4)

#Convert from JSON to Drone
#input = message : str
#return = ID:int, name:str, owner:int,
#   priority:int, start:point, destination:point
def jsonToDrone(message):
    y=json.loads(message)
    id=int(y["ID"])
    name=y["name"]
    owner=int(y["owner"])
    priority=int(y["priority"])
    start=y["start"]
    destination=y["destination"]
    return id,name,owner,priority,start,destination

#Convert from Json to Owner
#input = message : str
#return = owner : int
def jsonToOwner(message) -> int:
    y=json.loads(message)
    return(int(y["owner"]))

#Convert from Json to Squares
#input = message : str
#return = square : square 
def jsonToZone(message):
    y=json.loads(message)
    return y["square"]

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