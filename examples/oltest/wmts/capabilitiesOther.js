let url = 'http://127.0.0.1:8012/geoserver/gwc/service/wmts'
let layer = 'bdtif:baidu-tif-18'
let projection = 'EPSG:3857'
let matrixSet = 'rmdxbd'
let format = 'image/png'
let zoom = 1

fetch(`${url}?REQUEST=getcapabilities`).then((response) => { //
  return response.text();
}).then((text) => {
  let parser = new ol.format.WMTSCapabilities()
  let result = parser.read(text)
  console.log('解析响应后的xml信息：', result)
  let tileGridInfo = getTileGrid(result, {layer, projection, matrixSet})
  let {extent ,tileGrid} = tileGridInfo
  let center = [(12948023.927538779 + 12949601.153272854) / 2.0, (4834306.281981311 + 4835340.819607693) / 2.0]
  console.log('获取到的切片网格信息', tileGrid)
  debugger
  let WMTSSource = new ol.source.WMTS({
    url,
    layer,
    matrixSet,
    format,
    projection,
    tileGrid,
    style: '',
    wrapX: true
  })
  // 构造地图
  new ol.Map({
    target: 'map',
    view: new ol.View({
      center,
      zoom,
      projection // 坐标系
    }),
    layers: [
      new ol.layer.Tile({
        opacity: 1,
        source: WMTSSource
      })
    ],
  });
})

// 获取切片网格信息
function getTileGrid(wmtsCap, config) {
  let {layer, projection, matrixSet} = config
  let layers = wmtsCap['Contents']['Layer']
  let targetlayer = layers.find(item => item['Identifier'] === layer)
  if (targetlayer) {
    let matrixLimits  /**切片网格分级信息 @type {Array.<Object>} */
    let tileMatrixSets = wmtsCap['Contents']['TileMatrixSet']
    let idx // 目标切片网格的索引（在目标图层支持的切片方案中的索引）
    if (targetlayer['TileMatrixSetLink'].length > 1) {
        idx = targetlayer['TileMatrixSetLink'].findIndex(link => {
          if (projection) { // 传入坐标系时根据坐标系确定切片网格的索引
            let tileMatrixSet = tileMatrixSets.find(set => set['Identifier'] === link['TileMatrixSet'])
            let supportedCRS = tileMatrixSet['SupportedCRS'] // 获取切片网格坐标系信息
            let proj1 = ol.proj.get(supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || ol.proj.get(supportedCRS)
            let proj2 = ol.proj.get(projection)
            if (proj1 && proj2) {
              return ol.proj.equivalent(proj1, proj2)
            } else {
              return supportedCRS === config['projection']
            }
          } else { // 未传入坐标系时根据切片网格确定切片网格的索引
            return link['TileMatrixSet'] === matrixSet
          }
        })
    } else {
      idx = 0
    }
    idx = idx < 0 ? 0 : idx
    matrixSet = targetlayer['TileMatrixSetLink'][idx]['TileMatrixSet']  /** 切片网格标识 @type {string} */
    matrixLimits = targetlayer['TileMatrixSetLink'][idx]['TileMatrixSetLimits']  /** 切片网格分级信息 @type {Array.<Object>} */
    let matrixSetObj = tileMatrixSets.find(set => set['Identifier'] === matrixSet) /** 切片方案信息 @type {string} */
    let projectionCode = matrixSetObj['SupportedCRS'] /** 切片方案中的参考坐标系编码 @type {string} */
    let targetProjection // 切片方案中的坐标系
    if (projectionCode) {
      targetProjection = ol.proj.get(projectionCode.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || ol.proj.get(projectionCode)
    } 
    if (projection) {
      let projConfig = ol.proj.get(projection)
      targetProjection = projConfig && (!targetProjection || ol.proj.equivalent(projConfig, projConfig)) ? projConfig : targetProjection
    } 
    let extent /** 对应参考坐标系下图层边界 @type {!Array.<number>} */
    if (targetlayer['WGS84BoundingBox']) {
      let wgs84BoundingBox = targetlayer['WGS84BoundingBox'] // WGS84坐标系下图层边界
      extent = ol.proj.transformExtent(wgs84BoundingBox, 'EPSG:4326', targetProjection) // 坐标转换
    }
    let tileGrid = ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet(matrixSetObj, extent, matrixLimits)
    return {extent, tileGrid}
  }
}