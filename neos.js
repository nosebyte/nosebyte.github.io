// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set up the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);

  // Create the Sun
  const sunGeometry = new THREE.SphereGeometry(0.25, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Planets data
  const planets = [
    { name: "Mercury", distance: 0.8, size: 0.05, color: 0x8a8a8a, period: 0.24 },
    { name: "Venus", distance: 1.2, size: 0.08, color: 0xe39e1c, period: 0.62 },
    { name: "Earth", distance: 1.5, size: 0.09, color: 0x2233ff, period: 1 },
    { name: "Mars", distance: 2.2, size: 0.07, color: 0xff3300, period: 1.88 }
  ];

  // Create planets and their orbits
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

  // NEOs data
  const neos = [
    {
      name: "45P/Honda-Mrkos-Pajdusakova",
      epoch: 56060,
      e: 0.8246720759,
      a: 3.0198,
      i: 4.252433261,
      omega: 326.2580404,
      node: 89.0021809,
      M: 0,
    },
    {
      name: "P/2004 R1 (McNaught)",
      epoch: 54629,
      e: 0.682526943,
      a: 3.08968,
      i: 4.894555854,
      omega: 0.626837835,
      node: 295.9854497,
      M: 0,
    },
    {
      name: "P/2008 S1 (Catalina-McNaught)",
      epoch: 55101,
      e: 0.6663127807,
      a: 3.560539,
      i: 15.1007464,
      omega: 203.6490232,
      node: 111.3920029,
      M: 0,
    },
    {
      name: "45P/Honda-Mrkos-Pajdusakova",
      epoch: 56060,
      e: 0.8246720759,
      a: 3.0198,
      i: 4.252433261,
      omega: 326.2580404,
      node: 89.0021809,
      M: 0,
    },
    {
      name: "P/2004 R1 (McNaught)",
      epoch: 54629,
      e: 0.682526943,
      a: 3.08968,
      i: 4.894555854,
      omega: 0.626837835,
      node: 295.9854497,
      M: 0,
    },
    {
      name: "P/2008 S1 (Catalina-McNaught)",
      epoch: 55101,
      e: 0.6663127807,
      a: 3.560539,
      i: 15.1007464,
      omega: 203.6490232,
      node: 111.3920029,
      M: 0,
    },
    {
      name: "3D/Biela",
      epoch: -9480,
      e: 0.751299,
      a: 1.253401,
      i: 13.2164,
      omega: 221.6588,
      node: 250.669,
      M: 0,
    },
    {
      name: "7P/Pons-Winnecke",
      epoch: 56981,
      e: 0.6375275046,
      a: 3.331407,
      i: 22.33501476,
      omega: 172.5061606,
      node: 93.41632728,
      M: 0,
    },
    {
      name: "8P/Tuttle",
      epoch: 54374,
      e: 0.819799747,
      a: 5.122649,
      i: 54.98318484,
      omega: 207.509246,
      node: 270.341652,
      M: 0,
    },
    {
      name: "21P/Giacobini-Zinner",
      epoch: 56498,
      e: 0.7068178874,
      a: 3.501973,
      i: 31.90810099,
      omega: 172.5844249,
      node: 195.3970145,
      M: 0,
    }, 
  ];

  // Create NEOs and their orbits
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

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // Add name tag
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff }));
    sprite.scale.set(0.5, 0.25, 1);
    sprite.position.set(0, 0.1, 0);
    neoMesh.add(sprite);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "24px Arial";
    context.fillStyle = "white";
    context.fillText(neo.name, 0, 24);
    context.fillText(`Epoch: ${neo.epoch}`, 0, 48);
    const texture = new THREE.CanvasTexture(canvas);
    sprite.material.map = texture;
    sprite.material.needsUpdate = true;

    neo.mesh = neoMesh;
    neo.orbit = orbitLine;
  });

  // Set up camera and controls
  camera.position.set(0, 5, 15);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Animation variables
  let simulationSpeed = 1;
  let paused = false;

  // Animation loop
  function animate(time) {
    requestAnimationFrame(animate);

    if (!paused) {
      const t = time * 0.001 * simulationSpeed;

      planets.forEach((planet) => {
        const angle = t / planet.period;
        planet.mesh.position.x = Math.cos(angle) * planet.distance;
        planet.mesh.position.z = Math.sin(angle) * planet.distance;
        planet.mesh.rotation.y += 0.01;
      });

      neos.forEach((neo) => {
        const a = neo.a;
        const e = neo.e;
        const i = (neo.i * Math.PI) / 180;
        const omega = (neo.omega * Math.PI) / 180;
        const node = (neo.node * Math.PI) / 180;

        const M = (t / a ** 1.5) % (2 * Math.PI);
        let E = M;
        for (let j = 0; j < 5; j++) {
          E = M + e * Math.sin(E);
        }

        const x = a * (Math.cos(E) - e);
        const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

        const xh = x * (Math.cos(omega) * Math.cos(node) - Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
                   y * (Math.sin(omega) * Math.cos(node) + Math.cos(omega) * Math.sin(node) * Math.cos(i));
        const yh = x * (Math.cos(omega) * Math.sin(node) + Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
                   y * (Math.cos(omega) * Math.cos(node) * Math.cos(i) - Math.sin(omega) * Math.sin(node));
        const zh = x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);

        neo.mesh.position.set(xh, zh, yh);
      });

      // Make labels face the camera
      scene.traverse(function (object) {
        if (object instanceof THREE.Sprite) {
          object.quaternion.copy(camera.quaternion);
        }
      });
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Start the animation
  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // UI Controls
  const pauseButton = document.querySelector('.interface button');
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseButton.textContent = paused ? "▶" : "⏸";
  });

  const speedInput = document.querySelector('.interface input[type="range"]');
  if (speedInput) {
    speedInput.addEventListener("input", (e) => {
      simulationSpeed = parseFloat(e.target.value);
    });
  }

  const resetButton = document.querySelectorAll('.interface button')[2];
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      controls.reset();
    });
  }

  const toggleOrbitsButton = document.querySelectorAll('.interface button')[1];
  if (toggleOrbitsButton) {
    toggleOrbitsButton.addEventListener("click", () => {
      scene.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.visible = !object.visible;
        }
      });
    });
  }
});

