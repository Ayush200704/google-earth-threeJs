import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import getStarfield from "./stars.js";
import {getFresnelMat} from "./getFresnelMat.js"

const renderer = new THREE.WebGLRenderer({antialias: true});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement)

const fov = 75;
const aspect = w/h
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 5

const scene = new THREE.Scene()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const earthGroup = new THREE.Group();
earthGroup.rotation.z += -23.4 * Math.PI/180
scene.add(earthGroup)
const textureLoader = new THREE.TextureLoader();
// const geo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
const geo = new THREE.IcosahedronGeometry(1.0, 12);
const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load("./images/earthmap4k.jpg")
})
const mesh = new THREE.Mesh(geo, mat);

earthGroup.add(mesh)

const stars = getStarfield({numStars:2000});
scene.add(stars)


// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
// scene.add(hemiLight)

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-1,0.5,1.5)
scene.add(sunlight)

const lightsMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./images/earthlights4k.jpg"),
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
})

const cloudMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./images/earthcloudmaptrans.jpg"),
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
})
const lightMesh = new THREE.Mesh(geo, lightsMat)
earthGroup.add(lightMesh)


const cloudMesh = new THREE.Mesh(geo, cloudMat)
cloudMesh.scale.setScalar(1.0003)
earthGroup.add(cloudMesh)

const glowMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, glowMat)
glowMesh.scale.setScalar(1.01)
scene.add(glowMesh)

function animate(){
    requestAnimationFrame(animate)
    mesh.rotation.y +=0.002
    cloudMesh.rotation.y +=0.002
    lightMesh.rotation.y +=0.002
    glowMesh.rotation.y +=0.002
    
    stars.rotation.y +=0.002
    renderer.render(scene, camera);
    controls.update()
}

animate()



function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleWindowResize, false);