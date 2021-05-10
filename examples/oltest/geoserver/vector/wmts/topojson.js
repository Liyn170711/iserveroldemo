var baseUrl = 'http://127.0.0.1:8032/geoserver/gwc/service/wmts';
var style = '';
var format = 'application/json;type=topojson';
var infoFormat = 'text/html';
var layerName = 'china:chinaback';
var projection = 'EPSG:4326';
var gridsetName = 'EPSG:4326';
/***可以通过解析WMTS能力集获取到的数据**************************************************/
var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
var extent = [73.1330490112305,17.9828186035156,135.395172119141,53.7387809753418];
var tileSize = [256,256];
var tileOrigin = [-180, 90];
var params = {
  'REQUEST': 'GetTile',
  'SERVICE': 'WMTS',
  'VERSION': '1.0.0',
  'LAYER': layerName,
  'STYLE': style,
  'TILEMATRIX': gridsetName + ':{z}',
  'TILEMATRIXSET': gridsetName,
  'FORMAT': format,
  'TILECOL': '{x}',
  'TILEROW': '{y}'
};

/**
 * 构造数据源
 */
function constructSource() {
  var url = baseUrl+'?'
  for (var param in params) {
    url = url + param + '=' + params[param] + '&';
  }
  url = url.slice(0, -1);
  var source = new ol.source.VectorTile({
    url: url,
    format: new ol.format.TopoJSON({}),
    projection: projection,
    tileGrid: new ol.tilegrid.WMTS({
      tileSize: tileSize,
      origin: tileOrigin,
      resolutions: resolutions,
      matrixIds: gridNames
    }),
    wrapX: true
  });
  return source;
}

/**
 * 初始化方法
 */
function init(){
  var layer = new ol.layer.VectorTile({
    source: constructSource()
  });
  
  var view = new ol.View({
    center: [0, 0],
    zoom: 2,
    resolutions: resolutions,
    projection: projection,
    extent: extent
  });
  
  var map = new ol.Map({
    layers: [layer],
    target: 'map',
    view: view
  });
  map.getView().fit(extent, map.getSize());
  
  window.setParam = function(name, value) {
    if (name == "STYLES") {
      name = "STYLE"
    }
    params[name] = value;
    layer.setSource(constructSource());
    map.updateSize();
  } 
  
  map.on('singleclick', function(evt) {
    document.getElementById('info').innerHTML = '';
  
    var source = layer.getSource();
    var resolution = view.getResolution();
    var tilegrid = source.getTileGrid();
    var tileResolutions = tilegrid.getResolutions();
    var zoomIdx, diff = Infinity;
  
    for (var i = 0; i < tileResolutions.length; i++) {
        var tileResolution = tileResolutions[i];
        var diffP = Math.abs(resolution-tileResolution);
        if (diffP < diff) {
            diff = diffP;
            zoomIdx = i;
        }
        if (tileResolution < resolution) {
          break;
        }
    }
    var tileSize = tilegrid.getTileSize(zoomIdx);
    var tileOrigin = tilegrid.getOrigin(zoomIdx);
  
    var fx = (evt.coordinate[0] - tileOrigin[0]) / (resolution * tileSize[0]);
    var fy = (tileOrigin[1] - evt.coordinate[1]) / (resolution * tileSize[1]);
    var tileCol = Math.floor(fx);
    var tileRow = Math.floor(fy);
    var tileI = Math.floor((fx - tileCol) * tileSize[0]);
    var tileJ = Math.floor((fy - tileRow) * tileSize[1]);
    var matrixIds = tilegrid.getMatrixIds()[zoomIdx];
  
    var url = baseUrl+'?'
    for (var param in params) {
      if (param.toUpperCase() == 'TILEMATRIX') {
        url = url + 'TILEMATRIX='+matrixIds+'&';
      } else {
        url = url + param + '=' + params[param] + '&';
      }
    }
  
    url = url
      + 'SERVICE=WMTS&REQUEST=GetFeatureInfo'
      + '&INFOFORMAT=' +  infoFormat
      + '&TileCol=' +  tileCol
      + '&TileRow=' +  tileRow
      + '&I=' +  tileI
      + '&J=' +  tileJ;
  
    if (url) {
      document.getElementById('info').innerHTML = 'Loading... please wait...';
      var xmlhttp = new XMLHttpRequest();    xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
             if (xmlhttp.status == 200) {
                 document.getElementById('info').innerHTML = xmlhttp.responseText;
             }
             else {
                document.getElementById('info').innerHTML = '';
             }
          }
      }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
    }
  });
  }