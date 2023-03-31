import asyncio
import websockets


async def hello():
    print("Je suis dans le hello")
    async with websockets.connect("ws://localhost:8765") as websocket:
        print(type(websocket))
        await websocket.send("Hello world!")
        print("message envoyé")
        await websocket.recv()


async def receive(websocket):
    print(type(websocket))
    message = await websocket.recv()
    print("Serveur just sent me this message : " + message)
    

async def main():
    await hello()
    websocket = "test"
    connection = websockets.create_connection("ws://localhost:8765")
    event_loop = asyncio.new_event_loop()
    await receive(websocket)
    

asyncio.run(main())