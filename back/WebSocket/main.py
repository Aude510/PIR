import asyncio
import server
import threading
import convertionJson
from structure import *
import trajectory
from sys import _getframe

period = 5 ## Period to send status ##
nextIdDrone=0
freeId = []

def add_connect(websocket,owner):
    found = False
    for key in map_connect_droneList:
        ownerID = map_connect_droneList[key][0]
        if (owner == ownerID):
            found = True
    if found:
        map_connect_droneList[websocket] = (owner,map_connect_droneList[key][1])
        del map_connect_droneList[key]
        connect.remove(key)
    else:
        map_connect_droneList[websocket]=(owner,[])
        map_changed_path[owner] = []
    #print(map_connect_droneList)

def startServ():
    asyncio.run(server.init_serv())

def addBlockedZone(zone):
    if zone in blocked_zones:
        return False
    else:
        blocked_zones.append(zone)
        return True
    

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
    for drone_list in droneList:
        if drone_list["name"] == drone["name"]:
            return -1
    droneList.append(drone)
    idDrone = newIdDrone()
    map_owner_idDrone[((owner,drone["name"]))] = idDrone
    return idDrone
    
def droneInBlockedZone(zone):
    x0 = min(zone[0][0],zone[2][0])
    x1 = max(zone[0][0],zone[2][0])
    y0 = min(zone[0][1],zone[2][1])
    y1 = max(zone[0][1],zone[2][1])
    for user in connect:
        list_drone = map_connect_droneList[user][1]
        owner = map_connect_droneList[user][0]
        for drone in list_drone:
            if (x0< drone["destination"]["x"] < x1) and (y0< drone["destination"]["y"] < y1):
                name = drone["name"]
                idDrone = map_owner_idDrone[(owner,name)]
                map_idDrone_path[idDrone] = [convertionJson.jsonToPoint(drone["destination"]) ,convertionJson.jsonToPoint(drone["start"]) ]
                aux = drone["destination"]
                drone["destination"] = drone["start"]
                drone["start"] = aux
    
def changePath(paths,addedDrone):
    for identifier in paths:
        map_idDrone_path[identifier] = paths[identifier]
        if(identifier != addedDrone):
            for owner,name  in map_owner_idDrone:
                if(map_owner_idDrone[(owner,name)]==identifier):
                    map_changed_path[owner].append(name)
                    break
            

def detectChangedPath(paths):
    for identifier in paths:
        if(paths[identifier] != map_idDrone_path[identifier]):
            map_idDrone_path[identifier] = paths[identifier]
            for owner,name  in map_owner_idDrone:
                if(map_owner_idDrone[(owner,name)]==identifier):
                    map_changed_path[owner].append(name)
                    break




def deleteConnection(websocket,env : trajectory.Environment):
    owner = map_connect_droneList[websocket][0]
    droneList = map_connect_droneList[websocket][1]
    for drone in droneList:
        name = drone["name"]
        identifier = map_owner_idDrone[(owner,name)]
        env.deleteDrone(identifier)
        deleteDrone(websocket,drone)
    del map_connect_droneList[websocket]
    print("suppresion finished")

def deleteDrone(websocket,drone):
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
        blocked_zones.remove(zone)
    except ValueError:
        raise convertionJson.MessageTypeError()


async def sendStatus():
    for client in connect:
        ownerID = map_connect_droneList[client][0]
        droneList = map_connect_droneList[client][1]
        await server.sendUnicast(convertionJson.statusToJson(ownerID,droneList,blocked_zones,0,map_changed_path[ownerID]),client)
        map_changed_path[ownerID]=[]

async def running():
    while(True):
        sem.acquire()
        if(len(map_idDrone_path)>0):
            for client in connect:
                ## Mettre un if pour voir s'il y a un ownerID ##
                ownerID = map_connect_droneList[client][0]
                liste_drone = map_connect_droneList[client][1]
                for drone in liste_drone:
                    name = drone["name"]
                    id_drone = map_owner_idDrone[(ownerID,name)]
                    if(len(map_idDrone_path[id_drone])>1):
                        drone["path"]=map_idDrone_path[id_drone]
                        map_idDrone_path[id_drone]=map_idDrone_path[id_drone][1:]
                    else:
                        del map_idDrone_path[id_drone]
                        delIdDrone(id_drone)
                        del map_owner_idDrone[((ownerID,name))]
                        liste_drone.remove(drone)
        await sendStatus()
        sem.release()
        await asyncio.sleep(period)



if __name__ == "__main__":
    t = threading.Thread(target=startServ)
    t.start()
    asyncio.run(running())