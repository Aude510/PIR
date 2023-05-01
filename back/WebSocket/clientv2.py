import websocket
import threading
import json


########## THREAD DE RECEPTION ############
def receiving(websocket,receive):
    while(1):
        message = websocket.recv()
        print(message)
        receive.set()
   


def main():
    servURL = "ws://localhost:80"
    ws = websocket.create_connection(servURL) ## Connexion au serveur ##
    event = threading.Event() ## Event pour notify de la réception ##
    th_receiv = threading.Thread(target=receiving, args=(ws,event),daemon=True) ## Création du thread réception ##
    th_receiv.start()
    d={"type":"connect","data":{"owner":"1"}}
    ws.send(json.dumps(d))
    while True:
        event.wait()
    ws.close()


main()