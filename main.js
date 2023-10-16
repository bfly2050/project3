import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()

const canvas = document.querySelector('canvas.webgl')

//Particles

const vertices = [];

for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );

	vertices.push( x, y, z );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const material = new THREE.PointsMaterial( { color: 0x888888 } );
const points = new THREE.Points( geometry, material );
scene.add( points );

//Ambient light
const light = new THREE.AmbientLight( 0x404040, 0.8); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(0, 5, 0)
scene.add(directionalLight)

let mixer = null

//Add model
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'models/earthtext.glb',
	// called when the resource is loaded
	function ( gltf ) {

		gltf.scene.scale.set(1, 1, 1)
        scene.add(gltf.scene)

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

//add second model
loader.load(
	// resource URL
	'models/Low+Poly+Earth.glb',
	// called when the resource is loaded
	function ( gltf ) {

        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.z = 8;
        gltf.scene.position.x = -4;
        gltf.scene.position.y = 1.5;
        scene.add(gltf.scene)

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.x = 20
camera.position.y = 10
camera.lookAt(0, 0, 0);
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * Animate
 */
 const clock = new THREE.Clock()
 let previousTime = 0
 
 const tick = () =>
 {
     const elapsedTime = clock.getElapsedTime()
     const deltaTime = elapsedTime - previousTime
     previousTime = elapsedTime
 
     // Model animation
     if(mixer)
     {
         mixer.update(deltaTime)
     }
 
     // Update controls
     //controls.update()
 
     // Render
     renderer.render(scene, camera)
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()

