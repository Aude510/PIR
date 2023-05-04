import asyncio
import websockets 
import convertionJson
import main
from main import sem
from structure import *
import trajectory

environnement = trajectory.Environment(500,500)
connect = [] #List of all clients connected
period = 3

#Handler executed at every new connection
async def handler(websocket,path):
    ## connect.append(websocket) #Add the new connection to the list of all connections  
    ## TODO : bouger le append du connect au moment où je recevrais le message connexion
    print("Je suis dans le handler")
    try:
        id = 0
        message = await websocket.recv()
        if(convertionJson.jsonToType(message)=="connect"):
            sem.acquire()
            #id = newIdConnect()
            connect.append(websocket)
            #map_connect[id] = websocket
            map_connect_droneList[websocket]=(convertionJson.jsonToOwner(message),[])
            print(map_connect_droneList)
            sem.release()
        else:
            raise convertionJson.ConnectionError
        async for message in websocket: #Handle every message from the connection
            match convertionJson.jsonToType(message): #Identifies the type of the message if not, raise MessageTypeError
                case "answer_path":
                    answer, drone = convertionJson.jsonToNewPathResponse(message)
                    if(not(answer)):
                        identifier = await main.deleteDrone(websocket,drone)
                        environnement.deleteDrone(identifier)
                    await sendUnicast(convertionJson.ackMessage("answer_path"),websocket)
                case "delete_zone":
                    zone = convertionJson.jsonToZone(message)
                    await main.deleteBlockedZone(zone)
                    environnement.deleteBlockedZone(zone)
                    ## TODO : exécuter fonction de Kiki pour delete zone
                    await sendUnicast(convertionJson.ackMessage("delete_zone"),websocket)
                case "block_zone":
                    zone = convertionJson.jsonToZone(message)
                    main.addBlockedZone(zone)
                    paths = environnement.blockAZone(zone)
                    main.detectChangedPath(paths)
                    ## TODO : exécuter la fonction de Kiki pour add zone
                    await sendUnicast(convertionJson.ackMessage("block_zone"),websocket)
                case "new_drone":
                    sem.acquire()
                    name, owner, priority, start, destination = convertionJson.jsonToDroneDijkstra(message)
                    drone = convertionJson.jsonToDrone(message)
                    idDrone = main.addDrone(websocket,drone,path)
                    paths = environnement.addDrone(idDrone,priority,start,destination)
                    main.changePath(paths)
                    await sendUnicast(convertionJson.ackMessage("new_drone"),websocket)
                    sem.release()
                case "delete_drone":
                    sem.acquire()
                    drone = convertionJson.jsonToDrone(message)
                    identifier = await main.deleteDrone(websocket,drone) ## Suppression drone du status
                    environnement.deleteDrone(identifier) ## Suppresion drone de l'environnement
                    await sendUnicast(convertionJson.ackMessage("delete_drone"),websocket)
                    sem.release()
                case "get_status":
                    sem.acquire()
                    owner = map_connect_droneList[websocket][0]
                    droneList = map_connect_droneList[websocket][1]
                    await sendUnicast(convertionJson.statusToJson(owner,droneList,blocked_zones,0),websocket)
                    sem.release()
                case _:
                    raise convertionJson.MessageTypeError
    except websockets.exceptions.ConnectionClosed as e: #Connection closed 
        print("Session closed") 
        connect.remove(websocket) #Delete the connection from the list
        await main.deleteConnection(websocket)
    except convertionJson.MessageTypeError:
        print("Erreur sur le type du message reçu")
        await sendUnicast(convertionJson.errorMessage("test"),websocket) #Send an error message to the client
        connect.remove(websocket)
        await main.deleteConnection(websocket)
    except convertionJson.ConnectionError:
        print("Erreur sur le message de connect")
        sendUnicast(convertionJson.errorMessage("connect"),websocket)

#Send a message to an unique client 
async def sendUnicast(message, websocket):
    print("Envoi Unicast")
    try:
        await websocket.send(message)
    except websockets.exceptions.ConnectionClosed:
        print("Impossible to send connection was closed")

#Send a message to all clients
async def sendAllClients(message):
    print("Envoi à tous les clients")
    for websocket in connect:
        try:
            await websocket.send(message)
        except websockets.exception.ConnectionClosed:
            print("Connection closed")

#Send periodically to all clients
async def sendPeriodically(message):
    while True:
        print("Envoi périodique")
        for websocket in connect:
            try:
                await websocket.send(message)
            except websockets.exception.ConnectionClosed:
                print(f"Session Closed  in {__name__}")
        await asyncio.sleep(period)
        

#Créer le serveur websocket et envoi périodiquement à tous les clients le statu
async def init_serv():
    async with websockets.serve(handler, "", 80):
        #envoiPeriodique = asyncio.create_task(sendPeriodically("Status")) #TODO Faire en sorte qu'on envoi le statu
        while True:
        #     #await sendAllClients("Multicast")
        #     #if len(connect)>0:
        #         #await sendUnicast("Unicast",connect[0])
            await asyncio.sleep(period)


##TODO: faire un main qui init l'environnement
## Dans le handle faire appel de fonction 
## stocker 