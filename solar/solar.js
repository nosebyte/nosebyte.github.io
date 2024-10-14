const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;

const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
const sunLight = new THREE.PointLight(0xffffff, 1, 100);
sun.add(sunLight);

const planets = [
  { name: "Mercury", distance: 3, size: 0.1, color: 0x8c7853, period: 0.24 },
  { name: "Venus", distance: 4, size: 0.2, color: 0xffd700, period: 0.62 },
  { name: "Earth", distance: 5, size: 0.2, color: 0x0000ff, period: 1 },
  { name: "Mars", distance: 6, size: 0.15, color: 0xff0000, period: 1.88 },
  { name: "Jupiter", distance: 10, size: 0.5, color: 0xffa500, period: 11.86 },
  { name: "Saturn", distance: 13, size: 0.4, color: 0xffd700, period: 29.46 },
  { name: "Uranus", distance: 16, size: 0.3, color: 0x00ffff, period: 84.01 },
  { name: "Neptune", distance: 19, size: 0.3, color: 0x0000ff, period: 164.79 },
];

const orbitLines = [];

planets.forEach((planet) => {
  const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
  const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

  const orbit = new THREE.Object3D();
  orbit.add(planetMesh);
  scene.add(orbit);

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff }));
  sprite.scale.set(0.5, 0.25, 1);
  sprite.position.set(0, planet.size + 0.5, 0);
  planetMesh.add(sprite);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "48px Arial";
  context.fillStyle = "white";
  context.fillText(planet.name, 0, 48);
  const texture = new THREE.CanvasTexture(canvas);
  sprite.material.map = texture;
  sprite.material.needsUpdate = true;

  planet.mesh = planetMesh;
  planet.orbit = orbit;

  const orbitLine = createOrbit(planet.distance, planet.color);
  orbitLines.push(orbitLine);
  scene.add(orbitLine);
});

function createOrbit(radius, color = 0xffffff) {
  const segments = 128;
  const material = new THREE.LineBasicMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return new THREE.Line(geometry, material);
}

let isPaused = false;

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseButton").innerText = isPaused ? "⏵" : "⏸";
}

function toggleOrbits() {
  const showOrbits = document.getElementById("showOrbits").checked;
  orbitLines.forEach(orbit => {
    orbit.visible = showOrbits;
  });
}

camera.position.z = 30;

let simulationSpeed = 1;
const speedSlider = document.getElementById("speedSlider");
speedSlider.addEventListener("input", (event) => {
  simulationSpeed = parseFloat(event.target.value);
});

function animate(time) {
  requestAnimationFrame(animate);

  if (!isPaused) {
    const t = time * 0.001 * simulationSpeed;

    planets.forEach((planet) => {
      const angle = t / planet.period;
      planet.mesh.position.x = Math.cos(angle) * planet.distance;
      planet.mesh.position.z = Math.sin(angle) * planet.distance;
      planet.mesh.rotation.y += 0.01;
    });
  }

  scene.traverse(function (object) {
    if (object instanceof THREE.Sprite) {
      object.quaternion.copy(camera.quaternion);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById("pauseButton").addEventListener("click", togglePause);
document.getElementById("showOrbits").addEventListener("change", toggleOrbits);
