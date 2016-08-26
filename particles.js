"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Particle System
////////////////////////////////////////////////////////////////////////////////

/*global THREE, Stats */

//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var path = "";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

var camera, scene, renderer, stats;
var cameraControls;
var jsondata;

var clock = new THREE.Clock();
var group = new THREE.Group();


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
	camera = new THREE.PerspectiveCamera( 55, canvasRatio, 2, 8000 );
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
		var n = data.pdata.x.length;
		var textureLoader = new THREE.TextureLoader();
		var mapC = textureLoader.load( "disc.png" );
		var material = new THREE.SpriteMaterial( { map: mapC, color: 0xff0000, fog: true } );
		for (var i = 1; i < n; i++){
			var sprite = new THREE.Sprite( material );
			sprite.position.set( 10*data.pdata.x[i], data.pdata.y[i], data.pdata.z[i] );
			sprite.scale.x = 10*data.pdata.r[i] ;
			sprite.scale.y = 10*data.pdata.r[i] ;
			sprite.scale.z = 10*data.pdata.r[i] ;
			group.add( sprite );	
		}
		scene.add( group );
	}
	

	})
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render(scene, camera);
	stats.update();
}

init();
animate();
