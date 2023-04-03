import json


#Prend en input un json parsé et renvoie un Drone


def statusToJson(owner : int, drones, blockedZones, time : int):
    x={
        "owner":owner,
        "drones":drones,
        "blocked_Zones":blockedZones,
        "time":time
    }
    return x

def jsonToOwner(message) -> int:
    y=json.loads(message)
    return(int(y["owner"]))

########## TEST ECRITURE ######################
fichier = open("testEcriture.json","w",encoding="utf-8")
json.dump(statusToJson(3,5,6,7),fichier,ensure_ascii=False,indent=4)
fichier.close()
########## TEST LECTURE #######################
fichier = open("testEcriture.json","r")
contenu = fichier.read()
print(f"Fichier json de base : {contenu}")
test=jsonToOwner(contenu)
print(f"Owner obtenu depuis le fichier {test}")
fichier.close()

# def jsonToZone(message):
#     y=json.loads(message)
#     return
