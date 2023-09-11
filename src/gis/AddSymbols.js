// 用户添加小品
import S3MInstanceCollectionEx from "./supermapExtend/S3MInstanceCollectionEx";

let viewer;
let handlerPoint;
let handlerPolygon;
let defaultUrl = './SampleData/models/springTree.s3m';

export default class AddSymbols {

    // 初始化添加小品
    static init(paramViewer) {
        viewer = paramViewer;
        var viewModel = {
            heading: 1.0,
            pitch: 1.0,
            roll: 1.0,
            scale: 1.0,
            material: '#ffffff',
        };
        document.getElementById("styleSetting").onclick = function () {
            var $el = $('#dropdown');
            if ($el.hasClass('dropdown-visible')) {
                $('#dropdown').removeClass('dropdown-visible');
            }
            else {
                $('#dropdown').removeClass('dropdown-visible').addClass('dropdown-visible');
            }
        };
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('wrapper');
        Cesium.knockout.applyBindings(viewModel, toolbar);
        Cesium.knockout.getObservable(viewModel, 'heading').subscribe(
            function (newValue) {
                var rotationValue = Cesium.Math.toRadians(newValue);
                if (viewer.selectedEntity) {
                    var instance = viewer.selectedEntity.primitive;
                    var index = viewer.selectedEntity.id;
                    instance.updateRotation(new Cesium.HeadingPitchRoll(rotationValue, 0, 0), index);
                }
            }
        );
        Cesium.knockout.getObservable(viewModel, 'pitch').subscribe(
            function (newValue) {
                var rotationValue = Cesium.Math.toRadians(newValue);
                if (viewer.selectedEntity) {
                    var instance = viewer.selectedEntity.primitive;
                    var index = viewer.selectedEntity.id;
                    instance.updateRotation(new Cesium.HeadingPitchRoll(0, rotationValue, 0), index);
                }
            }
        );
        Cesium.knockout.getObservable(viewModel, 'roll').subscribe(
            function (newValue) {
                var rotationValue = Cesium.Math.toRadians(newValue);
                if (viewer.selectedEntity) {
                    var instance = viewer.selectedEntity.primitive;
                    var index = viewer.selectedEntity.id;
                    instance.updateRotation(new Cesium.HeadingPitchRoll(0, 0, rotationValue), index);
                }
            }
        );
        Cesium.knockout.getObservable(viewModel, 'scale').subscribe(
            function (newValue) {
                var scale = parseFloat(newValue);
                if (viewer.selectedEntity) {
                    var instance = viewer.selectedEntity.primitive;
                    var index = viewer.selectedEntity.id;
                    instance.updateScale(new Cesium.Cartesian3(scale, scale, scale), index);
                }
            }
        );
        Cesium.knockout.getObservable(viewModel, 'material').subscribe(
            function (newValue) {
                var color = Cesium.Color.fromCssColorString(newValue);
                if (viewer.selectedEntity) {
                    var instance = viewer.selectedEntity.primitive;
                    var index = viewer.selectedEntity.id;
                    instance.updateColor(color, index);
                }
            }
        );
        Cesium.loadJson('data/models.json').then(function (data) {
            debugger;
            var result = data.s3mModels;
            for (var i = 0, j = result.length; i < j; i++) {
                addItem(result[i]);
            }
        });

        function addItem(data) {
            var str = '<a><img style="width: 18%;height: 100%; margin-top:5px; margin-bottom:5px;" src={thumbnail} id={name}></a>'.replace('{thumbnail}', data.thumbnail).replace('{name}', data.name);
            var $el = $('#icons').append(str);
            var $child = $("#" + data.name);
            $child.on('click', function () {
                defaultUrl = data.path;
                if ($("img").hasClass("selected")) {
                    $("img").removeClass("selected");
                    handlerPolygon && handlerPolygon.deactivate();
                }
                else {
                    handlerPoint && handlerPoint.activate();
                    $(this).addClass("selected");
                }
            });
        }
    }

