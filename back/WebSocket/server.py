import asyncio
import websockets 
import convertionJson

connect = [] #List of all clients connected
period = 2 #Time in seconds to send periodic message


#Handler executed at every new connection
async def handler(websocket,path):
    connect.append(websocket) #Add the new connection to the list of all connections  
    print("Je suis dans le handler")
    try:
        async for message in websocket: #Handle every message from the connection
            print("Message reçu !")
            match convertionJson.jsonToType(message): #Identifies the type of the message if not, raise MessageTypeError
                case "answer_path":
                    pass
                    await sendUnicast("I have received answer_path",websocket)
                    print("answer_path")
                case "delete_zone":
                    pass
                    await sendUnicast(convertionJson.ackMessage(),websocket)
                    print("delete_zone")
                case "block_zone":
                    pass
                    await sendUnicast("I have received block_zone",websocket)
                    print("block_zone")
                case "new_drone":
                    id,name,owner,priority,start,destination = convertionJson.jsonToDrone(message)
                    print(f"new_drone with id:{id}, owner:{owner}, name:{name},")
                    print(f"priority:{priority},start:{start},destination:{destination}")
                    await sendUnicast(convertionJson.ackMessage(),websocket)
                case "delete_drone":
                    pass
                    await sendUnicast("I have received delete_drone",websocket)
                    print("delete_drone")
                case "get_status":
                    pass
                    await sendUnicast("I have received get_status",websocket)
                    print("get_status")
                case _:
                    raise convertionJson.MessageTypeError
    except websockets.exceptions.ConnectionClosed as e: #Connection closed 
        print("Session closed") 
        connect.remove(websocket) #Delete the connection from the list
    except convertionJson.MessageTypeError:
        print("Erreur sur le type du message reçu")
        await sendUnicast(convertionJson.errorMessage(),websocket) #Send an error message to the client


#Send a message to an unique client 
async def sendUnicast(message, websocket):
    print("Envoi Unicast")
    try:
        await websocket.send(message)
    except websockets.exception.ConnectionClosed:
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
async def main():
    async with websockets.serve(handler, "", 80):
        #envoiPeriodique = asyncio.create_task(sendPeriodically("Status")) #TODO Faire en sorte qu'on envoi le statu
        while True:
        #     #await sendAllClients("Multicast")
        #     #if len(connect)>0:
        #         #await sendUnicast("Unicast",connect[0])
            await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())