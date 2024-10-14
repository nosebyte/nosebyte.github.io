import matplotlib.pyplot as plt
import math
import numpy as np
import random

'''
  X_Value = r * (math.cos(Ω) * math.cos(ω+φ) - math.sin(Ω) * math.sin(ω+φ) * math.cos(i))
    Y_Value = r * (math.sin(Ω) * math.cos(ω+φ) + math.cos(Ω) * math.sin(ω+φ) * math.cos(i))
    Z_Value = r * (math.sin(ω+φ) * math.sin(i))
'''

objd=[[77.45779628,7.00497902,48.33076593,0.38709927,0.20563593],
      [131.60246718,3.39467605,76.67984255,0.72333566,0.00677672],
      [102.93768193,-0.00001531,0.0,1.00000261,0.01671123],
      [-23.94362959,1.84969142,49.55953891,1.52371034,0.09339410]]

colorl = ['red','blue','yellow','green','black']

fig = plt.figure()
ax = plt.axes(projection='3d')


u = np.arange(0, 2*math.pi, 0.05)

def orbit(g,b,c,a,e,color):
    w = math.radians(g) #periapsis longitude
    i = math.radians(b) #inclination
    om= math.radians(c) #ascending node
    wa = math.radians(w-om) #periapsis argument

    r = a*(1-(math.pow(e,2)))/(1+(e*np.cos(u)))
    x = r*(math.cos(om)*np.cos(wa+u) -math.sin(om)*np.sin(wa+u)*math.cos(i))
    y = r*(math.sin(om)*np.cos(wa+u) +math.cos(om)*np.sin(wa+u)*math.cos(i))
    z = r*np.sin(wa+u)*math.sin(i)

    ax.plot3D (x, y, z, color)

for i in objd:
    color = random.choice(colorl)
    orbit(i[0],i[1],i[2],i[3],i[4],color)

ax.set_aspect('equal')
ax.set_title('orbit gen 3000')
plt.show()