    // 执行添加小品
    static addSymbols(viewer, scene) {
        debugger;
        if (!scene.pickPositionSupported) {
            alert('不支持深度纹理,无法进行鼠标交互绘制！');
        }
        var tooltip = createTooltip(document.body);

        handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon)
        this.handlerPolygon = handlerPolygon;
        var layer = scene.layers.find('srsb'); // 获取倾斜摄影图层
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
            if (windowPosition.x < 210 && windowPosition.y < 120) {
                tooltip.setVisible(false);
                return;
            }
            if (handlerPolygon.isDrawing) {
                tooltip.showAt(windowPosition, '<p>点击确定压平区域中间点</p><p>右键单击结束绘制</p>');
            }
            else {
                tooltip.showAt(windowPosition, '<p>点击绘制压平区域第一个点</p>');
            }
        });
        handlerPolygon.drawEvt.addEventListener(function (result) {
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            var polygon = result.object;
            var positions = polygon.positions;
            var flatPoints = [];
            for (var i = 0, j = positions.length; i < j; i++) {
                var position = positions[i];
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var lon = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;
                flatPoints.push(lon);
                flatPoints.push(lat);
                flatPoints.push(height);
            }
            layer.addFlattenRegion({
                position: flatPoints,
                name: 'flatten' + Math.random()
            });
            tooltip.setVisible(false);
            // handlerPolygon.deactivate();
        });

        handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
        handlerPoint.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });

        handlerPoint.movingEvt.addEventListener(function (windowPosition) {
            if (windowPosition.x < 210 && windowPosition.y < 120) {
                tooltip.setVisible(false);
                return;
            }
            tooltip.showAt(windowPosition, '<p>点击添加小品</p>');
        });
        var s3mInstanceColc = new S3MInstanceCollectionEx(viewer);
        scene.primitives.add(s3mInstanceColc);
        handlerPoint.drawEvt.addEventListener(function (result) {
            debugger;
            handlerPoint.clear();
            var point = result.object;
            var color = Cesium.Color.WHITE;
            s3mInstanceColc.add(defaultUrl, {
                position: point.position,
                hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                scale: new Cesium.Cartesian3(1, 1, 1),
                color: color
            });
            var colorStr = color.toCssColorString();
            // viewModel.material = colorStr;
            $('#colorPicker').css({
                color: colorStr
            });
            $("img").removeClass("selected");
            handlerPoint && handlerPoint.deactivate();
            tooltip.setVisible(false);
        });

        document.getElementById("flatten").onclick = function () {
            handlerPoint && handlerPoint.deactivate();
            handlerPolygon && handlerPolygon.activate();
        };

        viewer.selectedEntityChanged.addEventListener(function (entity) {
            $("#positionX").val(0);
            $("#positionY").val(0);
            $("#positionZ").val(0);
        });
    }

    // 执行添加小品后扩展
    static afterExtend() {
        debugger;
        $("#styleSetting").click(function () {
            if ($(".level-one").hasClass("selected")) {
                $(".level-one").removeClass("selected");
            }

            $("#styleSetting").addClass("selected");
            $("#wrapper").show();
            handlerPolygon.deactivate();
        });

        $("#flatten").click(function () {
            if ($(".level-one").hasClass("selected")) {
                $(".level-one").removeClass("selected");
            }
            $("#wrapper").hide();
            $("#flatten").addClass("selected");
        })
        $(".close").click(function () {
            $("#wrapper").hide();
            $("#styleSetting").removeClass("selected");
        });
        $("#delete").click(function () {
            if (viewer.selectedEntity) {
                var instance = viewer.selectedEntity.primitive;
                var index = viewer.selectedEntity.id;
                instance.updateScale(new Cesium.Cartesian3(0, 0, 0), index);
            }
        });
        $("#colorPicker").spectrum({
            color: "ffffff",
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        $("#XPlus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var x = parseInt(document.getElementById("positionX").value);
                x++;
                document.getElementById("positionX").value = x;

                var curInstance = viewer.selectedEntity.primitive;
                var index = viewer.selectedEntity.id;

                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position, Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(x, 0, 0);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);
            }
        });
        $("#XMinus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var x = parseInt(document.getElementById("positionX").value);
                x--;
                document.getElementById("positionX").value = x;
                var curInstance=viewer.selectedEntity.primitive;
                var index =viewer.selectedEntity.id;

                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position,Cesium.Ellipsoid.WGS84,new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(x, 0, 0);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);
            }
        });
        $("#YPlus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var y = parseInt(document.getElementById("positionY").value);
                y++;
                document.getElementById("positionY").value = y;
                var curInstance=viewer.selectedEntity.primitive;
                var index =viewer.selectedEntity.id;
                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position,Cesium.Ellipsoid.WGS84,new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(0, y, 0);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);
            }
        });
        $("#YMinus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var y = parseInt(document.getElementById("positionY").value);
                y--;
                document.getElementById("positionY").value = y;
                var curInstance=viewer.selectedEntity.primitive;
                var index =viewer.selectedEntity.id;
                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position,Cesium.Ellipsoid.WGS84,new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(0, y, 0);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);
            }
        });
        $("#ZPlus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var z = parseInt(document.getElementById("positionZ").value);
                z++;
                document.getElementById("positionZ").value = z;
                var curInstance=viewer.selectedEntity.primitive;
                var index =viewer.selectedEntity.id;
                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position,Cesium.Ellipsoid.WGS84,new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(0, 0, z);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);

                //更新json文件

                var item= getJsonItem(result,"GUID",index);
                item.Height=z;
            }
        });
        $("#ZMinus").click(function () {
            debugger
            if (viewer.selectedEntity) {
                var z = parseInt(document.getElementById("positionZ").value);
                z--;
                document.getElementById("positionZ").value = z;
                var curInstance=viewer.selectedEntity.primitive;
                var index =viewer.selectedEntity.id;
                var enu = Cesium.Transforms.eastNorthUpToFixedFrame(curInstance.position,Cesium.Ellipsoid.WGS84,new Cesium.Matrix4());
                var offset = new Cesium.Cartesian3(0, 0, z);
                var newPos = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3());
                curInstance.updatePosition(newPos);
            }
        });

        $('#loadingbar').remove();
    }

}
