// 动态效果openlayers版本必须高于6
// 版本间问题：① 6.5.0样式函数颜色不支持使用变量赋值；②动态效果中样式图片不能直接使用src，通过使用img，传入构造image图片对象才能显示动态效果
var map
const ARROW_PIX_STEP = 100 // 箭头显示的步长（单位：像素，即：每隔多少个像素显示一个箭头）
let geoStep // 箭头显示的步长（单位：米，即：每隔多少米显示一个箭头）
let routeGeometry // 路径（单线）包含轨迹的所有坐标
let routeLength // 路径长度
let arrowNum // 箭头数量
var startCoords = [] // 路径起点坐标
var endCoords = [] // 路径终点坐标
let offset = 0.01 // 箭头点偏移量
const OFFSET_STEP = 0.001 // 箭头点偏移量的增量

/**
 * 路径规划的相关样式
 */
const buttomPathStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: [4, 110, 74],
    width: 10
  })
})
const upperPathStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: [0, 186, 107],
    width: 8
  })
})
// 箭头图标样式
let arrowIcon = (rotation) =>{
  var myImage = new Image(117, 117);
  myImage.src = '../../../img/path_arrow.png';
  return new ol.style.Icon({
    img: myImage,
    imgSize: [117, 117],
    scale: 0.06,
    rotateWithView: true,
    rotation: -rotation
  })
}
// 起点样式
const startPoint = () => {
  return new ol.style.Style({
    image: new ol.style.Circle({ // 定义点（起点、终点）的样式
      radius: 15,
      fill: new ol.style.Fill({
          color: 'green'
      })
    }),
    text: new ol.style.Text({ // 定义文本的样式
      text: '起',
      font:'bold 15px 微软雅黑',
      fill: new ol.style.Fill({
          color: '#ffffff'
      }),
      textAlign:'center',
      textBaseline:'middle'
    })
  })
}
// 终点样式
const endPoint = () => {
  return new ol.style.Style({
    image: new ol.style.Circle({ // 定义点（起点、终点）的样式
      radius: 15,
      fill: new ol.style.Fill({
          color: 'red'
      })
    }),
    text: new ol.style.Text({ // 定义文本的样式
      text: '终',
      font:'bold 15px 微软雅黑',
      fill: new ol.style.Fill({
          color: '#ffffff'
      }),
      textAlign:'center',
      textBaseline:'middle'
    })
  })
}

/**
 * @description: 初始化加载地图
 * @time: 2021-4-23 10:00:08
 */
function initMap() {
  let baseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({  
      url:'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'//7,8
    }),  
    projection: 'EPSG:3857' 
  })
  let view = new ol.View({
    // 地图视图
    center: [12957302.414606724, 4852760.584444312], // 中心点经纬度坐标
    maxZoom: 19, // 最大缩放等级
    zoom: 13, // 默认缩放等级
    projection: 'EPSG:3857'
  })
  map = new ol.Map({
    target: "map",
    layers: [ baseLayer ],
    view: view
  })
  let mapResolution = view.getResolution()
  // console.log('获取到当前地图的分辨率：', mapResolution)
  geoStep = ARROW_PIX_STEP * mapResolution // 当前地图分辨率每隔 geoStep 米 显示一个箭头
  // console.log('当前地图分辨率每隔', geoStep, ' m 显示一个箭头')
  view.on('change:resolution', handleMapResolutionChange) // 监听地图分辨率变化
  baseLayer.on('postrender', handleTileLayerPostRender)
}

/**  
 * 处理选点
 * @time 2021-4-22 10:26:17
 */
function handleSelectPoint(pointCoord) {
  map.once('singleclick', (event) => {
    console.log('鼠标点击的点坐标：', event.coordinate)
    this[pointCoord] = event.coordinate
    $(`#${pointCoord}`).text(event.coordinate.toString())
  })
}
/** 
 * 处理地图分辨率变化
 * 2021-4-20 13:47:16
 */
