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
    servURL = "ws://localhost:80"
    ws = websocket.create_connection(servURL) ## Connexion au serveur ##
    event = threading.Event() ## Event pour notify de la réception ##
    th_receiv = threading.Thread(target=receiving, args=(ws,event),daemon=True) ## Création du thread réception ##
    th_receiv.start()
    d={"type":"connect","data":{"owner":"1"}}
    ws.send(json.dumps(d))
    event.wait()
    dic = {"type":"new_drone","data":{"name":"test","owner":{"ID":"1"},"priority":1,"start":{"x":10,"y":20},"destination":{"x":10,"y":80}}}
    ws.send(json.dumps(dic))
    #time.sleep(20)
    #dic={"type":"delete_drone","data":{"name":"test","owner":{"ID":"1"},"priority":1,"start":{"x":10,"y":20},"destination":{"x":10,"y":30}}}
    #ws.send(json.dumps(dic))
    while True:
        event.wait()
    ws.close()


main()