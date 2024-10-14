
# An interactive orerry website for viewing near earth objects
> Final working project: [Nosebyte's orerry](https://nosebyte.github.io/)
![neos view](https://nosebyte.github.io/assets/neos.png)

>#### This was a project made for the [Nasa's International Space apps challenge hackathon](https://www.spaceappschallenge.org/)
>![NASA space apps hackathon logo](https://assets.spaceappschallenge.org/media/images/Space_Apps_Default_Logo_-_2-Col.width-440.jpegquality-60.png)
## INTRODUCTION

An orrery is a visual and tangible representation of celestial bodies and their orbits, designed to make it easier to grasp the concept of Keplerian orbits and the principles behind their calculations. By displaying the positions and movements of planets, moons, and other objects in a solar system model, an orrery provides an intuitive way to understand complex orbital mechanics.

## PROJECT OUTLINE
This project aims to create a interactive and informative web-based interactive orrery that represents the solar system, near-Earth objects (NEOs).
   
Using Python we first layed the foundation and essentially a    blueprint for our project. Then we made the web app using JavaScript along with WebGL (and Three.js library).

## What we did
We developed a tool that illustrates planetary Keplerian orbits, helping users visualize how these bodies are positioned and are in space relative to each other.

### How is it useful?

 1. **Risk Awareness**: orrery can reveal the potential risks of NEO collisions with Earth, increasing public awareness of space objects that may impact our planet.
 2. **Data Visualization**: It turns complex astronomical data into a visually appealing 3D model, which can be used by educators, museums, or science communicators to explain space phenomena.
 3. **Educational**: Helps users visualize and understand the elliptical orbits of near-Earth objects. It improves understanding of orbital mechanics and celestial behavior in ways that are more interesting than traditional static models... 
 4. **Scientific Insights**: Provides a realistic and up-to-date view of NEO tracks by integrating real-world data. Makes the study of object trajectories useful for researchers, academics, and those interested in space... 


## The code

### Elliptical orbits

We converted the polar equation of an ellipse into 3D Cartesian space by tilting and projecting the ellipse using three angular parameters: the inclination, longitude of the ascending node, and argument of perihelion. 
This transformation allows the ellipse to be accurately represented in 3 dimensional space.

    X_Value = r * (Math.cos(Ω) * Math.cos(ω+φ) - Math.sin(Ω) * Math.sin(ω+φ) * Math.cos(i))
    
    Y_Value = r * (Math.sin(Ω) * Math.cos(ω+φ) + Math.cos(Ω) * Math.sin(ω+φ) * Math.cos(i))
    
    Z_Value = r * (Math.sin(ω+φ) * Math.sin(i))
    
Here,
 - ***r*** represents the distance between an orbiting object (such as a planet or asteroid) and the center of its elliptical orbit.
 - ***True anomaly (ν or φ)*** Indicates the current position of the object closest to the Sun. 
 - ***Eccentricity (e)*** determines the shape of the orbit 
 - ***Semi-major axis (a)*** determines the shape of the orbit 
 - ***Slope (i)*** indicates the inclination of the orbital plane 
 - ***Longitude of the ascending node (Ω)*** Defines the orientation of the ascending node 
 - ***Perihelion argument (ω)*** Describes the angle from the ascending node. go as far as perihelion.
 
 When combined These parameters are expressed in Cartesian coordinates (X, Y, . Z), allowing accurate estimation of the distance r and position of the object.

### Displaying NEOs and its orbits
We have an array of information sourced from nasa's api about the NEOs

    const neos = [
        {
          name: "45P/Honda-Mrkos-Pajdusakova", epoch: 56060,
          e: 0.8246720759, a: 3.0198, i: 4.252433261,
          omega: 326.2580404, node: 89.0021809, M:0
        },
        {
          name: "P/2004 R1 (McNaught)", epoch: 54629,
          e: 0.682526943, a: 3.08968, i: 4.894555854,
          omega: 0.626837835, node: 295.9854497, M: 0
        },
        .
        .
        .

We then iterate over this array and use the values to create the elliptical orbits (via the previously mentioned ellipse calculations) and spheres to represent each NEO's current position.
Then we render it to the scene with a simple white mesh.

    neos.forEach((neo) => {
        const neoGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const neoMesh = new THREE.Mesh(neoGeometry, neoMaterial);
        scene.add(neoMesh);
    
        const orbitPoints = [];
        const segments = 256;
        const a = neo.a;
        const e = neo.e;
        const i = (neo.i * Math.PI) / 180;
        const omega = (neo.omega * Math.PI) / 180;
        const node = (neo.node * Math.PI) / 180;
    
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
    
          const xh = x * (Math.cos(omega) * Math.cos(node) - Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
                     y * (Math.sin(omega) * Math.cos(node) + Math.cos(omega) * Math.sin(node) * Math.cos(i));
          const yh = x * (Math.cos(omega) * Math.sin(node) + Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
                     y * (Math.cos(omega) * Math.cos(node) * Math.cos(i) - Math.sin(omega) * Math.sin(node));
          const zh = x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);
    
          orbitPoints.push(new THREE.Vector3(xh, zh, yh));
        }

We did the same thing for the planets except we used 2d circles on the z plane to represent their orbits (planets were included as reference and are not part of the NEOs)

      const planets = [
        { name: "Mercury", distance: 0.8, size: 0.05, color: 0x8a8a8a, period: 0.24 },
        { name: "Venus", distance: 1.2, size: 0.08, color: 0xe39e1c, period: 0.62 },
        { name: "Earth", distance: 1.5, size: 0.09, color: 0x2233ff, period: 1 },
        { name: "Mars", distance: 2.2, size: 0.07, color: 0xff3300, period: 1.88 }
      ];
    
      planets.forEach(planet => {
        const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        scene.add(planetMesh);
    
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const orbitPoints = [];
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2;
          orbitPoints.push(new THREE.Vector3(Math.cos(angle) * planet.distance, 0, Math.sin(angle) * planet.distance));
        }
        orbitGeometry.setFromPoints(orbitPoints);
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);
    
        planet.mesh = planetMesh;
        planet.orbit = orbit;
      });

### Interface and controls
This is not the best-looking interface out there, but we decided to keep things minimal and easy to use, with clear labels and colors.

For the controls we could've used the built-in controls from WebGL but decided on making a dedicated controls section using html and styled it with css since the website wont look "pretty".
This forced us to make a
HTML:-

	<button id="pauseButton">⏸</button>
    <button onclick="resetView()">Toggle orbits</button>
    <input type="range" id="speedSlider">
JS:-

    const pauseButton = document.querySelector('.interface');
      pauseButton.addEventListener("click", () => {
        paused = !paused;
        pauseButton.textContent = paused ? "▶" : "⏸";
      });
    
      const speedInput = document.querySelector('.interface');
      if (speedInput) {
        speedInput.addEventListener("input", (e) => {
          simulationSpeed = parseFloat(e.target.value);
        });
      }
      //
      const toggleOrbitsButton = document.querySelector('.interface')[1];
      if (toggleOrbitsButton) {
        toggleOrbitsButton.addEventListener("click", () => {
          scene.traverse((object) => {
            if (object instanceof THREE.Line) {
              object.visible = !object.visible;
            }
          });
        });
      }

## CONCLUSION

Developing a web-based program that utilizes Kepler's equations to derive the orbital paths of near-Earth objects (NEOs) represents a significant advancement in both educational and practical applications within the fields of astronomy and space exploration. By combining complex mathematical computations with intuitive visual representations, this tool not only enhances our understanding of orbital mechanics but also provides valuable insights for researchers, educators, and enthusiasts alike.

The interactive nature of the platform allows users to engage with the data in a meaningful way, fostering a deeper appreciation for the dynamics of celestial bodies. Additionally, by making this information accessible online, we promote wider public interest in space science and its implications for Earth.

# Our Team: [NoseByt](https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/nosebyt/)
We are all high school students from the same school, same grade and this was our first offline hackathon and we really enjoyed working on it.

### team members:
| Name | Role |
|--|--|
| [*Sreehari*](https://github.com/retiredmushroom) | Developer - Logic|
| [*Arjun*](https://github.com/arjunliji) | Developer - Web dev|
|*Sanmai*|Presentation|
|*Aswin*| Presentation|
|*Amruth*| Presentation|

The project took about 48 hours to complete and some prep time before the hackathon



