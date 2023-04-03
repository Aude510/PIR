import asyncio
import websockets 


connect = []



async def handler(websocket,path):
    connect.append(websocket)
    print(path)
    print("Je suis dans le handler")
    try:
        async for messages in websocket:
            match path[1:]:
                case "delete_zone":
                    await sendUnicast("Tu es dans le delete_zone",websocket)
                case "new_drone":
                    await sendUnicast("Tu es dans le new_drone",websocket)
                case "delete_drone":
                    await sendUnicast("Tu es dans le delete_drone",websocket)
                case "block_zone":
                    await sendUnicast("Tu es dans le block_zone",websocket)
                case "get_status":
                    await sendUnicast("Tu es dans le get_status",websocket)
                case "answer_new_path":
                    await sendUnicast("Tu es dans le answer_new_path",websocket)
                case _:
                    await sendUnicast(f"Tu es dans le {path[1:]}, tu es perdu",websocket)
    except websockets.exceptions.ConnectionClosed as e:  
        print("Session closed") 
        connect.remove(websocket)


async def sendUnicast(message, websocket):
    print("Envoi Unicast")
    try:
        await websocket.send(message)
    except websockets.exception.ConnectionClosed:
        print("Impossible to send connection was closed")

async def sendAllClients(message):
    print("Envoi à tous les clients")
    for websocket in connect:
        try:
            await websocket.send(message)
        except websockets.exception.ConnectionClosed:
            print("Connection closed")

async def sendPeriodically(message):
    while True:
        print("Envoi périodique")
        for websocket in connect:
            try:
                await websocket.send(message)
            except websockets.exception.ConnectionClosed:
                print(f"Session Closed  in {__name__}")
        await asyncio.sleep(2)
        

async def main():
    async with websockets.serve(handler, "", 80):
        #envoiPeriodique = asyncio.create_task(sendPeriodically("Salut !"))
        while True:
            #await sendAllClients("Multicast")
            #if len(connect)>0:
                #await sendUnicast("Unicast",connect[0])
            await asyncio.sleep(2)

asyncio.run(main())