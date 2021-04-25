/** 
 * openlayers 加载 geoserver 发布的百度tif图片（基于BD09 墨卡托坐标）
 * 实验结果：加载的坐标偏移严重，无法用于带有gps经纬度相关显示的应用
*/
var parserResult = null // 解析到的wmts能力集对象
var map = null // 地图实例
var initZoom = 0 // 初始化缩放级别

/*定义百度投影，这是实现无偏移加载百度地图离线瓦片核心所在。
     网上很多相关资料在用OpenLayers加载百度地图离线瓦片时都认为投影就是EPSG:3857(也就是Web墨卡托投影)。
     事实上这是错误的，因此无法做到无偏移加载。
     百度地图有自己独特的投影体系，必须在OpenLayers中自定义百度投影，才能实现无偏移加载。
     百度投影实现的核心文件为bd09.js，在迈高图官网可以找到查看这个文件。*/
    var projBD09 = new ol.proj.Projection({
        code: 'BD:09',
        extent : [-20037726.37,-11708041.66,20037726.37,12474104.17],
        units: 'm',
        axisOrientation: 'neu',
        global: false
    });   
                  
    ol.proj.addProjection(projBD09);
    ol.proj.addCoordinateTransforms("EPSG:4326", "BD:09",
        function (coordinate) {
            return lngLatToMercator(coordinate);
        },
        function (coordinate) {
           return mercatorToLngLat(coordinate);
        }
   );

fetch('http://127.0.0.1:8012/geoserver/gwc/service/wmts?REQUEST=getcapabilities').then((response) => {
    return response.text();
  }).then((text) => {
    // console.log('响应信息 wmts-getcapabilities.xml：', text)
    var parser = new ol.format.WMTSCapabilities()
    parserResult = parser.read(text)
    console.log('解析响应后的xml信息：', parserResult)
    let wmtsParams = getWMTSParams('bdtif:baidu-tif-18', 'rmdxbd', parserResult)
    let {center, extent, projection, resolutions, minZoom, maxZoom } = wmtsParams
    // 地图视图
    let view = new ol.View({
      center: [12948734.184238855, 4834830.741590464],
      extent,
      zoom: initZoom,
      minZoom: minZoom,
      maxZoom: maxZoom,
      resolutions,
      projection: 'BD:09' // 坐标系
    })
    // 构造地图
    map = new ol.Map({
      target: 'map',
      view: view
    });
    map.getView().on('change:resolution', ev => {
      var zoom = map.getView().getZoom()
      var center = map.getView().getCenter()
      var extent = map.getView().calculateExtent(map.getSize())
      console.log('zoom: ', zoom)
      console.log('center: ', center)
      console.log('extent: ', extent)
      if (Number.isInteger(zoom)) {
        controlLayerShow(zoom)
      }
    })
    addWMTSLayer('bdtif:baidu-tif-18', 'rmdxbd')
    addWMTSLayer('bdtif:baidu-tif-19', 'rmdxbd')
    addWMTSLayer('bdtif:baidu-tif-20', 'rmdxbd')
    controlLayerShow(initZoom)
    addTestBD09MCMarkers() // 测试添加 百度墨卡托 标注
    addTestMGS84MCMarkers() // 测试添加 WGS84墨卡托 标注
    addTestMGS84Markers() // 测试添加 WGS84 标注
    regMapListeners() // 注册地图监听
  })

/**
 * 控制图层显示
 * @param {*} zoom 缩放级别
 * @date 2019-9-11 17:23:25
 */
function controlLayerShow(zoom) {
  console.log('控制图层显隐')
  let layers = map.getLayers().getArray() // 获取地图所有图层
  for (let layer of layers) {
    let id = layer.get('id')
    if (id && id.indexOf('bdtif:baidu-tif') > -1) {
      layer.setVisible(false)
      if (zoom === 0) {
        id === 'bdtif:baidu-tif-18' && layer.setVisible(true)
      } else if (zoom === 1) {
        id === 'bdtif:baidu-tif-19' && layer.setVisible(true)
      } else if (zoom === 2) {
        id === 'bdtif:baidu-tif-20' && layer.setVisible(true)
      }
    }
  }
}

