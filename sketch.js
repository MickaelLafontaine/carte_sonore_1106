let myMap; // on déclare une variable pour notre carte
const mappa = new Mappa('Leaflet'); // on fait appel à la librairie js Leaflet

let mousePos; // variable pour la souris

// coordonnées de l'edna
let edna_lat = 47.2040006;
let edna_lng = -1.5630606;

// position de départ
let initial_lat = edna_lat;// latitude de départ
let initial_lng =  edna_lng;// longitude de départ


// coordonnées de notre 1e zone = piscine du petit-port
let zone1_lat = 47.24281938536945; // latitude
let zone1_lng = -1.5535461663666055; // longitude

let zone1Pos; 
let calcul_diametre_zone1;

// Calcul des distances
let distance_zone1_avatar;

// Calcul des zones
let diametreSource1_lat = 47.240412801721035 ; 
let diametreSource1_lng = -1.5550851852822236; 
let diametre_zone1;

// Variables pour nos médias
let sound1; // on déclare la variable sound1 pour notre son1
let sound2;
let img1; // on déclare une variable pour l'image représentant  notre source 1
let img2;  // idem pour notre source 2
let user;

// variable pour le déplacement réaliste de l'avatar
// positions initiales de l'avatar
let avatar_easing_lat = edna_lat;
let avatar_easing_lng = edna_lng;
let avatar_target_lat = edna_lat;
let avatar_target_lng = edna_lng;
let easing = 0.05;
let avatarEasing;// position XY de l'avatar

let avatarLat;
let avatarLng;



function preload() {
  // Load a sound file
  sound1 = loadSound('assets/rain_light.mp3'); // on charge un fichier audio dans la variable sound1
  sound1.amp(0.3); // on ajuste le volume du son 1
  sound2 = loadSound('assets/church_1minute.mp3');
 
  
  img1 = loadImage('assets/pattern-01-0.png'); // on charge un fichier png dans la variable img1
  img2 = loadImage('assets/hambourg2_4.png');
  user = loadImage('assets/perso1.png');
}

// Lets put all our map options in a single object
// lat and lng are the starting point for the map.
const options = {
  lat: initial_lat,
  lng: initial_lng,
  zoom: 13,// zoom de départ
  style: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}

function setup(){
  canvas = createCanvas(windowWidth,windowHeight); // taille responsive

  // Create a tile map with the options declared
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);
    
 textAlign(CENTER);// on justifie au centre notre texte
 imageMode(CENTER); // poitn d'ancrage central pour notre image
} // fin de la fonction setup

function draw() {

  ////////////////////////////////////////////////////////
  // Ne pas toucher à la zone ci-dessous
  ////////////////////////////////////////////////////////
  
  // Clear the previous canvas on every frame
  clear();
  
  mousePos = myMap.fromPointToLatLng(mouseX,mouseY);// on convertit la position de la souris en coordonnées gps      
  
  // on calcule en permanence le déplacement réaliste de l'avatar (effet easing)
  let dx = avatar_target_lat - avatar_easing_lat;
  avatar_easing_lat += dx * easing;

  let dy = avatar_target_lng - avatar_easing_lng;
  avatar_easing_lng += dy *   easing;
  // fin du calcul
  let avatarEasing = myMap.latLngToPixel(avatar_easing_lat, avatar_easing_lng);

  // on récupère la position gps où l'utilisateur a cliqué  
  if(mouseIsPressed){
    avatarPos = myMap.latLngToPixel(mousePos.lat, mousePos.lng); // on récupère la position en pixels de la position gps de l'avatar // sans easing
    let avatarPosX = avatarPos.x;  // on met à jour avatarPosX
    let avatarPosY = avatarPos.y; // on met à jour avatarPosY   
    avatar_target_lat = mousePos.lat;     
    avatar_target_lng = mousePos.lng;
  }
  ////////////////////////////////////////////////////////
  
       
  ////////////////////////////////////////////////////////
  // on calcule en pixel les positions et dimensions de la zone 1  
  ////////////////////////////////////////////////////////
  zone1Pos = myMap.latLngToPixel(zone1_lat, zone1_lng);// on convertit la position gps de la zone 1 en une position XY 
  calcul_diametre_zone1 = myMap.latLngToPixel(diametreSource1_lat,diametreSource1_lng); // on récupère la position en pixel du point d'entrée de la zone 1
  // on calcule le diamètre de la zone
  diametre_zone1 = dist(zone1Pos.x,zone1Pos.y,calcul_diametre_zone1.x,calcul_diametre_zone1.y);
  
  // Calcul des icônes pour qu'elles soient responsives au zoom de la carte 
  //let zoom = myMap.zoom();
  //print("zoom = " + zoom);
  //let img_size = map(zoom,10,13,50,200);
 // img_size = constrain(img_size,0,200);
  //print("img_size = " + img_size);
  
  ////////////////////////////////////////////////////////
  // on dessine la zone 1  
  ////////////////////////////////////////////////////////
  fill(255,0,0);
  circle(zone1Pos.x,zone1Pos.y,10);
  
  // on dessine l'un des points d'entrée de la zone 1
  fill(0,0,255)
  circle(calcul_diametre_zone1.x,calcul_diametre_zone1.y,10)
  
  // on dessine la zone 1
  stroke(0,0,255);
  noFill(); 
  circle(zone1Pos.x,zone1Pos.y,diametre_zone1);
  push();
  tint(255,175);
  //image(img1,zone1Pos.x,zone1Pos.y,diametre_zone1*2,diametre_zone1*2);
  image(img1,zone1Pos.x,zone1Pos.y,diametre_zone1*2,diametre_zone1*2);  
  pop();
  
  ////////////////////////////////////////////////////////
  // Interactivité audio de la zone 1
  ////////////////////////////////////////////////////////
  // on calcule la distance entre l'avatar et le centre de la zone 1
  distance_zone1_avatar = abs(zone1_lat-avatar_easing_lat)+abs(zone1_lng-avatar_easing_lng);// avec easing 

 // AUDIO 1
 if(distance_zone1_avatar<0.0030470443227088584  && !sound1.isPlaying()){
    sound1.play();
    print("l'avatar est entré dans la zone 1")
  } 
 
 if(distance_zone1_avatar>0.0030470443227088584  && sound1.isPlaying()){
    sound1.stop();
    print("l'avatar est sorti dans la zone 1")
  } 
  if(distance_zone1_avatar<0.0030470443227088584){
     let sound1_volume = map(distance_zone1_avatar,0,0.0030470443227088584,1,0);
     sound1.amp(sound1_volume)
  }
  
   
 ////////////////////////////////////////////////////////
 //avatar
 ////////////////////////////////////////////////////////
  image(user,avatarEasing.x,avatarEasing.y,diametre_zone1,diametre_zone1/0.71);
  

} // fin du draw

function mouseReleased(){
    print("mousePos.lat = " + mousePos.lat);// on imprime dans la console la latitude de la position gps où se situe la souris  
    print("mousePos.lng = " + mousePos.lng);// on imprime dans la console la longitude de la position gps où se situe la souris 
    print("//////////////////////");// on ajoute une démarcation entre chaque clic

}
