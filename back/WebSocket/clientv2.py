import websocket
import threading


########## THREAD DE RECEPTION ############
def receiving(websocket,receive):
    while(1):
        message = websocket.recv()
        print(message)
        receive.set()
   


def main():
    servURL = "ws://localhost/ouibonjour"
    port = 8765
    ws = websocket.create_connection(servURL + ":" + str(port)) ## Connexion au serveur ##
    event = threading.Event() ## Event pour notify de la réception ##
    th_receiv = threading.Thread(target=receiving, args=(ws,event),daemon=True) ## Création du thread réception ##
    th_receiv.start()
    ws.send("Hello World")
    while True:
        event.wait()
    ws.close()


main()