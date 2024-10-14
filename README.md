![nosebyte's interactive orerry in neos view](nosebyte.github.io/assets/neos.png)
# *INTRODUCTION*

An orrery is a visual and tangible representation of celestial bodies and their orbits, designed to make it easier to grasp the concept of Keplerian orbits and the principles behind their calculations. By displaying the positions and movements of planets, moons, and other objects in a solar system model, an orrery provides an intuitive way to understand complex orbital mechanics.

## PROJECT OUTLINE

This project aims to create a interactive and informative web-based static orrery that represents the solar system, near-Earth objects (NEOs). Using a combination of Python and JavaScript (via the Three.js library), we developed a tool that illustrates planetary Keplerian orbits, helping users visualize how these bodies are positioned and are in space relative to each other.

###### Elliptical orbit

We converted the polar equation of an ellipse into 3D Cartesian space by tilting and projecting the ellipse using three angular parameters: the inclination, longitude of the ascending node, and argument of perihelion. This transformation allows the ellipse to be accurately represented in three-dimensional space.

X_Value = r * (math.cos(Ω) * math.cos(ω+φ) - math.sin(Ω) * math.sin(ω+φ) * math.cos(i))

Y_Value = r * (math.sin(Ω) * math.cos(ω+φ) + math.cos(Ω) * math.sin(ω+φ) * math.cos(i))

Z_Value = r * (math.sin(ω+φ) * math.sin(i))

Here, ****r**** represents the distance between the orbiting object (such as a planet or asteroid) and the focus of its elliptical orbit. ****true anomaly (ν or φ)**** indicates the object's current position relative to perihelion. ****eccentricity (e)**** defines the orbit's shape.****semi-major axis (a)**** determines the orbit's size. ****inclination (i)**** specifies the tilt of the orbital plane. ****longitude of the ascending node (Ω)**** defines the orientation of the ascending node.****Argument of perihelion (ω)**** describes the angle from the ascending node to the perihelion.Together, these parameters allow for the accurate projection of the distance r and the object's position in Cartesian coordinates (X, Y, Z)

## CONCLUSION

Developing a web-based program that utilizes Kepler's equations to derive the orbital paths of near-Earth objects (NEOs) represents a significant advancement in both educational and practical applications within the fields of astronomy and space exploration. By combining complex mathematical computations with intuitive visual representations, this tool not only enhances our understanding of orbital mechanics but also provides valuable insights for researchers, educators, and enthusiasts alike.

The interactive nature of the platform allows users to engage with the data in a meaningful way, fostering a deeper appreciation for the dynamics of celestial bodies. Additionally, by making this information accessible online, we promote wider public interest in space science and its implications for Earth.