/**
 * 加载WMTS图层
 * @param {*} layerName 图层名称
 * @param {*} matrixSetName 网格矩阵名称
 * @date 2019-9-11 17:23:25
 */
function addWMTSLayer(layerName, matrixSetName) {
  let wmtsParams = getWMTSParams(layerName, matrixSetName, parserResult)
  let {center, extent, format, layer, matrixIds, matrixSet, origin, origins, projection, resolutions, style, tileSize, url } = wmtsParams
  // WMTS 数据源
  let WMTSSource = new ol.source.WMTS({
    url,
    layer: layer,
    matrixSet: matrixSet,
    format: format,
    projection: 'BD:09',
    tileGrid: new ol.tilegrid.WMTS({
      tileSize: tileSize,
      extent: extent,
      origin,
      resolutions: resolutions,
      matrixIds: matrixIds
    }),
    style: '',
    wrapX: true
  })
  let wmtsLayer = new ol.layer.Tile({
    opacity: 1,
    source: WMTSSource
  })
  wmtsLayer.set('id', layerName)
  wmtsLayer.setVisible(false)
  map.addLayer(wmtsLayer)
}

/**
 * 获取WMTS参数
 * @param {*} layer 图层
 * @param {*} matrixSet 网格矩阵
 * @param {*} capabilities wmts服务能力集
 * @date 2019-9-11 17:21:36
 */
function getWMTSParams(layer, matrixSet, capabilities) {
  console.log('获取图层：', layer, '，切片网格矩阵：', matrixSet, '的 WMTS 服务参数！！！')
  let params = {} // WMTS参数
  let layers = capabilities.Contents.Layer // 图层
  let tileMatrixSets = capabilities.Contents.TileMatrixSet // 瓦片矩阵集
  let serviceProvider = capabilities.ServiceProvider // 服务提供者
  let targetLayer = layers.find(item => layer === item.Identifier)
  console.log('目标图层信息：', targetLayer)
  let targetMatrixSet = tileMatrixSets.find(item => matrixSet === item.Identifier)
  console.log('目标网格矩阵信息：', targetMatrixSet)
  params.url = serviceProvider.ProviderName // 服务地址
  params.layer = layer // 图层
  params.matrixSet = matrixSet // 网格矩阵 
  params.style = targetLayer.Style // 网格矩阵 
  params.projection = targetMatrixSet.SupportedCRS.split('crs:')[1].replace('::', ':') // 投影坐标系
  params.format = (targetLayer.Format && targetLayer.Format.length) ? targetLayer.Format[0] : 'image/png' // 格式
  let boundingExtent = targetLayer.WGS84BoundingBox // 边界
  // if (params.projection !== 'EPSG:4326') {
  //   let leftBottom = ol.proj.transform([boundingExtent[0], boundingExtent[1]], 'EPSG:4326', params.projection)
  //   let rightTop = ol.proj.transform([boundingExtent[2], boundingExtent[3]], 'EPSG:4326', params.projection)
  //   boundingExtent = [leftBottom[0], leftBottom[1], rightTop[0], rightTop[1]]
  // }
  params.extent = [12948023.927538779, 4834306.281981311, 12949601.153272854, 4835340.819607693] // 边界
  params.origin = [params.extent[0], params.extent[3]] // 切片起点
  params.center = [(params.extent[0] + params.extent[2]) / 2.0, (params.extent[1] + params.extent[3]) / 2.0] // 中心点
  let resolutions = []
  let matrixIds = []
  let tileSize = []
  let origins = [] // 网格矩阵不同级别切片起点
  for (const tileMatrix of targetMatrixSet.TileMatrix) {
    tileSize = [tileMatrix.TileWidth, tileMatrix.TileHeight]
    resolutions.push(Number(tileMatrix.Identifier))
    matrixIds.push(tileMatrix.Identifier)
    origins.push(tileMatrix.TopLeftCorner)
  }
  params.tileSize = tileSize // 瓦片大小
  params.resolutions = resolutions // 分辨率组
  params.matrixIds = matrixIds // 网格矩阵标识数组
  params.origins = origins // 网格矩阵的不同级别切片起点
  params.minZoom = 0 // 最小缩放级别
  params.maxZoom = params.origins.length - 1 // 最大缩放级别
  console.log('解析到的 WMTS 服务的参数信息：', params)
  return params
}

 /**
 * @description: 添加标注
 * @date: 2019-9-18 14:48:28
 */
