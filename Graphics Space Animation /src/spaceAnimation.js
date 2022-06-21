// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// helper function for later on
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


// Here we load the cubemap and skymap, you may change it

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'src/skybox/right.png',
  'src/skybox/left.png',
  'src/skybox/top.png',
  'src/skybox/bottom.png',
  'src/skybox/front.png',
  'src/skybox/back.png',
]);
scene.background = texture;


// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time

const loader1 = new THREE.TextureLoader();
const textureM = loader1.load(
  'src/textures/moon.jpg'
);
const loader2 = new THREE.TextureLoader();
const textureE = loader2.load(
  'src/textures/earth.jpg'
);
const loader3 = new THREE.TextureLoader();
const textureS = loader3.load(
  'src/textures/star.jpg'
);

// TODO: Add Lighting
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(0, 100, 300)
scene.add( directionalLight );

const spotLight = new THREE.SpotLight( 0xffffff );
scene.add( spotLight );


// TODO: Spaceship
// You should copy-paste the spaceship from the previous exercise here

const matrix = new THREE.Matrix4();

const colors = {
	"primary": "#5a638a",
	"secondary": "#3f2a70",
}

// Head
const Head = new THREE.Mesh(new THREE.ConeGeometry(5,5,32),new THREE.MeshPhongMaterial( {color: colors["primary"]} ));
const translationMatrix3 = new THREE.Matrix4();
translationMatrix3.set( 1, 0, 0, 0,
0, 1, 0, 20,
0, 0, 1, 0,
0, 0, 0, 1 );
Head.applyMatrix4(translationMatrix3)

// Hull
const Hull = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, 15, 32 ), new THREE.MeshPhongMaterial( {color: colors["secondary"]}) );
const translationMatrix4 = new THREE.Matrix4();
translationMatrix4.set( 1, 0, 0, 0,
0, 1, 0, -10,
0, 0, 1, 0,
   0, 0, 0, 1 );
Hull.applyMatrix4(translationMatrix4)
Head.add(Hull);

// Wings
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([-5, -10, 0,
                                   -5, 0, 0,
                                   -10, -10, 0,]);                        
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const Wings = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( {color: colors["primary"], side: THREE.DoubleSide} ));

const theta = degrees_to_radians(120)
const rotationMatrix = new THREE.Matrix4();
rotationMatrix.set( Math.cos(theta), 0, Math.sin(theta), 0,
0,1,0,0,
-Math.sin(theta),0, Math.cos(theta), 0,
0,0,0,1 );
Wings.applyMatrix4(rotationMatrix)
Wings.applyMatrix4(translationMatrix4)
Head.add(Wings)

var wing2 = Wings.clone();
wing2.applyMatrix4(rotationMatrix)
Head.add(wing2)

var wing3 = wing2.clone();
wing3.applyMatrix4(rotationMatrix)
Head.add(wing3)

// Windows
const first_window = new THREE.Mesh( new THREE.RingGeometry( 2, 1, 32 ), new THREE.MeshBasicMaterial( { color: colors["primary"], side: THREE.DoubleSide } ) );
const translationMatrix = new THREE.Matrix4();
translationMatrix.set( 1, 0, 0, 0,
0, 1, 0, -1,
0, 0, 1, 5,
0, 0, 0, 1 );
first_window.applyMatrix4(translationMatrix)
const theta2 = degrees_to_radians(-30)
const rotationMatrix2 = new THREE.Matrix4();
rotationMatrix2.set( Math.cos(theta2), 0, Math.sin(theta2), 0,
0,1,0,0,
-Math.sin(theta2),0, Math.cos(theta2), 0,
0,0,0,1 );
first_window.applyMatrix4(rotationMatrix2)
first_window.applyMatrix4(translationMatrix4)
Head.add(first_window)

const window_position = matrix.makeRotationY(degrees_to_radians(30));
const window2 = first_window.clone();
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
Head.add(window2)

const window3 = window2.clone();
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
window2.applyMatrix4(window_position);
Head.add(window3)

scene.add(Head)

const rotationMatrix4 = new THREE.Matrix4();
const theta4 = degrees_to_radians(-70)
rotationMatrix4.set( 1, 0, 0, 0,
0, Math.cos(theta4), -Math.sin(theta4), 0,  
0, Math.sin(theta4), Math.cos(theta4), 0,
0,0,0,1 );
Head.applyMatrix4(rotationMatrix4)

const rotationMatrix5 = new THREE.Matrix4();
const theta5 = degrees_to_radians(-45)
rotationMatrix5.set( Math.cos(theta5), -Math.sin(theta5), 0, 0,
Math.sin(theta5), Math.cos(theta5), 0, 0,
0, 0, 1, 0,
0,0,0,1 );
Head.applyMatrix4(rotationMatrix5)

spotLight.target = Hull;

// TODO: Planets
// You should add both earth and the moon here
let earth = new THREE.Mesh( new THREE.SphereGeometry( 100, 32, 16 ), new THREE.MeshPhongMaterial( {map: textureE} ) );
const translationMatrix5 = new THREE.Matrix4();
translationMatrix5.set( 1, 0, 0, 100,
0, 1, 0, 5,
0, 0, 1, -500,
0, 0, 0, 1 );
earth.applyMatrix4(translationMatrix5)
scene.add(earth);


let moon = new THREE.Mesh( new THREE.SphereGeometry(25, 32, 16 ), new THREE.MeshPhongMaterial( {map: textureM} ) );
scene.add(moon);


