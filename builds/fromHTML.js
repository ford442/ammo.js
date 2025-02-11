addedObjects=[];
mainScene=null;
mainPhysics=null;
mainObjects=null;
function resetDice(){
if(mainScene == null) return;
for(var i=0; i<addedObjects.length; i++){
var src=addedObjects[i];
mainScene.removeSceneObject(src.scene);
mainPhysics.remove(src.physics);
}
addedObjects=[];
spawnObjects(mainScene,mainPhysics,mainObjects);
}
function generateObjects(){
var result=[];
var colladaScene=CubicVR.loadCollada("images/die_4.dae","images/");
var die4mesh=colladaScene.getSceneObject("Die4Side").obj;
var die4Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die4mesh
});
var colladaScene=CubicVR.loadCollada("images/die_6.dae","images/");
var die6mesh=colladaScene.getSceneObject("Die6n").obj;
var die6Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die6mesh
});
var colladaScene=CubicVR.loadCollada("images/die_8.dae","images/");
var die8mesh=colladaScene.getSceneObject("Die").obj;
var die8Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die8mesh
});
var colladaScene=CubicVR.loadCollada("images/die_10.dae","images/");
var die10mesh=colladaScene.getSceneObject("Die10").obj;
var die10Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die10mesh
});
var colladaScene=CubicVR.loadCollada("images/die_12.dae","images/");
var die12mesh=colladaScene.getSceneObject("Die12").obj;
var die12Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die12mesh
});
var colladaScene=CubicVR.loadCollada("images/die_20.dae","images/");
var die20mesh=colladaScene.getSceneObject("Die20").obj;
var die20Collision=new CubicVR.CollisionMap({
type:"mesh",mesh:die20mesh
});
result.push({mesh:die4mesh,collision:die4Collision});
result.push({mesh:die6mesh,collision:die6Collision});
result.push({mesh:die8mesh,collision:die8Collision});
result.push({mesh:die10mesh,collision:die10Collision});
result.push({mesh:die12mesh,collision:die12Collision});
result.push({mesh:die20mesh,collision:die20Collision});
return result;
}
function spawnObjects(scene,physics,objlist){
var nobjs=objlist.length;
for(var i=0; i<nobjs; i++){
var src=objlist[i];
var sceneObj=new CubicVR.SceneObject({
mesh:src.mesh,position:[(i-2)*2,-3,0],rotation:[Math.random()*360,Math.random()*360,Math.random()*360]
});
var rigidObj=new CubicVR.RigidBody(sceneObj,{
type:"dynamic",mass:15,collision:src.collision
});
scene.bind(sceneObj);
physics.bind(rigidObj);
addedObjects.push({scene:sceneObj,physics:rigidObj});
}
}
function webGLStart(){
var gl=CubicVR.init();
var canvas=CubicVR.getCanvas();
if(!gl){
alert("Sorry, no WebGL support.");
return;
}
;var scene=new CubicVR.Scene({
camera:{
width:canvas.width,height:canvas.height,fov:80,position:[5,5,-5],target:[0,-3,0]
},light:{
type:"area",intensity:0.9,mapRes:2048,areaCeiling:40,areaFloor:-40,areaAxis:[-2,-2], // specified in degrees east/west north/south
distance:60
}
});
CubicVR.setSoftShadows(true);
var floorMaterial=new CubicVR.Material();
var floorMesh=new CubicVR.Mesh({
primitive:{
type:"box",size:1.0,material:{
specular:[0,0,0],shininess:0.9,env_amount:1.0,textures:{
color:"images/wood.jpg"
}
},uv:{
projectionMode:"cubic",scale:[0.05,0.05,0.05]
}
},compile:true
});
var floorObject=new CubicVR.SceneObject({
mesh:floorMesh,scale:[25,1,25],position:[0,-5,0]
});
var wallMesh=new CubicVR.Mesh({
primitive:{
type:"box",size:1.0,material:{
specular:[0,0,0],shininess:0.9,env_amount:1.0,opacity:0,textures:{
color:"images/wood.jpg"
}
},uv:{
projectionMode:"cubic",scale:[0.05,0.05,0.05]
}
},compile:true
});
var wallObject=new CubicVR.SceneObject({
mesh:wallMesh,scale:[1,100,25],position:[13,45,0]
});
var wallObject2=new CubicVR.SceneObject({
mesh:wallMesh,scale:[1,100,25],position:[-13,45,0]
});
var wallObject3=new CubicVR.SceneObject({
mesh:wallMesh,scale:[25,100,1],position:[0,45,13]
});
var wallObject4=new CubicVR.SceneObject({
mesh:wallMesh,scale:[25,100,1],position:[0,45,-13]
});
floorObject.shadowCast=false;
wallObject.shadowCast=false;
wallObject2.shadowCast=false;
wallObject3.shadowCast=false;
wallObject4.shadowCast=false;
var physics=new CubicVR.ScenePhysics();
var rigidFloor=new CubicVR.RigidBody(floorObject,{
type:"static",collision:{
type:"box",size:floorObject.scale
}
});
var rigidWall=new CubicVR.RigidBody(wallObject,{
type:"static",collision:{
type:"box",size:wallObject.scale
}
});
var rigidWall2=new CubicVR.RigidBody(wallObject2,{
type:"static",collision:{
type:"box",size:wallObject2.scale
}
});
var rigidWall3=new CubicVR.RigidBody(wallObject3,{
type:"static",collision:{
type:"box",size:wallObject3.scale
}
});
var rigidWall4=new CubicVR.RigidBody(wallObject4,{
type:"static",collision:{
type:"box",size:wallObject4.scale
}
});
physics.bind(rigidFloor);
physics.bind(rigidWall);
physics.bind(rigidWall2);
physics.bind(rigidWall3);
physics.bind(rigidWall4);
scene.bind(floorObject);
scene.bind(wallObject);
scene.bind(wallObject2);
scene.bind(wallObject3);
scene.bind(wallObject4);
mainPhysics=physics;
mainScene=scene;
mvc=new CubicVR.MouseViewController(canvas,scene.camera);
CubicVR.addResizeable(scene);
var objlist=generateObjects();
spawnObjects(scene,physics,objlist);
mainObjects=objlist;
var pickConstraint=null;
var pickDist=0;
mvc.setEvents({
mouseMove:function(ctx,mpos,mdelta,keyState){
if(!ctx.mdown) return;
if(pickConstraint){
pickConstraint.setPosition(scene.camera.unProject(mpos[0],mpos[1],pickDist));
}else{
ctx.orbitView(mdelta);
}
},mouseWheel:function(ctx,mpos,wdelta,keyState){
ctx.zoomView(wdelta);
},mouseDown:function(ctx,mpos,keyState){
var rayTo=scene.camera.unProject(mpos[0],mpos[1]);
var result=physics.getRayHit(scene.camera.position,rayTo);
if(result && !pickConstraint){
pickConstraint=new CubicVR.Constraint({
type:CubicVR.enums.physics.constraint.P2P,rigidBody:result.rigidBody,positionA:result.localPosition
});
physics.addConstraint(pickConstraint);
pickDist=CubicVR.vec3.length(CubicVR.vec3.subtract(scene.camera.position,result.position));
pickConstraint.setPosition(scene.camera.unProject(mpos[0],mpos[1],pickDist));
}
},mouseUp:function(ctx,mpos,keyState){
if(pickConstraint){
physics.removeConstraint(pickConstraint);
pickConstraint=null;
}
},keyDown:null,keyUp:null
});
window.addEventListener("keypress",function(evt){ physics.reset(); },false);
CubicVR.MainLoop(function(timer,gl){
physics.stepSimulation(timer.getLastUpdateSeconds());
scene.render();
});
}
