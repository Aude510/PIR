import websocket
import threading
import json
import time


########## THREAD DE RECEPTION ############
def receiving(websocket,receive):
    while(1):
        message = websocket.recv()
        print(message)
        receive.set()
   


def main():
    servURL = "ws://localhost:8080"
    ws = websocket.create_connection(servURL) ## Connexion au serveur ##
    event = threading.Event() ## Event pour notify de la réception ##
    th_receiv = threading.Thread(target=receiving, args=(ws,event),daemon=True) ## Création du thread réception ##
    th_receiv.start()
    d={"type":"connect","data":{"owner":"2"}}
    ws.send(json.dumps(d))
    event.wait()
    time.sleep(20)
    dic = {"type":"block_zone","data":{"square":{"points":[{"x":0,"y":70},{"x":0,"y":60},{"x":200,"y":60},{"x":200,"y":70}]}}}
    ws.send(json.dumps(dic))
    time.sleep(20)
    dic={"type":"delete_zone","data":{"square":{"points":[{"x":0,"y":70},{"x":0,"y":60},{"x":200,"y":60},{"x":200,"y":70}]}}}
    ws.send(json.dumps(dic))
    while True:
        event.wait()
    ws.close()


main()