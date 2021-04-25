/** 
 * 通过基于自定义的切片网格的 capabilities 加载地图
 * 加载思路：获取到 wmts-getcapabilities.xml 信息后，手动解析需要的信息
*/
fetch('http://192.168.22.51:8089/geoserver/gwc/service/wmts?REQUEST=getcapabilities').then((response) => {
    return response.text();
  }).then((text) => {
    // console.log('响应信息 wmts-getcapabilities.xml：', text)
    var parser = new ol.format.WMTSCapabilities()
    var result = parser.read(text)
    console.log('解析响应后的xml信息：', result)
    let wmtsParams = getWMTSParams('bstar:bxq1', 'bxq1', result)
    let {center, extent, format, layer, matrixIds, matrixSet, origin, origins, projection, resolutions, style, tileSize, url } = wmtsParams
    // WMTS 数据源
    let WMTSSource = new ol.source.WMTS({
      url,
      layer: layer,
      matrixSet: matrixSet,
      format: format,
      projection: projection,
      tileGrid: new ol.tilegrid.WMTS({
        tileSize: tileSize,
        extent: extent,
        origin,
        // origins,
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      // style: style,
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

  /**
   * 获取WMTS参数
   * @param {*} layer 图层
   * @param {*} matrixSet 网格矩阵
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
    params.extent = targetLayer.WGS84BoundingBox // 边界
    params.origin = [targetLayer.WGS84BoundingBox[0], targetLayer.WGS84BoundingBox[3]] // 切片起点
    params.center = [(targetLayer.WGS84BoundingBox[0] + targetLayer.WGS84BoundingBox[2]) / 2.0, (targetLayer.WGS84BoundingBox[1] + targetLayer.WGS84BoundingBox[3]) / 2.0] // 中心点
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
    console.log('解析到的 WMTS 服务的参数信息：', params)
    return params
  }