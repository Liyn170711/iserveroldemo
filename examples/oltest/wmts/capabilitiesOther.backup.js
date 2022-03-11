  /** 
 * 通过 geowebcache 发布 基于自定义的切片网格的  wmts 地图服务
 * 加载思路：获取到 wmts-getcapabilities.xml 信息后，手动解析需要的信息
 * @notice: 
 * 1. 切片起点 origin，分辨率数组 resolutions 需要从切片网格的配置文件中解析得到（通过接口 http://192.168.22.51:8068/geowebcache/shwgy/conf.xml 获取）
 * 2. url 瓦片服务地址，参考投影坐标系 projection，图层范围 extent，瓦片大小 tileSize，瓦片网格切片方案 matrixSet， 切片网格方案标识数组 matrixIds，瓦片格式 format 等需要从 wmts-getcapabilities.xml 中解析得到
 * （通过接口 http://192.168.22.51:8068/geowebcache/service/wmts?REQUEST=getcapabilities 获取）
*/
fetch('http://192.168.22.51:8068/geowebcache/service/wmts?REQUEST=getcapabilities').then((response) => { //
  return response.text();
}).then((text) => {
  // console.log('响应信息 wmts-getcapabilities.xml：', text)
  // WMTS 数据源
  let url = 'http://192.168.22.51:8068/geowebcache/service/wmts'
  // let layer = 'shwgy'
  // let matrixSet = 'EPSG:4326_shwgy'
  let layer = 'beijingdemo102113'
  let matrixSet = 'EPSG:3857_beijingdemo102113'
  let format = 'image/png'
  // let projection = 'EPSG:4326'
  let projection = 'EPSG:102113'
  let tileSize = [256, 256]
  // let extent = [121.477994800307, 31.274321923331385, 121.4895494629513, 31.28050852194648]
  // let center = [121.48377213162915, 31.277415222638933]
  // let origin = [-400, 400]
  // let resolutions = [1.9035688046642237e-005, 9.5178440233211185e-006, 4.7589220116605593e-006, 2.3794610058302796e-006, 1.1897305029151398e-006]
  // let matrixIds = ['EPSG:4326_shwgy:0', 'EPSG:4326_shwgy:1', 'EPSG:4326_shwgy:2', 'EPSG:4326_shwgy:3', 'EPSG:4326_shwgy:4']
  let lowerCorner = ol.proj.transform([116.29798565038375, 40.09605808679872], "EPSG:4326", "EPSG:102113")
  let lowerCorner1 = ol.proj.transform(
    [116.29798565038375, 40.09605808679872],
    "EPSG:4326",
    "EPSG:3857"
  )
  console.log('lowerCorner: ', lowerCorner)
  console.log('lowerCorner1: ', lowerCorner1)
  let upperCorner = ol.proj.transform(
    [116.31028092727243, 40.101688001512834],
    "EPSG:4326",
    "EPSG:102113"
  )
  console.log('upperCorner: ', upperCorner)
  let extent = [lowerCorner[0], lowerCorner[1], upperCorner[0], upperCorner[1]]
  let center = [(lowerCorner[0] + upperCorner[0]) / 2.0, (lowerCorner[1] + upperCorner[1]) / 2.0]
  console.log('center: ', center)
  let origin = [-20037508.342787001, 20037508.342787001]
  let resolutions = [1.1943285668550503, 0.59716428355981721, 0.29858214164761665, 0.15875031750063501]
  let matrixIds = ['EPSG:3857_beijingdemo102113:0', 'EPSG:3857_beijingdemo102113:1', 'EPSG:3857_beijingdemo102113:2', 'EPSG:3857_beijingdemo102113:3']
  let WMTSSource = new ol.source.WMTS({
    url,
    layer,
    matrixSet,
    format,
    projection,
    tileGrid: new ol.tilegrid.WMTS({
      tileSize,
      extent,
      origin,
      resolutions,
      matrixIds
    }),
    style: '',
    wrapX: true
  })
  // 地图视图
  let view = new ol.View({
    center,
    extent,
    zoom: 1,
    resolutions,
    projection // 坐标系
  })
  // 构造地图
  new ol.Map({
    layers: [
      new ol.layer.Tile({
        opacity: 1,
        source: WMTSSource
      })
    ],
    target: 'map',
    view: view
  });
})