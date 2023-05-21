import threading

map_connect_droneList = {} ## {connect : (owner, drone[])} ##
map_owner_idDrone = {} ## {(owner,name):id_drone} ##
map_idDrone_path = {} ## {id_drone : path_drone} ##
blocked_zones = [] ## [blocked_zone[]]
map_changed_path = {} ## {owner: nameDroneChanged[]}
sem = threading.Semaphore()
connect = [] #List of all clients connected