// TODO: Bezier Curves
const curveA = new THREE.QuadraticBezierCurve3(
moon.position,
new THREE.Vector3( 5, 5, -80 ),
earth.position
);

const curveB = new THREE.QuadraticBezierCurve3(
moon.position,
new THREE.Vector3( 100, 0, -100 ),
earth.position
);

const curveC = new THREE.QuadraticBezierCurve3(
moon.position,
new THREE.Vector3( 50, 5, -70 ),
earth.position
);

const curveList = [curveA, curveC, curveB]

// TODO: Camera Settings
// Set the camera following the spaceship here
const cameraOffset = new THREE.Vector3(0, 30, 30);

const rotationMatrix3 = new THREE.Matrix4();
const theta3 = degrees_to_radians(-45)
rotationMatrix3.set( 1, 0, 0, 0,
0, Math.cos(theta3), -Math.sin(theta3), 0,  
0, Math.sin(theta3), Math.cos(theta3), 0,
0,0,0,1 );
camera.applyMatrix4(rotationMatrix3)


renderer.render( scene, camera );

let numberOfSegments = 1000;

// TODO: Add collectible stars
class GoodStar{
constructor(curveNumber, t){
this.curve = curveNumber;
this.t = t;
this.star = new THREE.Mesh( new THREE.SphereGeometry(4, 32, 16 ), new THREE.MeshPhongMaterial( {map: textureS, color: "#3cdfff"}  ) );
const starPosition1 = curveList[curveNumber].getPoint(t)
this.star.position.set(starPosition1.x, starPosition1.y, starPosition1.z)
scene.add(this.star)
}

}

class BadStar{
constructor(curveNumber, t){
this.curve = curveNumber;
this.t = t;
this.star = new THREE.Mesh( new THREE.SphereGeometry(4, 32, 16 ), new THREE.MeshPhongMaterial( {map: textureS, color: "#FF6863"}  ) );
const starPosition1 = curveList[curveNumber].getPoint(t)
this.star.position.set(starPosition1.x, starPosition1.y, starPosition1.z)
scene.add(this.star)
}

}
const starList = [new GoodStar(1,0.8), new GoodStar(0,0.7), new GoodStar(2,0.6), new GoodStar(1,0.5), new GoodStar(0,0.4), new GoodStar(0,0.3)]
const badStarList = [new BadStar(0, 0.25), new BadStar(0, 0.25), new BadStar(2, 0.45), new BadStar(0, 0.55), new BadStar(0, 0.65), new BadStar(0, 0.75)]


let i = 0;
let currentSegment;
let currentCurve = 0;
let starsCollected = 0;
let pointsCollected = 0;
const objectPosition = new THREE.Vector3();

// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
if (e.code == 'ArrowLeft'){
	currentCurve = currentCurve == 0 ? 0 : currentCurve-1
} else if (e.code == 'ArrowRight'){
	currentCurve = currentCurve == 2 ? 2 : currentCurve+1
}	
}

document.addEventListener('keydown', handle_keydown);

let stopped = false;

function animate() {

	requestAnimationFrame( animate );
	// TODO: Animation for the spaceship position
	currentSegment = i/numberOfSegments
	const newPosition = curveList[currentCurve].getPoint(currentSegment);
	const positionTranslation = new THREE.Vector3(newPosition.x - Head.position.x, newPosition.y - Head.position.y, newPosition.z - Head.position.z);
	
	if (!stopped) {
		Head.applyMatrix4(new THREE.Matrix4().makeTranslation(positionTranslation.x, positionTranslation.y, positionTranslation.z));
		const cPosition = curveList[1].getPoint(currentSegment);
		Head.getWorldPosition(objectPosition);
		camera.position.copy(cPosition).add(cameraOffset);
		spotLight.position.set(Head.position.x, Head.position.y + 10, Head.position.z);
	}

	moon.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(1)));
	earth.rotation.y += 0.005;

	starList.forEach( (star, index) => {
		starList[index].star.rotation.y += 0.01;
	}
	)

	badStarList.forEach( (star, index) => {
		badStarList[index].star.rotation.y -= 0.01;
	}
	)

	i++;


	// TODO: Test for star-spaceship collision
	// We optimize to splice out stars if we already passed them
	for (let k = 0; k < starList.length; k++){
		if (currentCurve == starList[k].curve && currentSegment == starList[k].t){
			starList[k].star.visible = false;
			starList.splice(k,1);
			k--;
			pointsCollected = pointsCollected + 1;
		}
		else if ( currentSegment >= starList[k].t) {
			starList.splice(k,1)
		}
	}

	for (let k = 0; k < badStarList.length; k++){
		if (currentCurve == badStarList[k].curve && currentSegment == badStarList[k].t){
			badStarList[k].star.visible = false;
			badStarList.splice(k,1);
			k--;
			pointsCollected = pointsCollected - 1;
		}
		else if ( currentSegment >= badStarList[k].t) {
			badStarList.splice(k,1)
		}
	}


	renderer.render( scene, camera );

	if (currentSegment == 1){
		stopped = true;
		let prompt = pointsCollected > 3? "Great job! " : pointsCollected > 0? "Not bad! " : "Too bad! "
		alert(prompt+`You earned ${pointsCollected} points, refresh the page to go again!`);
	}

}

animate()
alert("Collect the green stars, but be careful to avoid the red ones, they are evil!")