function handleMapResolutionChange(param) {
  console.log('处理地图分辨率变化', param)
  let mapResolution = map.getView().getResolution()
  // console.log('获取到当前地图的分辨率：', mapResolution)
  geoStep = ARROW_PIX_STEP * mapResolution // 当前地图分辨率每隔 geoStep 米 显示一个箭头
  arrowNum = parseInt(routeLength * 1.0 / geoStep) // 计算需要显示的箭头数量
  // console.log('当前地图分辨率每隔', geoStep, ' m 显示一个箭头')
}
 /**
 * @description: 处理瓦片图层渲染
 * @param: event
 * @time: 2021-4-23 13:33:08
 */
function handleTileLayerPostRender (event) {
  if (routeGeometry) {
    let isRouteIntersectMapExtent = routeGeometry.intersectsExtent(map.getView().calculateExtent(map.getSize())) // 路径是否在地图范围内
    if (isRouteIntersectMapExtent) {
      let vct = ol.render.getVectorContext(event)
      vct.drawFeature(new ol.Feature(routeGeometry), buttomPathStyle)
      vct.drawFeature(new ol.Feature(routeGeometry), upperPathStyle)
      let tree = new rbush()
      routeGeometry.forEachSegment((start, end) => {
        let dx = end[0] - start[0]
        let dy = end[1] - start[1]
        //计算每个segment的方向，即箭头旋转方向
        let rotation = Math.atan2(dy, dx)
        let geom = new ol.geom.LineString([start,end])
        let extent = geom.getExtent()
        let item = {
          minX: extent[0],
          minY: extent[1],
          maxX: extent[2],
          maxY: extent[3],
          geom: geom,
          rotation:rotation
        }
        tree.insert(item)
      })
      for(let i = 1; i < arrowNum; i++){
        let fracPos = (i * 1.0 / arrowNum) + offset
        if (fracPos > 1) fracPos -= 1
        let arraw_coor = routeGeometry.getCoordinateAt(fracPos)
        let tol = 10;//查询设置的点的容差，测试地图单位是米。如果是4326坐标系单位为度的话，改成0.0001.
        let arraw_coor_buffer = [arraw_coor[0]-tol, arraw_coor[1]-tol, arraw_coor[0]+tol, arraw_coor[1]+tol]
        //进行btree查询
        let treeSearch = tree.search({
          minX: arraw_coor_buffer[0],
          minY: arraw_coor_buffer[1],
          maxX: arraw_coor_buffer[2],
          maxY: arraw_coor_buffer[3]
        })
        let arrow_rotation
        //只查询一个，那么肯定是它了，直接返回
        if(treeSearch.length==1)
          arrow_rotation=treeSearch[0].rotation
        else if(treeSearch.length>1){
            let results = treeSearch.filter(function(item){
              //-----------箭头点与segment相交，返回结果。该方法实测不是很准，可能是计算中间结果
              //保存到小数精度导致查询有点问题
              // if(item.geom.intersectsCoordinate(arraw_coor))
              //   return true
              //--------换一种方案，设置一个稍小的容差，消除精度问题
              let _tol = 1 //消除精度误差的容差
              if(item.geom.intersectsExtent([arraw_coor[0]-_tol, arraw_coor[1]-_tol, arraw_coor[0]+_tol, arraw_coor[1]+_tol]))
                return true
            })
            if(results.length > 0) {
              arrow_rotation = results[0].rotation
            }
        }
        vct.setStyle(new ol.style.Style({
          image: arrowIcon(arrow_rotation)
        }))
        vct.drawGeometry(new ol.geom.Point(arraw_coor))
      }
      // 绘制起点
      vct.setStyle(startPoint())
      vct.drawGeometry(new ol.geom.Point(routeGeometry.getFirstCoordinate()))
      // 绘制终点
      vct.setStyle(endPoint())
      vct.drawGeometry(new ol.geom.Point(routeGeometry.getLastCoordinate()))

      offset = offset + OFFSET_STEP 
      //复位
      if (offset >= 1) offset = 0.001
      map.render()
    }
  }
}
// 路径规划
function routePlanning() {
   // let url = 'https://restapi.amap.com/v3/direction/driving?origin=116.379028,39.865042&destination=116.427281,39.903719&extensions=&s=rsv3&strategy=0&ferry=0&key=c9151976e65cdc5004b24b61ce7504d2&callback=jsonp_153836_&platform=JS&logversion=2.0&appname=https%3A%2F%2Flbs.amap.com%2Fdemo%2Fjavascript-api%2Fexample%2Fdriving-route%2Fplan-route-according-to-lnglat&csid=9286C409-3381-4847-BBEE-EF2B902043DD&sdkversion=1.4.15'
   let url = 'https://restapi.amap.com/v3/direction/driving?origin=116.30658030509949,39.97258543968201&destination=116.32529139518739,39.973915815353394&extensions=&s=rsv3&strategy=0&ferry=0&key=c9151976e65cdc5004b24b61ce7504d2&callback=jsonp_153836_&platform=JS&logversion=2.0&appname=https%3A%2F%2Flbs.amap.com%2Fdemo%2Fjavascript-api%2Fexample%2Fdriving-route%2Fplan-route-according-to-lnglat&csid=9286C409-3381-4847-BBEE-EF2B902043DD&sdkversion=1.4.15'
   if (startCoords.toString() && endCoords.toString()) {
     let origin = ol.proj.transform(startCoords, 'EPSG:3857', 'EPSG:4326')
     let destination = ol.proj.transform(endCoords,'EPSG:3857', 'EPSG:4326')
     url = `https://restapi.amap.com/v3/direction/driving?origin=${origin.toString()}&destination=${destination.toString()}&extensions=&s=rsv3&strategy=0&ferry=0&key=c9151976e65cdc5004b24b61ce7504d2&callback=jsonp_153836_&platform=JS&logversion=2.0&appname=https%3A%2F%2Flbs.amap.com%2Fdemo%2Fjavascript-api%2Fexample%2Fdriving-route%2Fplan-route-according-to-lnglat&csid=9286C409-3381-4847-BBEE-EF2B902043DD&sdkversion=1.4.15`
   }
   let xmlhttp = new window.XMLHttpRequest()
    xmlhttp.open('get', url, true)
    xmlhttp.send(null)
    xmlhttp.onreadystatechange = function(res) {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let response = res.currentTarget.responseText
        let respJson = JSON.parse(response.substring(response.indexOf('(')+1,response.lastIndexOf(')')))
        drawRouteFeature(respJson)
      }
    }
}
// 绘制路径
function drawRouteFeature(respData) {
  let routeData = respData.route
  // console.log('获取到的路径规划数据：', routeData)
  let {paths} = routeData
  // 构造最优路径需要展示的要素
  let steps = paths[0].steps // 此处只展示最优路径
  let routeCoords = [] // 轨迹坐标
  for (const step of steps) {
    let tmcs = step.tmcs
    for (const tmc of tmcs) {
      let {polyline} = tmc
      let points = polyline.split(';')
      for (const point of points) {
        let coord= ol.proj.transform(point.split(',').map(item => Number(item)), 'EPSG:4326', 'EPSG:3857')
        routeCoords.push(coord)
      }
    }
  }
  // 构造最优路径图层
  routeGeometry = new ol.geom.LineString(routeCoords) // 路径（单线）包含轨迹的所有坐标
  routeLength = routeGeometry.getLength() // 计算路径长度
  arrowNum = parseInt(routeLength * 1.0 / geoStep) // 计算需要显示的箭头数量
  map.getView().fit(routeGeometry.getExtent()) // 地图定位到路径所在位置
}