function addMarkers (coords, type) {
  let markerSource = new ol.source.Vector({ wrapX: false });
  let markerLayer = new ol.layer.Vector({
    source: markerSource,
    style: markerVectorStyle
  });
  map.addLayer(markerLayer)
  for (let i = 0; i < coords.length; i++) {
    let pointFeature = new ol.Feature({
      type: type,
      label: type + '_' + i,
      geometry: new ol.geom.Point(coords[i]),
    });
    markerSource.addFeature(pointFeature)
  }
}

 /**
 * @description: 测试添加 百度墨卡托 标注
 * @date: 2019-9-18 14:54:27
 */
function addTestBD09MCMarkers() {
  const BD09MCCoords = [[12948727.717899508774281, 4834792.035713103599846], [12948713.636692926287651, 4834790.694645809940994]]
  addMarkers(BD09MCCoords, 'BD09MC')
}

 /**
 * @description: 测试添加 WGS84墨卡托 标注
 * @date: 2019-9-18 14:54:27
 */
function addTestMGS84MCMarkers() {
  const BD09MCCoords = [[12948726.649505430832505, 4834794.873745935037732], [12948726.263909634202719, 4834756.852395731024444]]
  addMarkers(BD09MCCoords, "WGS84MC")
}

 /**
 * @description: 测试添加 WGS84 标注
 * @date: 2019年10月9日14:15:08
 */
function addTestMGS84Markers() {
  let gcj02_1 = wgs84togcj02(116.306572664470409, 39.969101399465927)
  let bd09_1 = gcj02tobd09(gcj02_1[0], gcj02_1[1])
  let gcj02_2 = wgs84togcj02(116.306541569293159, 39.969099096119464)
  let bd09_2 = gcj02tobd09(gcj02_2[0], gcj02_2[1])
  let coords1 = ol.proj.transform(bd09_1, 'EPSG:4326', 'BD:09')
  let coords2 = ol.proj.transform(bd09_2, 'EPSG:4326', 'BD:09')
  console.log('coords1:', coords1)
  console.log('coords2:', coords2)
  const BD09MCCoords = [coords1, coords2]
  addMarkers(BD09MCCoords, "WGS84")
}

/**
 * @description: 矢量标注图层样式
 * @param feature 要素样式
 * @date: 2019-9-18 16:09:34
 */
function markerVectorStyle(feature) {
  let type = feature.get("type");
  let label = feature.get("label");
  let param = {imgSrc: '../../../../img/marker.png', label}
  switch (type) {
    case "BD09MC":
      param.imgSrc = '../../../../img/marker-gold.png'
      param.color = 'rgba(255, 0, 0, 0.8)'
      return markerStyle(param); // 路线样式
    case "WGS84MC":
      param.imgSrc = '../../../../img/marker-icon.png'
      param.color = 'rgba(0, 0, 255, 0.8)'
      return markerStyle(param); // 节点图标样式
    case "WGS84":
      param.imgSrc = '../../../../img/marker.png'
      param.color = 'rgba(255, 0, 255, 0.8)'
      return markerStyle(param); // 节点图标样式
  }
}

/**
 * @description: 标注样式
 * @param param 样式参数
 * @date: 2019-9-18 16:09:34
 */
function markerStyle(param) {
  const {imgSrc, label, color} = param
  let style = new ol.style.Style({
    image:  new ol.style.Icon({
      src: imgSrc,
      scale: 1
    }),
    text: new ol.style.Text({
      font: '12px courier',
      text: label,
      offsetY: 24,
      stroke: new ol.style.Stroke({
        color: color
      }),
    }),
    zIndex: 1999
  });
  return style
}

/**
 * @description: 注册地图监听
 * @date: 2019-9-18 16:51:02
 */
function regMapListeners() {
  map.on('click', event => {
    console.log('监听到了地图点击事件,点击坐标：', event.coordinate)
  })
}