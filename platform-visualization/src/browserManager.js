function BrowserManager() {

   var textura = [],
       views = [];

   this.navegacion_button = [];

   var self = this;

function config_view ( _id, _left, _right, _top, _bottom ){  

// Los id solo pueden ser: home, table, stack

    var view = { id : _id, right : _right, left : _left, top : _top, bottom : _bottom  };

    views.push(view);

}


this.actionButton = function ( button ) {
    
    var i = 0,
        view = "";

    while(views[i].id != window.actualView){

        i = i + 1 ;

    } 

    if ( button === "right" ) 

        view = views[i].right;

    else if ( button === "left" ) 

        view = views[i].left;

    else if ( button === "top" ) 

        view = views[i].top;

    else 

        view = views[i].bottom;

    goToView(view);

};

/**
 * Created by Ricardo Delgado
 */
this.modifyButtonBack = function ( valor, display ) {
    
    var browserButton = document.getElementById('backButton');

     $(browserButton).fadeTo(1000, valor, function() {
                $(browserButton).show();
                browserButton.style.display = display;
            });
};
/**
 * Created by Ricardo Delgado
 */
this.modifyButtonLegend = function ( valor, display ) {
    
    var browserButton = document.getElementById('legendButton');

    $(browserButton).fadeTo(1000, valor, function() {

                $(browserButton).show();
                browserButton.style.display = display;

            });
};


this.createButton = function () {

    createTextura ( 0, "Home", "right");
    createTextura ( 1, "View Table", "right");
    createTextura ( 2, "View Dependencies", "right");
    createTextura ( 3, "Home", "left");
    createTextura ( 4, "View Table", "left");
    createTextura ( 5, "View Dependencies", "left");

    addButton ( "right" );
    addButton ( "left" );

    config_view ( "home", null, "table", null, null );
    config_view ( "table", "home", "stack", null, null );
    config_view ( "stack", "table", null, null, null );

};

function addButton ( button ) {

    var mesh,
        posicion,
        j;

    mesh = new THREE.Mesh(
                new THREE.PlaneGeometry( 80, 80 ),
                new THREE.MeshBasicMaterial({map:null , side: THREE.FrontSide, transparent: true})
            );
    
    if ( button === "right" ) {

    posicion = { x: 23800, y: 0, z: 20000 }; j = 0;

    } else  {

    posicion = { x: -23800, y: 0, z: -20000 }; j = 1;

    }

    mesh.position.set( posicion.x, 
                       posicion.y, 
                       posicion.z );

    mesh.scale.set(50,50,50);

    mesh.userData = { state : true, arrow : button };

    mesh.material.opacity = 1;

    window.scene.add(mesh);
    
    self.navegacion_button[j] = mesh;  

}

function createTextura ( id, label, button) {

    var canvas,
        ctx,
        img = new Image(),
        texture,
        fontside,
        imageside;

    if ( label === "View Table" ) fontside = { font: "20px Arial", x: 50, y: 50 };

    else if ( label === "View Dependencies" ) fontside = { font: "20px Arial", x: 80, y: 80 };

    else if ( label == "Home") fontside = { font: "20px Arial", x: 35, y: 35 };

    if ( button === "right" ) {

    imageside = { x: 15 };

    } else  {

    imageside = { x: 0 };

    }

    canvas = document.createElement('canvas');
    canvas.width  = 80;
    canvas.height = 80;

    ctx = canvas.getContext("2d");

    img = new Image(); 
    img.src = "images/browsers arrows/arrow-"+button+".png";

    img.onload = function () {

      ctx.font = fontside.font;
      ctx.fillText(label, 0, 65, fontside.x , fontside.y);
      ctx.drawImage(img, imageside.x, 0, 40, 40);
      
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;  
      texture.minFilter = THREE.NearestFilter;

      textura[id] = texture;

     };

}


this.hide_Button = function ( ) {

    var _label,
        i = 0;

    while(views[i].id != window.actualView){

    i = i + 1 ;

    } 

    if( views[i].right ) {
  
      _label = label("right", views[i].right);

      modifyButton (0, _label);

    } else {

     modifyButton (0, null);

    }

  if( views[i].left ) {
  
     _label = label(1, views[i].left);

     modifyButton (1, _label);

  } else {

     modifyButton (1, null);  
  }


};

function label(button, view){

//Codigos de las textura Disponibles
/* 0 : home -> right, 1 : table -> right, 2 : stack -> right
   3 : home <- left, 4 : table <- left, 5 : stack <- left
*/ 

    var id;

  if (button === "right"){

      if ( view === "home" ) id = 0;

      else if (view === "table" ) id = 1;

      else  id = 2;

  } else {
  
      if ( view === "home" ) id = 3;

      else if (view === "table" ) id = 4;

      else  id = 5;

  } 

    return id;}

function modifyButton (id, texture){

    var visibility = -20000; 

    var mesh = self.navegacion_button[ id ];

    if ( texture ) {

       mesh.material.map = textura[ texture ];

       mesh.material.needsUpdate = true;

       visibility = 20000;

    }

    if ( visibility != mesh.position.z ) animateButton(mesh);

}

function animateButton ( mesh, duration ){

        var _duration = duration || 2000,
            z = mesh.position.z * -1;

        var tween = new TWEEN.Tween(mesh.position);
        tween.to({z : z}, 2000);
        tween.delay( _duration );
        tween.easing(TWEEN.Easing.Exponential.InOut);
        tween.onUpdate(render);
        
        tween.start();

    }

}