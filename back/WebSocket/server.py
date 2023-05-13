import asyncio
import websockets ##pip install websockets
import convertionJson
import main
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
        message = await websocket.recv()
        print(message)
        if(convertionJson.jsonToType(message)=="connect"):
            sem.acquire()
            #id = newIdConnect()
            connect.append(websocket)
            #map_connect[id] = websocket
            main.add_connect(websocket,convertionJson.jsonToOwner(message))
            sem.release()
        else:
            raise convertionJson.ConnectionError
        async for message in websocket: #Handle every message from the connection
            print(message)
            match convertionJson.jsonToType(message): #Identifies the type of the message if not, raise MessageTypeError
                case "answer_path":
                    sem.acquire()
                    answer, drone = convertionJson.jsonToNewPathResponse(message)
                    if(not(answer)):
                        identifier = await main.deleteDrone(websocket,drone)
                        environnement.deleteDrone(identifier)
                    await sendUnicast(convertionJson.ackMessage("answer_path"),websocket)
                    sem.release()
                case "delete_zone":
                    sem.acquire()
                    zone = convertionJson.jsonToZone(message)
                    await main.deleteBlockedZone(zone)
                    environnement.deleteBlockedZone(convertionJson.formatZoneDijkstra(zone))
                    ## TODO : exécuter fonction de Kiki pour delete zone
                    await sendUnicast(convertionJson.ackMessage("delete_zone"),websocket)
                    sem.release()
                case "block_zone":
                    sem.acquire()
                    zone = convertionJson.jsonToZone(message)
                    main.addBlockedZone(zone)
                    environnement.updateDrone(map_idDrone_path)
                    paths = environnement.blockAZone(convertionJson.formatZoneDijkstra(zone))
                    #print("map_idDrone_path : "+ str(map_idDrone_path))
                    #print("paths : " + str(paths))
                    main.detectChangedPath(paths)
                    ## TODO : exécuter la fonction de Kiki pour add zone
                    await sendUnicast(convertionJson.ackMessage("block_zone"),websocket)
                    sem.release()
                case "new_drone":
                    sem.acquire()
                    owner, priority, start, destination = convertionJson.jsonToDroneDijkstra(message)
                    drone = convertionJson.jsonToDrone(message)
                    idDrone = main.addDrone(websocket,drone)
                    #print("New drone with id : " + str(idDrone))
                    environnement.updateDrone(map_idDrone_path)
                    paths = environnement.addDrone(idDrone,priority,start,destination)
                    main.changePath(paths,idDrone)
                    await sendUnicast(convertionJson.ackMessage("new_drone"),websocket)
                    sem.release()
                case "delete_drone":
                    sem.acquire()
                    drone = convertionJson.jsonToDrone(message)
                    identifier = main.deleteDrone(websocket,drone) ## Suppression drone du status
                    environnement.deleteDrone(identifier) ## Suppresion drone de l'environnement
                    await sendUnicast(convertionJson.ackMessage("delete_drone"),websocket)
                    sem.release()
                case "get_status":
                    sem.acquire()
                    await main.sendStatus
                    sem.release()
                case _:
                    raise convertionJson.MessageTypeError
    except websockets.exceptions.ConnectionClosed as e: #Connection closed 
        sem.acquire()
        try:
            print("Session closed") 
            connect.remove(websocket) #Delete the connection from the list
            main.deleteConnection(websocket,environnement)
        except:
            print("Erreur sur le message de connect")
            await sendUnicast(convertionJson.errorMessage("connect"),websocket)
        finally:
            sem.release()
    except convertionJson.MessageTypeError:
        sem.acquire()
        print("Erreur sur le type du message reçu")
        await sendUnicast(convertionJson.errorMessage("test"),websocket) #Send an error message to the client
        connect.remove(websocket)
        main.deleteConnection(websocket,environnement)
        sem.release()
    except convertionJson.ConnectionError:
        sem.acquire()
        print("Erreur sur le message de connect")
        sendUnicast(convertionJson.errorMessage("connect"),websocket)
        sem.release()

#Send a message to an unique client 
async def sendUnicast(message, websocket):
    print("Envoi Unicast")
    try:
        await websocket.send(message)
    except websockets.exceptions.ConnectionClosed:
        sem.acquire()
        main.deleteConnection(websocket,environnement)
        print("Impossible to send connection was closed")
        sem.release()


#Créer le serveur websocket et envoi périodiquement à tous les clients le statu
async def init_serv():
    async with websockets.serve(handler, "", 8080):
        #envoiPeriodique = asyncio.create_task(sendPeriodically("Status")) #TODO Faire en sorte qu'on envoi le statu
        while True:
        #     #await sendAllClients("Multicast")
        #     #if len(connect)>0:
        #         #await sendUnicast("Unicast",connect[0])
            await asyncio.sleep(period)


##TODO: faire un main qui init l'environnement
## Dans le handle faire appel de fonction 
## stocker 