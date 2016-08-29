"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Particle System
////////////////////////////////////////////////////////////////////////////////

/*global THREE, Stats */

//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var path = "";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

var camera, scene, renderer, stats;
var cameraControls;
var alldata;
var timestep = 0;

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	//renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	// renderer.setClearColorHex( 0x0, 1.0 );

	var container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// STATS

	stats = new Stats();
	stats.setMode( 0 );
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	stats.domElement.children[ 0 ].children[ 0 ].style.color = "#aaa";
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[ 1 ].style.display = "none";

	// CAMERA
	camera = new THREE.PerspectiveCamera( 10, canvasRatio, 2, 1000 );
	camera.position.set( 10, 5, 15 );

	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	fillScene();
}

function fillScene() {
	scene = new THREE.Scene();
	var loader = new THREE.STLLoader();
	var geometry = new THREE.Geometry();
	var filename;
	// $.ajax({
	// 	url: "stl/",
	// 	async:false,
	// 	success: function(data){
	// 	var stlmaterial = new THREE.MeshBasicMaterial( { color: 0xD3D3D3} );
	// 		$(data).find('a').each(function (){
	// 		filename = $(this).attr("href");
	// 	  	loader.load( 'stl/'+filename, function ( geometry ) {
	// 			scene.add( new THREE.Mesh( geometry,stlmaterial) );
	// 	  	})
	// 	 })
	// 	}
	// });

	$.ajax({
	url: 'data.json',
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


var clock = new THREE.Clock();
var group = new THREE.Group();
var textureLoader = new THREE.TextureLoader();
var mapC = textureLoader.load( "ball.png" );


function updateScene(t){
	group.children = [];
	scene.remove(group);
	var n = alldata.timedata[t].x.length;
			for (var i= 0; i < n; i++){
				var material = new THREE.SpriteMaterial( { map: mapC, fog: false } );
				material.color.setRGB( 1-alldata.timedata[t].r[i]/0.005, alldata.timedata[t].r[i]/0.005,1)
				var sprite = new THREE.Sprite(material);
				sprite.position.set( alldata.timedata[t].x[i], alldata.timedata[t].y[i], alldata.timedata[t].z[i] );
				sprite.scale.x = alldata.timedata[t].r[i] ;
				sprite.scale.y = alldata.timedata[t].r[i] ;
				sprite.scale.z = alldata.timedata[t].r[i] ;
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
	cameraControls.update(delta);
	renderer.render(scene, camera);
	timestep = updateT(timestep);
	updateScene(timestep);
	stats.update();
}

init();
animate();
