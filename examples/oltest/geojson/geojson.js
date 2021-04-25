/********************************************************************
* 测试openlayers 加载geojson数据 渲染矢量图层 脚本
*********************************************************************/
let map = null; // 地图
/*******************************公共变量*****************************/
  
/*******************************处理方法*****************************/
/**
 * 初始化地图
 */
function loadMap() {
  let baseLayer = new ol.layer.Tile({ source: new ol.source.OSM({wrapX: false}) }); // 瓦片底图
  let vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject),
    wrapX: false
  });
  vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));
  let vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction
  });
  map = new ol.Map({
    target: "map", // 地图渲染的DOM对象
    layers: [ // 初始设置地图图层
      baseLayer,
      vectorLayer
    ],
    view: new ol.View({ // 地图视图
      center: [0,0], // 中心点经纬度坐标
      zoom: 2, // 默认缩放等级
    })
  });
}