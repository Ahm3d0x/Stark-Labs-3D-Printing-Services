// viewer.js
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function renderSTL(containerId, stlUrl) {
  const container = document.getElementById(containerId);
  if (!container) return console.error(`Container '${containerId}' not found`);
  container.innerHTML = '';

  // المشهد والكاميرا والرندر
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf9f9f9);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(100, 100, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 💡 الإضاءة
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 200, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 🎮 التحكمات
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enableZoom = true;
  controls.enablePan = true;

  // 🎨 الخامة
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.3,
    roughness: 0.4,
    flatShading: true
  });

  // 🧱 تحميل STL وتوسيطه
  const loader = new STLLoader();
  loader.load(
    stlUrl,
    geometry => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 150 / Math.max(size.x, size.y, size.z);

      mesh.position.sub(center);
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
    },
    undefined,
    error => {
      console.error("❌ STL Error:", error);
      container.innerHTML = `<img src="fallback.jpg" alt="Preview not available" class="w-full h-full object-contain" />`;
    }
  );

  // 📦 عرض ديناميكي مع تغيير حجم الشاشة
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // 🌀 التحديث المستمر
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  // بعد animate();
animate();

// ✅ التحكم في الأزرار
const resetBtn = document.getElementById('reset-view');
const toggleBtn = document.getElementById('toggle-rotate');

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    controls.reset();
  });
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    toggleBtn.textContent = controls.autoRotate ? '⏸️ Pause Auto-Rotate' : '▶️ Start Auto-Rotate';
  });
}

  animate();

}


// 🪄 Export للنداء الخارجي
window.renderSTLViewer = renderSTL;
