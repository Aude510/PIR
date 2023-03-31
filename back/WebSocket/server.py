import asyncio
import websockets 

connect = []



async def handler(websocket,path):
    connect.append(websocket)
    print(path)
    print("Je suis dans le handler")
    try:
        async for messages in websocket:
            await websocket.send("Hello your message is : " + messages)
            print("The message received is " + messages)
    except websockets.exceptions.ConnectionClosed as e:  
        print("Session closed") 
        connect.remove(websocket)


async def sendUnicast(message : str, websocket):
    print("Envoi Unicast")
    try:
        await websocket.send(message)
    except websockets.exception.ConnectionClosed:
        print("Impossible to send connection was closed")

async def sendAllClients(message : str):
    print("Envoi à tous les clients")
    for websocket in connect:
        try:
            await websocket.send(message)
        except websockets.exception.ConnectionClosed:
            print("Connection closed")

async def main():
    await websockets.serve(handler, "localhost", 8765)
    await websockets.serve(handler, "localhost/ouibonjour", 8765)
    while True:
        await sendAllClients("Multicast")
        if len(connect)>0:
            await sendUnicast("Unicast",connect[0])
        await asyncio.sleep(2)


asyncio.run(main())