// Basic setup for Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5).normalize();
scene.add(light);

// Camera setup
camera.position.z = 10;

// GLTFLoader for loading the 3D model
const loader = new THREE.GLTFLoader();
loader.load('free_1975_porsche_911_930_turbo.glb', function(gltf) {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);  // Scale the model if necessary

  // Traverse the model to check for unsupported properties
  model.traverse((object) => {
    if (object.isMesh) {
      const material = object.material;

      // Check and remove the 'format' property if present
      if (material && material.format) {
        delete material.format;
      }

      // Optionally, modify material properties
      material.color = new THREE.Color(0xffffff);  // Set color
    }
  });

  scene.add(model);

  // GSAP animation: Rotate the model
  gsap.to(model.rotation, {
    y: Math.PI * 2,  // Rotate 360 degrees around the Y-axis
    duration: 3,     // 5 seconds per rotation
    repeat: -1,      // Repeat infinitely
    ease: "none"    // No easing for a smooth constant rotation
  });

}, undefined, function(error) {
  console.error('Error loading model:', error);
});


// OrbitControls to allow camera rotation via mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Handle window resize
window.addEventListener('resize', function() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();  // Update OrbitControls
  renderer.render(scene, camera);
}
animate();
