/**
 * OpenLayer+Geoserver+postgis实现路径分析
 * demo测试验证目标：
	openlayer是否能加载出geoserver不同服务（WMS、WMSC、WMTS）发布的sql视图瓦片；
	验证结论：
	WMS(http://localhost:8032/geoserver/test/wms)可以根据传入参数正常加载；
	WMSC(http://127.0.0.1:8032/geoserver/gwc/service/wms)、WMTS(http://127.0.0.1:8032/geoserver/gwc/service/wmts)可以加载出默认参数的瓦片，不能根据传入参数进行加载；
	猜想：gwc缓存中的瓦片不能根据传入参数进行加载？
	栅格方式：访问WMS瓦片需要提前把路径样式发布到geoserver中，不可以动态自定义展示的路径样式；
	矢量数据实现方式：通过WMS服务请求到geojson数据，在通过openlayer将geojson数据渲染出来，这样可以自定义展示的样式；-》 不可行；
	验证结论：
	栅格瓦片：openlayer加载geoserver发布的wms服务用于访问sql视图添加viewParams参数；
	矢量数据：openlayer通过服务端写个查询接口通过postgresql数据库中自定义的函数访问到geojson数据，openlayer再将数据展示到矢量图层中；
 */
var map
var startCoords = [108.30322265625001, 33.81591796875] // 起点坐标
var endCoords = [113.07128906250001, 35.17822265625] // 终点坐标
let projection = 'EPSG:4326'
let zoom = 5
let center = [108.30322265625001, 33.81591796875] // 中心点坐标
let workspace = 'test'
let layerName = 'test:railway_routetest'
let extent = [108.28254699707, 34.2608299255371, 113.01146697998, 35.2051544189453]
let routeLayer // 路径图层
let route_wmsImageLayer // 路径图层 wms Image图层
let route_wmsTileLayer // 路径图层 wms Tile图层


 /**
 * @description: 初始化地图
 * @return: undefined
 * @date: 2021-5-20 10:46:30
 */
function initMap () {
  let backLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8032/geoserver/china/wms',
        params: { 'LAYERS': 'china:chinaback', 'TILED': true },
        serverType: 'geoserver'
    })
  })
  initRouteLayer() // 初始化路径图层
  map = new ol.Map({
    target: 'map',
    layers: [ 
      backLayer, route_wmsImageLayer, route_wmsTileLayer
    ],
    view: new ol.View({
      projection,
      zoom,
      center
    })
  });
}

 /**
 * @description: 初始化路径图层
 * @date: 2021-5-20 11:44:49
 */
function initRouteLayer () {
  // 路径图层 wms Image图层
  route_wmsImageLayer = new ol.layer.Image({
    opacity: 0.5
  });
  // 路径图层 wms Tile图层
  route_wmsTileLayer = new ol.layer.Tile({
    opacity: 0.5
  });
}

 /**
 * @description: 处理地图选点
 * @param: pointCoord 存储点坐标的属性名
 * @date: 2021-5-20 10:56:30
 */
function handleSelectPoint (pointCoord) {
  map.once('singleclick', (event) => {
    console.log('鼠标点击的点坐标：', event.coordinate)
    this[pointCoord] = event.coordinate
    $(`#${pointCoord}`).text(event.coordinate.toString())
  })
}

 /**
 * @description: 路径规划
 * @date: 2021-5-20 11:00:10
 */
function routePlanning () {
  let wmsURL =  'http://localhost:8032/geoserver/test/wms'
  let params = {
    LAYERS: '	test:railway_routetest',
    FORMAT: 'geojson',
  };
  let viewParams = [
    'x1:' + startCoords[0],
    'y1:' + startCoords[1],
    'x2:' + endCoords[0],
    'y2:' + endCoords[1]
  ];
  console.log('请求的起点、终点坐标参数：', viewParams);   
  params.viewParams = viewParams.join(';');
  // showRouteInImageLayer(wmsURL, params) // 在 WMS Image 图层中显示路径 
  showRouteInWMSTileLayer(wmsURL, params) // 在 WMS Tile 图层中显示路径
}

 /**
 * @description: 在 WMS Image 图层中显示路径 
 * @date: 2021-5-20 11:25:57
 */
function showRouteInImageLayer (url, params) {
  route_wmsImageLayer.setSource(new ol.source.ImageWMS({
    url,
    params
  }))
}

 /**
 * @description: 在 WMS Tile 图层中显示路径
 * @date: 2021-5-20 11:29:56
 */
function  showRouteInWMSTileLayer(url, params) {
  route_wmsTileLayer.setSource(
    new ol.source.TileWMS({
      url,
      serverType: 'geoserver',
      params
    })
  )
}

 /**
 * @description: ajax请求方法
 * @param type 请求类型
 * @param url 请求地址
 * @param sucCalback 成功回调函数
 * @date: 2021-5-20 11:29:56
 */
function $ajax(type, url, sucCalback) {
  return new Promise((resolve, reject) => {
    let xmlhttp = new window.XMLHttpRequest()
    xmlhttp.open(type, url, true)
    xmlhttp.send(null)
    xmlhttp.onreadystatechange = function(res) {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        resolve(res.currentTarget.responseText)
      }
    }
  })
}

 /**
 * @description: 请求路径数据
 * @date: 2021-5-21 14:14:13
 */
function requestRouteData () {
  return new Promise((resolve, reject) => {
    let url = `http://127.0.0.1:8032/geoserver/${workspace}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layerName}&bbox=${extent.toString()}&width=768&height=330&srs=EPSG:4326&format=geojson&viewParams=x1:${startCoords[0]};y1:${startCoords[1]};x2:${endCoords[0]};y2:${endCoords[1]}`
    console.log('请求路径数据地址：', url)
    $ajax('get', url).then(response => {
      let routeDate = JSON.parse(JSON.stringify(response))
      console .log('请求到的路径数据：', routeDate)
      resolve(routeDate)
    }).catch(error => {
      reject('请求路径数据失败', error, )
    })
  })
}