// //neos
// const neos = [
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
// ];

// //neo orb
// neos.forEach((neo) => {
//   const orbitPoints = [];
//   const segments = 256;
//   const a = neo.a;
//   const e = neo.e;
//   const i = (neo.i * Math.PI) / 180;
//   const omega = (neo.omega * Math.PI) / 180;
//   const node = (neo.node * Math.PI) / 180;

//   for (let j = 0; j <= segments; j++) {
//     const theta = (j / segments) * Math.PI * 2;
//     const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
//     const x = r * Math.cos(theta);
//     const y = r * Math.sin(theta);

//     const xh =
//       x *
//         (Math.cos(omega) * Math.cos(node) -
//           Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
//       y *
//         (Math.sin(omega) * Math.cos(node) +
//           Math.cos(omega) * Math.sin(node) * Math.cos(i));
//     const yh =
//       x *
//         (Math.cos(omega) * Math.sin(node) +
//           Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
//       y *
//         (Math.cos(omega) * Math.cos(node) * Math.cos(i) -
//           Math.sin(omega) * Math.sin(node));
//     const zh =
//       x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);

//     orbitPoints.push(new THREE.Vector3(xh, zh, yh));
//   }

//   const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
//   const orbitMaterial = new THREE.LineBasicMaterial({
//     color: 0xffffff,
//     opacity: 0.5,
//     transparent: true,
//   });
//   const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
//   scene.add(orbitLine);
// });

// //neo farm
// neos.forEach((neo) => {
//   const neoGeometry = new THREE.SphereGeometry(0.05, 8, 8);
//   const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//   const neoMesh = new THREE.Mesh(neoGeometry, neoMaterial);

//   const orbit = new THREE.Object3D();
//   orbit.add(neoMesh);
//   scene.add(orbit);

//   // Add name tag
//   const sprite = new THREE.Sprite(
//     new THREE.SpriteMaterial({ color: 0xffffff })
//   );
//   sprite.scale.set(0.5, 0.25, 1);
//   sprite.position.set(0, 0.1, 0);
//   neoMesh.add(sprite);

//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "24px Arial";
//   context.fillStyle = "white";
//   context.fillText(neo.name, 0, 24);
//   context.fillText(`Epoch: ${neo.epoch}`, 0, 48);
//   const texture = new THREE.CanvasTexture(canvas);
//   sprite.material.map = texture;
//   sprite.material.needsUpdate = true;

//   neo.mesh = neoMesh;
//   neo.orbit = orbit;
// });

// function animate(time) {
//   requestAnimationFrame(animate);

//   const t = time * 0.001 * simulationSpeed;

//   planets.forEach((planet) => {
//     const angle = t / planet.period;
//     planet.mesh.position.x = Math.cos(angle) * planet.distance;
//     planet.mesh.position.z = Math.sin(angle) * planet.distance;
//     planet.mesh.rotation.y += 0.01;
//   });

//   neos.forEach((neo) => {
//     const a = neo.a;
//     const e = neo.e;
//     const i = (neo.i * Math.PI) / 180;
//     const omega = (neo.omega * Math.PI) / 180;
//     const node = (neo.node * Math.PI) / 180;

//     const M = (t / a ** 1.5) % (2 * Math.PI);
//     let E = M;
//     for (let j = 0; j < 5; j++) {
//       E = M + e * Math.sin(E);
//     }

//     const x = a * (Math.cos(E) - e);
//     const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

//     const xh =
//       x *
//         (Math.cos(omega) * Math.cos(node) -
//           Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
//       y *
//         (Math.sin(omega) * Math.cos(node) +
//           Math.cos(omega) * Math.sin(node) * Math.cos(i));
//     const yh =
//       x *
//         (Math.cos(omega) * Math.sin(node) +
//           Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
//       y *
//         (Math.cos(omega) * Math.cos(node) * Math.cos(i) -
//           Math.sin(omega) * Math.sin(node));
//     const zh =
//       x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);

//     neo.mesh.position.set(xh, zh, yh);
//   });

//   // Make name tags face the camera
//   scene.traverse(function (object) {
//     if (object instanceof THREE.Sprite) {
//       object.quaternion.copy(camera.quaternion);
//     }
//   });

//   renderer.render(scene, camera);
// }

// animate();

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
