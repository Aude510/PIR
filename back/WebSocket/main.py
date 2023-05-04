import asyncio
import server
import threading
import convertionJson
from structure import *

period = 5 ## Period to send status ##
sem = threading.Semaphore()
nextIdDrone=0
freeId = []

def add_connect(websocket,owner):
    map_connect_droneList[websocket]=(owner,[])
    print(map_connect_droneList)

def startServ():
    asyncio.run(server.init_serv())

def addBlockedZone(zone):
    sem.acquire()
    blocked_zones.append(zone)
    sem.release()

def newIdDrone():
    if(len(freeId)>0):
        return freeId.pop()
    else:
        global nextIdDrone
        nextIdDrone+=1
        return nextIdDrone

def delIdDrone(id):
    freeId.append(id)

def addDrone(websocket,drone):
    owner = map_connect_droneList[websocket][0]
    droneList = map_connect_droneList[websocket][1]
    droneList.append(drone)
    idDrone = newIdDrone()
    map_owner_idDrone[((owner,drone["name"]))] = idDrone
    return idDrone
    
def changePath(paths):
    for identifier in paths:
        map_idDrone_path[identifier] = paths[identifier]
        drone = getKeyFromDic(map_owner_idDrone,identifier)
        owner=drone[0]
        name=drone[1]
        map_changed_path[owner].append(name)
    
def getKeyFromDic(map :dict, value):
    auxKey = list(map.keys())
    auxValue = list(map.values())
    return auxKey[auxValue.index(value)]

def detectChangedPath(paths):
    for identifier in paths:
        if(paths[identifier] != map_idDrone_path[identifier]):
            map_idDrone_path[identifier] = paths[identifier]
            drone = getKeyFromDic(map_owner_idDrone,identifier)
            owner=drone[0]
            name=drone[1]
            map_changed_path[owner].append(name)



async def deleteConnection(websocket):
    sem.acquire()
    owner = map_connect_droneList[websocket][0]
    droneList = map_connect_droneList[websocket][1]
    for drone in droneList:
        name = drone["name"]
        del map_idDrone_path[map_owner_idDrone[(owner,name)]]
        del map_owner_idDrone[(owner,name)]
    del map_connect_droneList[websocket]
    print("suppresion finished")
    print(map_connect_droneList)
    sem.release()

async def deleteDrone(websocket,drone):
    owner = map_connect_droneList[websocket][0]
    droneList = map_connect_droneList[websocket][1]
    name = drone["name"]
    idDrone = map_owner_idDrone[(owner,name)]
    del map_idDrone_path[idDrone]
    delIdDrone(idDrone)
    del map_owner_idDrone[((owner,name))]
    for d in droneList:
        if d["name"]==name: 
            droneList.remove(d)
    return idDrone

async def deleteBlockedZone(zone):
    try:
        sem.acquire()
        blocked_zones.remove(zone)
        sem.release
    except ValueError:
        raise convertionJson.MessageTypeError()

async def running():
    while(True):
        sem.acquire()
        if(len(map_idDrone_path)>0):
            for client in server.connect:
                ## Mettre un if pour voir s'il y a un ownerID ##
                ownerID = map_connect_droneList[client][0]
                liste_drone = map_connect_droneList[client][1]
                for drone in liste_drone:
                    name = drone["name"]
                    id_drone = map_owner_idDrone[(ownerID,name)]
                    if(len(map_idDrone_path[id_drone])>1):
                        map_idDrone_path[id_drone]=map_idDrone_path[id_drone][1:]
                        drone["path"]=map_idDrone_path[id_drone]
                    else:
                        del map_idDrone_path[id_drone]
                        delIdDrone(id_drone)
                        del map_owner_idDrone[((ownerID,name))]
                        liste_drone.remove(drone)
        for client in server.connect:
            ownerID = map_connect_droneList[client][0]
            droneList = map_connect_droneList[client][1]
            await server.sendUnicast(convertionJson.statusToJson(ownerID,droneList,blocked_zones,0,map_changed_path[ownerID]),client)
            map_changed_path[ownerID]=[]
        sem.release()
        await asyncio.sleep(period)



if __name__ == "__main__":
    t = threading.Thread(target=startServ)
    t.start()
    print("Hello")
    asyncio.run(running())