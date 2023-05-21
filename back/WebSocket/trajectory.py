# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
import random

import numpy as np
import dijkstra3d  # To install : pip install dijkstra3d
import matplotlib.pyplot as plt


class Environment:
    z = 10
    listDrones = list()
    listBlockedPoints = list()

    def __init__(self, x, y):
        self.listDrones = list()
        self.listBlockedPoints = list()
        self.x = x
        self.y = y
        self.z = 10
        self.   environment = np.ones(shape=(x, y, self.z))
        for i in range(0, x):
            for j in range(0, y):
                for k in range(0, self.z):
                    self.environment[i, j, k] = k + 1

        self.fig = plt.figure()
        self.ax = self.fig.add_subplot(111, projection='3d')

    def addDrone(self, identifier, priority, source, destination, startingTime=0, isANewDrone=True, addToPlot=False):
        isOk = 0
        pathToGoRet = dict()

        source = (source[0], source[1], startingTime)
        destination = (destination[0], destination[1], startingTime)

        pathToGo = dijkstra3d.dijkstra(self.environment, source, destination, connectivity=18)

        for i in range(0, len(pathToGo)):
            pp = pathToGo[i]
            self.environment[pp[0]][pp[1]][pp[2]] = 99999999999

        color = (random.random(), random.random(), random.random())

        if addToPlot:
            for x in pathToGo:
                self.ax.scatter(x[0], x[1], x[2], c=color)

        if isANewDrone:
            self.listDrones.append((identifier, priority, source, destination, startingTime))

        # Recalculate the path of the drones of low priority
        print("Test : ", self.listDrones)

        for drone in self.listDrones:
            print("Priority drone : ", drone, " ", drone[1])
            if int(drone[1]) > int(priority):
                print("Drone is low priority : ", drone[0])
                result = self.addDroneLessPriority(drone, addToPlot=True)
                pathToGoRet[drone[0]] = result

        pathToGoRet[identifier] = list()
        for elem in pathToGo:
            pathToGoRet[identifier].append([elem[0], elem[1]])
        return pathToGoRet

    def addDroneLessPriority(self, drone, addToPlot=False):
        pathToGoRet = list()

        source = drone[2]
        destination = drone[3]

        pathToGo = dijkstra3d.dijkstra(self.environment, source, destination, connectivity=18)

        for i in range(0, len(pathToGo)):
            pp = pathToGo[i]
            self.environment[pp[0]][pp[1]][pp[2]] = 99999999999

        for elem in pathToGo:
            pathToGoRet.append([elem[0], elem[1]])

        if addToPlot:
            color = (random.random(), random.random(), random.random())
            for x in pathToGo:
                self.ax.scatter(x[0], x[1], x[2], c=color)
        return pathToGoRet

    def deleteDrone(self, identifier):
        for drone in self.listDrones:
            if drone[0] == identifier:
                self.listDrones.remove(drone)

    def blockAZone(self, listPoints, recalculateDronesPath=True, addToPlot=False):
        global returnVal
        for i in range(0, 3):

            # Block a zone around edges (make a 9-zones square for each edge in order to avoid problems
            for time in range(0, self.z):
                self.environment[listPoints[i][0]][listPoints[i][1]][time] = 999999999999999
                self.environment[listPoints[i][0] + 1][listPoints[i][1]][time] = 999999999999999
                self.environment[listPoints[i][0] + 1][listPoints[i][1] + 1][time] = 999999999999999
                self.environment[listPoints[i][0]][listPoints[i][1] + 1][time] = 999999999999999
                self.environment[listPoints[i][0] - 1][listPoints[i][1]][time] = 999999999999999
                self.environment[listPoints[i][0] - 1][listPoints[i][1] - 1][time] = 999999999999999
                self.environment[listPoints[i][0]][listPoints[i][1] - 1][time] = 999999999999999
                self.environment[listPoints[i][0] + 1][listPoints[i][1] - 1][time] = 999999999999999
                self.environment[listPoints[i][0] - 1][listPoints[i][1] + 1][time] = 999999999999999

            # Calculation of the sides of the blocked zone
            l = list()

            diffX = listPoints[i + 1][0] - listPoints[i][0]
            diffY = listPoints[i + 1][1] - listPoints[i][1]

            numberOfPoints = max(abs(diffX), abs(diffY))

            intervalX = diffX / (numberOfPoints + 1)
            intervalY = diffY / (numberOfPoints + 1)

            for j in range(0, numberOfPoints):
                l.append([int(listPoints[i][0] + intervalX * j), int(listPoints[i][1] + intervalY * j)])

            # Adding blocked zones to the environment

            for point in l:
                for time in range(0, self.z):
                    self.listBlockedPoints.append((point[0], point[1], time))
                    self.environment[point[0]][point[1]][time] = 99999999999999
                    self.environment[point[0] + 1][point[1] + 1][time] = 99999999999999
                    self.environment[point[0]][point[1] + 1][time] = 99999999999999
                    self.environment[point[0] + 1][point[1]][time] = 99999999999999

        # Do the last side of the polygon

        l = list()

        diffX = listPoints[len(listPoints) - 1][0] - listPoints[0][0]
        diffY = listPoints[len(listPoints) - 1][1] - listPoints[0][1]

        numberOfPoints = max(diffX, diffY)

        intervalX = diffX / (numberOfPoints + 1)
        intervalY = diffY / (numberOfPoints + 1)

        for j in range(0, numberOfPoints):
            l.append([int(listPoints[0][0] + intervalX * j),
                      int(listPoints[0][1] + intervalY * j)])

        # Adding blocked zones to the environment
        for point in l:
            for time in range(0, self.z):
                self.listBlockedPoints.append((point[0], point[1], time))
                self.environment[point[0]][point[1]][time] = 99999999999999
               # self.environment[point[0]+1][point[1]+1][time] = 99999999999999


        returnVal = dict()
        if recalculateDronesPath:

            # self.listDrones.clear()

            #self.ax = self.fig.add_subplot(111, projection='3d')
            for drone in self.listDrones:
                result = self.addDrone(drone[0], drone[1], drone[2], drone[3], drone[4], isANewDrone=False,
                                       addToPlot=addToPlot)

                for key, value in result.items():
                    returnVal[key] = value


        if addToPlot:
            for point in self.listBlockedPoints:
                if point[2] == 0:
                    self.ax.scatter(point[0], point[1], point[2], c=(0.5, 0.5, 0.5))

            for k,v in returnVal.items():
                for pointe in v:
                    self.ax.scatter(pointe[0], pointe[1], 0, c=(0.8, 0.8, 0.8))
        return returnVal
    
    def updateDrone(self, listDronesToUpdate):
        for (k,v) in listDronesToUpdate.items():
            for drone in self.listDrones:
                if k == drone[0]:
                    print(drone[1], drone[2],drone[3],drone[4])
                    self.listDrones.remove(drone)
                    self.listDrones.append((drone[0], [v[0][0], v[0][1], 0], [v[0][0], v[0][1], 0], [v[-1][0], v[-1][1], 0], drone[4]))

    def plotting(self):
        plt.show()

    def deleteBlockedZone(self, listPoints):
        for i in range(0, 3):

            # Calculation of the sides of the blocked zone
            l = list()

            diffX = listPoints[i + 1][0] - listPoints[i][0]
            diffY = listPoints[i + 1][1] - listPoints[i][1]

            numberOfPoints = max(abs(diffX), abs(diffY))

            intervalX = diffX / (numberOfPoints + 1)
            intervalY = diffY / (numberOfPoints + 1)

            for j in range(0, numberOfPoints):
                l.append([int(listPoints[i][0] + intervalX * j), int(listPoints[i][1] + intervalY * j)])

            # Adding blocked zones to the environment

            for point in l:
                for time in range(0, self.z):
                    try:
                        self.listBlockedPoints.remove((point[0], point[1], time))
                        self.environment[point[0]][point[1]][time] = time + 1
                    except:
                        print("PROBLEEEEM")
                        pass

        # Do the last side of the polygon

        l = list()

        diffX = listPoints[len(listPoints) - 1][0] - listPoints[0][0]
        diffY = listPoints[len(listPoints) - 1][1] - listPoints[0][1]

        numberOfPoints = max(diffX, diffY)

        intervalX = diffX / (numberOfPoints + 1)
        intervalY = diffY / (numberOfPoints + 1)

        for j in range(0, numberOfPoints):
            l.append([int(listPoints[0][0] + intervalX * j),
                      int(listPoints[0][1] + intervalY * j)])

        # Adding blocked zones to the environment
        for point in l:
            for time in range(0, self.z):
                try:
                    self.listBlockedPoints.remove((point[0], point[1], time))
                    self.environment[point[0]][point[1]][time] = time
                except:
                    print("PROBLEM")
                    pass


if __name__ == '__main__':
    envTest = Environment(500, 500)
    res = envTest.addDrone(1, 21, [232, 432], [22, 11], isANewDrone=True, addToPlot=True)
    print("----")
    res2 = envTest.addDrone(2, 22, [12, 482], [211, 98], isANewDrone=True, addToPlot=True)
    print("----")
    res3 = envTest.addDrone(3, 24, [82, 111], [467, 432], isANewDrone=True, addToPlot=True)
    print("----")
    res4 = envTest.addDrone(4, 1, [1, 411], [8, 321], isANewDrone=True, addToPlot=True)
    print("----")

    #envTest.blockAZone([[300, 300], [300, 400], [400, 400], [400, 300]], recalculateDronesPath=True, addToPlot=True)
    #envTest.deleteBlockedZone([[300, 300], [300, 400], [400, 400], [400, 300]])
    #res5 = envTest.addDrone(6, 1, [82, 111], [467, 432], isANewDrone=True, addToPlot=True)

    envTest.plotting()
