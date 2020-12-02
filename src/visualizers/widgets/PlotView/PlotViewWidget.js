/*globals define, WebGMEGlobal*/


define(['jointjs','css!./styles/PlotViewWidget.css','css!jointjscss'], function (jointjs) {
    'use strict';

    var WIDGET_CLASS = 'plot-view';

    function PlotViewWidget(logger, container) {
        console.log(jointjs);
        this._logger = logger.fork('Widget');

        this._el = container;

        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');
    }

    PlotViewWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),

        // set widget class
        this._el.addClass(WIDGET_CLASS);

        this._graph = null;
        this._paper = null;

        this._graph = new jointjs.dia.Graph;
        this._paper = new jointjs.dia.Paper({
            el: $(this._el),
            width: width,
            height: height,
            gridsize: 1,
            defaultAnchor: {name:'perpendicular'},
            defaultConnectionPoint: {name:'boundary'},
            model: this._graph
        });

        this._paper.setInteractivity(false);
        this._paper.removeTools();



        this._place =  new joint.shapes.standard.Rectangle();
        this._place.attr({
            body:{
                fill: '#1FC711'
            },
            label:{
                text: 'token',
                fill: '#F3F4F2'
            }
        });

        this._paper.on('element:pointerdown',function(elementView){
            var ob = elementView.model;
            if (ob.get('type') === 'pn.Transition'){
                for (let i = 0; i < this._InLine.length; i++) {
                    if (this._InLine[i].getTargetElement() === transition) {
                        let place = this._InLine[i].getTargetElement();
                        let token = place.get('token');
                        token = token - 1;
                        place.set('token', token);
                    }
                }
                for (let i = 0; i < this._OutLine.length; i++) {
                    if (this._OutLine[ji].getTargetElement() === transition) {
                        let place = this._OutLine[i].getTargetElement();
                        let token = place.get('token');
                        token = token + 1;
                        place.set('token', token);
                    }
                }
            };
        });
        // // Create a dummy header
        // this._el.append('<h3>PlotView Events:</h3>');

        // // Registering to events can be done with jQuery (as normal)
        // this._el.on('dblclick', function (event) {
        //     event.stopPropagation();
        //     event.preventDefault();
        //     self.onBackgroundDblClick();
        // });
    };

    PlotViewWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
        if (this._paper){
            this._paper.setDimensions(width, height);
            this._paper.scaleContentToFit();
        }
    };

    // Adding/Removing/Updating items
    PlotViewWidget.prototype.addNode = function (desc) {
        if (desc) {
            // Add node to a table of nodes
            var node = document.createElement('div'),
                label = 'children';

            if (desc.childrenIds.length === 1) {
                label = 'child';
            }

            this.nodes[desc.id] = desc;
            node.innerHTML = 'Adding node "' + desc.name + '" (click to view). It has ' +
                desc.childrenIds.length + ' ' + label + '.';

            this._el.append(node);
            node.onclick = this.onNodeClick.bind(this, desc.id);
        }
    };

    PlotViewWidget.prototype.removeNode = function (gmeId) {
        var desc = this.nodes[gmeId];
        this._el.append('<div>Removing node "' + desc.name + '"</div>');
        delete this.nodes[gmeId];
    };

    PlotViewWidget.prototype.updateNode = function (desc) {
        if (desc) {
            this._logger.debug('Updating node:', desc);
            this._el.append('<div>Updating node "' + desc.name + '"</div>');
        }
    };

    PlotViewWidget.prototype.initNetwork = function (petri, classification) {

        var Place = []
        var path = []

        for (let i = 0; i < petri['Place'].length; i++) {

            let start_x = 50
            let start_y = 50
            let x_s
            let y_s

            x_s = start_x + parseInt(i/2) * 50;
            y_s = start_y + parseInt(i%2) * 50;

            var place = new joint.shapes.standard.Rectangle();
            rectangle.position(x_s, y_s);
            rectangle.attr('root/title', 'joint.shapes.standard.Rectangle');
            rectangle.attr('label/text', petri['Place'][i]['marking']);
            rectangle.attr('body/fill', 'lightblue');
            Place.push(place);
            path.push(petri['Place'][i]['path']);
        }
        this._paper._Place = Place;
        this._graph.addCell(this._paper._Place);

        var Transition = []
        var t_path = []
        for (let i = 0; i < petri['Transition'].length; i++) {
            let start_x = 75
            let start_y = 75
            let x_s
            let y_s

            x_s = start_x + parseInt(i/2) * 50;
            y_s = start_y + parseInt(i%2) * 50;

            var place = new joint.shapes.standard.Rectangle();
            rectangle.position(x_s, y_s);
            rectangle.attr('root/title', 'joint.shapes.standard.Rectangle');
            rectangle.attr('label/text', petri['Transition'][i]['name']);
            rectangle.attr('body/fill', '#1164C7');

            Transition.push(transition);
            t_path.push(petri['Transition'][i]['path']);
        }
        this._paper._Transition = Transition;
        this._graph.addCell(this._paper._Transition);

        var InLine = []
        for (let l = 0; l < petri['InLine'].length; l++) {
            var link = new joint.shapes.standard.Link();
            link.source(Place[path.indexOf(petri['Inline'][l]['src'])]);
            link.target(Transition[t_path.indexOf(petri['Inline'][l]['dst'])]);
            InLine.push(link);
        }
        this._paper._Inline = InLine;
        this._graph.addCell(this._paper._Inline);

        var OutLine = []
        for (let j = 0; j < petri['OutLine'].length; j++) {
            var link = new joint.shapes.standard.Link();
            link.source(Transition[t_path.indexOf(petri['OutLine'][j]['src'])]);
            link.target(Place[path.indexOf(petri['OutLine'][j]['dst'])]);
            OutLine.push(link);
        } 
        this._paper._OutLine = _OutLine;
        this._graph.addCell(this._paper._OutLine);

        setTimeout(()=>{CheckIsFirable(this._paper._Transition, this._paper._Inline, this._paper._OutLine);}, 1000);

    };


    /* * * * * * * * Visualizer event handlers * * * * * * * */

    PlotViewWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    PlotViewWidget.prototype.onBackgroundDblClick = function () {
        this._el.append('<div>Background was double-clicked!!</div>');
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    PlotViewWidget.prototype.destroy = function () {
    };

    PlotViewWidget.prototype.onActivate = function () {
        this._logger.debug('PlotViewWidget has been activated');
    };

    PlotViewWidget.prototype.onDeactivate = function () {
        this._logger.debug('PlotViewWidget has been deactivated');
    };

    return PlotViewWidget;
});
