import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WarpGate } from "./area"
import { Lot } from "./lot"
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import Stats from 'three/examples/jsm/libs/stats.module'

// Scene setup
const scene = new THREE.Scene()
let gate: WarpGate
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/cubeMaps/' )
	.load( [
				'right.png',
				'left.png',
				'top.png',
				'bottom.png',
				'front.png',
				'back.png'
			] );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(0, 0, 4000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let areaName = "gate"

// Light declaration
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
directionalLight.visible = false

if (areaName == "gate"){
    // Create the chosen area
    gate = new WarpGate("half");
    gate.model!.rotateX(2 * Math.PI/4)
    scene.add(gate.model!);

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    directionalLight.visible = true

    directionalLight.position.set(0, 0.5, 1)
    directionalLight.lookAt(0,0,0)
    directionalLight.rotateOnWorldAxis(new THREE.Vector3(0,1,0), 2)

    scene.add( directionalLight );
}

// OrbitControls settings
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI/3*2
controls.minPolarAngle = Math.PI/3
controls.minDistance = 3000
controls.maxDistance = 5000

const forward = new THREE.Vector3(0, 0, 1)

let currentZone: number = 0
let prevZone: number

function getNormal(u: THREE.Vector3, v: THREE.Vector3): THREE.Vector3 {
    return new THREE.Plane().setFromCoplanarPoints(new THREE.Vector3(), u, v).normal;
}

function signedAngleTo(u: THREE.Vector3, v: THREE.Vector3): number {
    // Get the signed angle between u and v, in the range [-pi, pi]
    const angle = u.angleTo(v);
    const normal = getNormal(u, v);
    return normal.y * angle;
}

if (areaName == "gate"){
    controls.addEventListener('change', function(){
        directionalLight.position.set(camera.position.x, 0.5, camera.position.z)

        // Gets signed angle of camera to determine the zone currently being looked at
        const cameraFlatPos = new THREE.Vector3(camera.position.x, 0, camera.position.z)

        const angle = signedAngleTo(forward, cameraFlatPos) * 180/Math.PI
        if (angle > -22.5 && angle < 22.5){
            currentZone = 0
        }
        else if (angle < -22.5 && angle > -67.5){
            currentZone = 1
        }
        else if (angle < -67.5 && angle > -112.5){
            currentZone = 2
        }
        else if (angle < -112.5 && angle > -157.5){
            currentZone = 3
        }
        else if (angle < -157.5 || angle > 157.5){
            currentZone = 4
        }
        else if (angle > 112.5 && angle < 157.5){
            currentZone = 5
        }
        else if (angle > 67.5 && angle < 112.5){
            currentZone = 6
        }
        else if (angle > 22.5 && angle < 67.5){
            currentZone = 7
        }

        // Updates lot labels
        if (currentZone != prevZone){
            for(let label in lotLabels){
                scene.remove(lotLabels[label])
                delete lotLabels[label]
            }
            
            lotLabels = gate.generateLotLabels(currentZone)
        
            for(let label in lotLabels){
                scene.add(lotLabels[label])
            }

            console.log("Now looking at zone " + currentZone)
        }

        prevZone = currentZone
    })
}
console.log(scene);

// Raycaster mouse picking
let intersectedObject: THREE.Object3D | null
const highlightedMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
})

const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]

const mouse = new THREE.Vector2()

function onDocumentMouseMove(event: MouseEvent) {
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(gate.pickables, false)

    if (intersects.length > 0) {
        intersectedObject = intersects[0].object
    } else {
        intersectedObject = null
    }
    gate.pickables.forEach((o: THREE.Mesh, i) => {
        if (intersectedObject && intersectedObject === o) {
            gate.pickables[i].material = highlightedMaterial
        } else {
            gate.pickables[i].material = gate.originalMaterials[o.name]
        }
    })
}
document.addEventListener('mousemove', onDocumentMouseMove, false)

var doClickOnRelease = false;

// Mouse Events
// Prevents dragging from triggering click events
document.onmousedown = function() {
    // Get ready to see if the user wants to select something
    doClickOnRelease = true
};

document.onmousemove = function() {
    // Since you're dragging, that must be because you
    // didn't intend to select something in the first place
    doClickOnRelease = false;
};

// Selects a lot
document.onmouseup = function() {
    if (doClickOnRelease) {
        // Your select function
        if (intersectedObject){
            gate.lots.forEach((lot) => {
                if (lot.lotArea == intersectedObject as THREE.Mesh){
                    console.log("Picked lot " + lot.conLotID)

                    // TODO: Open details window

                }
            })
            
        }
    };
}

// CSS2D Labels
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

let lotLabels: { [key: string]: CSS2DObject }

document.onreadystatechange = function() {
    // Initialize lots
    gate.initLots()
}

// Render stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// Render resize
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    stats.update()

    render()
}

function render() {
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}
animate()