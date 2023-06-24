
// = 010 ======================================================================
// 課題
// 3Dテキスト
// ============================================================================

// 必要なモジュールを読み込み
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { FontLoader } from './lib/FontLoader.js';
import { TextGeometry } from './lib/TextGeometry.js';

class App {
	constructor() {
		this.nearDist = 0.1;
		this.farDist = 10000;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			this.nearDist,
			this.farDist
		);
		this.camera.position.x = this.farDist * -2;
		this.camera.position.z = 500;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor("#292929"); // Backgrond Color - Blue
		this.renderer.setPixelRatio(window.devicePixelRatio); // For HiDPI devices to prevent bluring output canvas
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.querySelector("#webgl").appendChild(this.renderer.domElement);
    this.clock = new THREE.Clock();

		this.group = new THREE.Group();
		this.createCubes();

		this.textMesh = new THREE.Mesh();
		this.createTypography();

		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseFX = {
			windowHalfX: window.innerWidth / 2,
			windowHalfY: window.innerHeight / 2,
			coordinates: (coordX, coordY) => {
				this.mouseX = (coordX - this.mouseFX.windowHalfX) * 10;
				this.mouseY = (coordY - this.mouseFX.windowHalfY) * 10;
			},
			onMouseMove: (e) => {
				this.mouseFX.coordinates(e.clientX, e.clientY);
			},
			onTouchMove: (e) => {
				this.mouseFX.coordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
			},
		};
		document.addEventListener("mousemove", this.mouseFX.onMouseMove, false);
		document.addEventListener("touchmove", this.mouseFX.onTouchMove, false);

		this.render();
	}

  _mapRand(min, max, isInit = false) {
    let rand = Math.random() * (max - min) + min;
    rand = isInit ? Math.round(rand) : rand;
    return rand;
  }

	createCubes() {
		const size = 100;
		// const geometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    const geometrys = [
      new THREE.BoxGeometry(size, size, size),
      new THREE.TorusGeometry(size, 30, 200, 20),
    ];

		const material = new THREE.MeshNormalMaterial();
		for (let i = 0; i < 300; i++) {
			// const mesh = new THREE.Mesh(geometry, material);

      const gIndex = this._mapRand(0, geometrys.length - 1, true);
      const mesh = new THREE.Mesh(geometrys[gIndex], material);

      const dist = this.farDist / 3;
			const distDouble = dist * 2;
			const tau = 2 * Math.PI;

			mesh.position.x = Math.random() * distDouble - dist;
			mesh.position.y = Math.random() * distDouble - dist;
			mesh.position.z = Math.random() * distDouble - dist;
			mesh.rotation.x = Math.random() * tau;
			mesh.rotation.y = Math.random() * tau;
			mesh.rotation.z = Math.random() * tau;

			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();

			this.group.add(mesh);
		}
		this.scene.add(this.group);
	}

	createTypography() {
		const loader = new FontLoader();
		loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
			const word = "form and craft";
			const typoProperties = {
				font: font,
				size: 120,
				height: 60,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 6,
				bevelOffset: 1,
				bevelSegments: 8,
			};

			const text = new TextGeometry(word, typoProperties);
      this.textMesh.geometry = text;
      this.textMesh.material = new THREE.MeshNormalMaterial();
      this.textMesh.position.x = -240;
      this.textMesh.position.z = -120;
      this.scene.add(this.textMesh);
    });
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY * -1 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    // const t = Date.now() * 0.001;
    const elapsedTime = this.clock.getElapsedTime();
    const rx = Math.sin(elapsedTime * 0.7) * 0.5;
    const ry = Math.sin(elapsedTime * 0.3) * 0.5;
    const rz = Math.sin(elapsedTime * 0.2) * 0.5;
    this.group.rotation.x = rx;
    this.group.rotation.y = ry;
    this.group.rotation.z = rz;
    this.textMesh.rotation.x = rx;
    this.textMesh.rotation.y = ry;
    this.textMesh.rotation.z = rx;

    this.renderer.render(this.scene, this.camera);
  }
}

new App();



