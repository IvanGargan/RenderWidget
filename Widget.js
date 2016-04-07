define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  'esri/geometry/Extent', 
  'esri/layers/FeatureLayer', 
  'esri/InfoTemplate',
  'esri/renderers/SimpleRenderer', 
  'esri/Color', 
  'esri/symbols/SimpleFillSymbol', 
  'esri/symbols/SimpleLineSymbol',
  'dojo/_base/lang',
  "esri/dijit/Legend"],
  function(
    declare, 
    BaseWidget,
    Extent, 
    FeatureLayer, 
    InfoTemplate,
    SimpleRenderer, 
    Color, 
    SimpleFillSymbol, 
    SimpleLineSymbol,
    lang,
    Legend) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',
      featLayer: null, //variable global, se usa en varios sitios
      legendDijit: null,
      
      //methods to communication with app container:

       postCreate: function() {
        this.inherited(arguments);
        console.log('postCreate');
        //featLayer de edificios del server
        this.featLayer = new FeatureLayer('http://localhost:6080/arcgis/rest/services/PFM/Facility_2/MapServer/4', {
          outFields: ['*']
        });
        //Creamos el render que se añadirá a los edificios.
        this.featLayer.on('load', function(){
        var renderer = new SimpleRenderer(new SimpleFillSymbol().setOutline(new SimpleLineSymbol().setWidth(0.5).setColor(new Color([128,128,128]))));
          renderer.setColorInfo({
            field: 'Incidents',
            minDataValue: 0,
            maxDataValue: 6,
            colors: [
              new Color([255, 235, 214]),
              new Color([196, 10, 10])
            ]
          });
          //Añadimos el render a la featLayer.
          this.setRenderer(renderer); //estamos en this.featLayer
        });
        
       },

       startup: function() {
        this.inherited(arguments);
        console.log('startup');
        //Legenda en starup, porque es el momento en el que se crean los divs
        this.legendDijit = new Legend({
            map: this.map/*,
            layerInfos: layerInfo*/
          }, "legendDiv");
        this.legendDijit.startup(); //cada vez que se hace click en el boton, se muestra
       },

       onOpen: function(){
         console.log('onOpen');
         //alert('OPEN!');
       },

      render: function(){
        //Al hacer click en el boton se muestra el Rendes y la leyenda
        var mapa = this.map;
        this.map.addLayer(this.featLayer);
       },

      onClose: function(){
        console.log('onClose');
        //Al cerrar el widget, eliminamos todo.
        this.map.removeLayer(this.featLayer);
      }

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });