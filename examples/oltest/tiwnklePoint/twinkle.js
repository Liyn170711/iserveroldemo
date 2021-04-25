/** 
 * openlayers 实现闪烁点动画
*/

var map
var pointCoordinates = [
  [108.94729614257812, 34.36609268188477],
  [108.83914947509766, 34.34412002563477],
  [108.78971099853516, 34.25554275512696],
  [108.88618469238281, 34.19134140014649],
  [108.99810791015625, 34.1971778869629],
  [109.08016204833984, 34.278888702392585],
  [108.94248962402344, 34.278888702392585],
  [108.94248962402344, 34.23425674438477],
  [108.88275146484375, 34.255199432373054],
  [109.01012420654297, 34.27133560180665]
]
var points = [
  { name: 'twinkle001', lnglat: ['108.94729614257812', '34.36609268188477'], color: '#ccff00', type: 'circle', speed: 0.2},
  { name: 'twinkle002', lnglat: ['108.83914947509766', '34.34412002563477'], color: '#ccff00', type: 'ellipse', speed: 0.2},
  { name: 'twinkle003', lnglat: ['108.78971099853516', '34.25554275512696'], color: '#00ccff', type: 'circle', speed: 0.2},
  { name: 'twinkle004', lnglat: ['108.88618469238281', '34.19134140014649'], color: '#00ccff', type: 'ellipse', speed: 0.2},
  { name: 'twinkle005', lnglat: ['108.99810791015625', '34.1971778869629'], color: '#00ffff', type: 'circle', speed: 0.2},
  { name: 'twinkle006', lnglat: ['109.08016204833984', '34.278888702392585'], color: '#00ffff', type: 'ellipse', speed: 0.2},
  { name: 'twinkle007', lnglat: ['108.94248962402344', '34.278888702392585'], color: '#ff00ff', type: 'circle', speed: 0.2},
  { name: 'twinkle008', lnglat: ['108.94248962402344', '34.23425674438477'], color: '#ff00ff', type: 'ellipse', speed: 0.2},
  { name: 'twinkle009', lnglat: ['108.88275146484375', '34.255199432373054'], color: '#ffff00', type: 'circle', speed: 0.2},
  { name: 'twinkle010', lnglat: ['109.01012420654297', '34.27133560180665'], color: '#ffff00', type: 'ellipse', speed: 0.2}
]

 /**
 * @description: 加载地图
 * @date: 2020-4-27 16:08:43
 */
function loadMap () {
  // 瓦片底图
  var baseLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
  });
  map = new ol.Map({
      target: "map",
      layers: [   baseLayer,
              ],
      view: new ol.View({
          center: [108.939819, 34.37271],
          maxZoom: 19,
          zoom: 12,
          projection: 'EPSG:4326'
      })
  })
  map.on('click', ev => {
      console.log('点击的位置坐标：', ev.coordinate)
  })
  // addTwinklePointsByOverlay() // 添加闪烁点到地图中，通过 overlay+css3 实现
  twinklePointsByCanvas() // 添加闪烁点到地图中，通过 canvas动画 实现
}

 /**
 * @description: 添加闪烁点到地图中，通过 overlay+css3 实现
 * @date: 2020-4-27 16:23:13
 */
function addTwinklePointsByOverlay () {
  for (var i = 0; i < pointCoordinates.length; i++) {
    var element = document.createElement('div')
    element.classList.add('animate-overlay')
    var overlay = new ol.Overlay({
      element: element,
    })
    overlay.setPosition(pointCoordinates[i])
    map.addOverlay(overlay)
  }
}

 /**
 * @description: 添加闪烁点到地图中，通过 canvas动画 实现
 * @date: 2020-4-28 11:14:48
 */
function twinklePointsByCanvas () {
  new FlashMarker(map, points);
}