"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Particle System
////////////////////////////////////////////////////////////////////////////////

/*global THREE, Stats */

//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var path = "";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

var camera, scene, renderer, stats, alldata;
var group = new THREE.Group();
	var timestep = 0;

var cameraControls, effectController;
var clock = new THREE.Clock();
var textureLoader = new THREE.TextureLoader();
var mapC = textureLoader.load( "ball.png" );
var newTime = 0, oldTime = 0;

init();
animate();


function init() {
	scene = new THREE.Scene();

	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	//renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xf0f0f0 );

	var container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	stats.domElement.children[ 0 ].children[ 0 ].style.color = "#aaa";
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[ 1 ].style.display = "none";
	// grid
	var size = 1, step = 0.1;
	var geometry = new THREE.Geometry();
	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, i, 0 ) );
		geometry.vertices.push( new THREE.Vector3(   size, i, 0 ) );
		geometry.vertices.push( new THREE.Vector3( i,- size,0 ) );
		geometry.vertices.push( new THREE.Vector3( i, size,0 ) );
	}
	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
	var line = new THREE.LineSegments( geometry, material );
	scene.add( line );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 1, canvasRatio, 2, 1000 );
	camera.up = new THREE.Vector3( 0, 0, 1 )
	camera.position.set( 20, -20, 20 );

	// camera = new THREE.OrthographicCamera( -1,1,1,-1, 500, -500 );
	// camera.up = new THREE.Vector3( 0, 0, 1 )
	// camera.position.set( 1,-1,1 );
	// camera.lookAt( scene.position );
	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);
	
	var axisHelper = new THREE.AxisHelper( 5 );
	scene.add( axisHelper );
	
	setupGui();
	drawflume()
	load();
}

function setupGui() {

	effectController = {
		pause: false,
		fps: 10
	};

	var gui = new dat.GUI();
	// material (attributes)
	gui.add( effectController, "pause" );
	gui.add( effectController, "fps", 1.0,10.0).step(1.0);;

}

function drawflume(){
	var flumeMaterial = new THREE.MeshBasicMaterial( {color:0x708090,side: THREE.DoubleSide } );
	var slope = new THREE.Mesh( new THREE.PlaneGeometry( 1,0.06), flumeMaterial );
	slope.rotation.y = 20* Math.PI /180;
	slope.position.set( -0.5, 0 , 0.182 );
	scene.add( slope );
	// container
	var container = new THREE.Mesh( new THREE.PlaneGeometry( 0.5,0.5), flumeMaterial );
	container.position.set( 0.25, 0 , -0.0025 );
	scene.add( container );
	//slope sidewall

}

function load() {	
	$.ajax({
	url: 'https://dl.dropboxusercontent.com/s/47t1zbfskt9eqcn/data.json?dl=0',
	// url: 'data.json',
	async: false,
	dataType: 'json',
	success: function (data) {
				alldata = data;
			}
	})
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function updateScene(t){
	group.children = [];
	scene.remove(group);
	var Smaterial = new THREE.SpriteMaterial( { map: mapC, color: 0x4682B4} );
	var Lmaterial = new THREE.SpriteMaterial( { map: mapC, color: 0xB22222} );
	var n = alldata.timedata[t].x.length;
			for (var i= 0; i < 4000; i++){
				var sprite = (alldata.timedata[t].r[i] >= 0.003)? new THREE.Sprite(Lmaterial): new THREE.Sprite(Smaterial); 
				sprite.position.set( alldata.timedata[t].x[i], alldata.timedata[t].y[i], alldata.timedata[t].z[i] );
				sprite.scale.x = 2*alldata.timedata[t].r[i] ;
				sprite.scale.y = 2*alldata.timedata[t].r[i] ;
				sprite.scale.z = 2*alldata.timedata[t].r[i] ;
				group.add( sprite );	
			}
		scene.add( group );
}

function updateT(t) {
	if (t < 99) {
		t++;
	} else {
		t = 0;
	}
	return t;
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update( delta );
	renderer.render( scene, camera );

	if (!effectController.pause){
		newTime += delta;
		if ( newTime > oldTime + 0.95/effectController.fps ) {
			oldTime = newTime;
			timestep = updateT(timestep);
			updateScene(timestep);
			stats.update();
		}
	}
		
}

