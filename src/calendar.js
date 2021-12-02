__pure__waiting__fn.push ( function (){
	var evt_handle = new __pure__mod__.EventHandle ({
		Context : this , fn : function ( evt ){
            
            var Class = __pure__mod__.Class
            var GuiClass = __pure__mod__.GuiClass
            var p = __pure__mod__.Pure
    
            var curr_date = new Date();
    
            var DateHelper = {
                DateMonth:[31,28,31,30,31,30,31,31,30,31,30,31],
                dateOfMonth:function(month_pair)
                {
                    return ( (month_pair.year % 4 == 0 && month_pair.month == 1) ? 29 : this.DateMonth[month_pair.month] );
                },
                lastMonth : function(month_pair)
                {
                    return ( month_pair.month == 0 ? {month:11, year:month_pair.year-1} : {month:month_pair.month-1, year:month_pair.year} );
                },
                nextMonth: function (month_pair)
                {
                    return ( month_pair.month == 11 ? {month:0, year:month_pair.year+1} : {month:month_pair.month+1, year:month_pair.year} );
                }
            }
    
            var calendar = Class.extend("Calendar", {
    
                init: function (dom, ctx) {
    
                    this.dom = dom
    
                    this.ctx = ctx
    
                    var self = this
    
                    this.options = {
    
                        view_date:curr_date,
                        view_port:null,
                        layers:[],
                        only_current_month:true,
                        titles:[]
                    }
    
                    this.select_timestamp = 0
                    this.select_dom = null
    
                    this.cells = []
                    var cell_click = (e)=>{
    
                        actor = p.event.getActor(e)
    
                        e.preventDefault();
    
                        var view_port = self.options.view_port
    
                        var cell_id = actor.getAttribute("nct-role")
    
                        var cell_offset = parseInt( cell_id.split("_")[1] )
    
                        if (Number.isNaN(cell_offset)) {
    
                            return
                        }
    
                        var timestamp = view_port.min + (cell_offset * 86400000);
    
                        var date = new Date(timestamp);
    
                        if(
                            (self.options.only_current_month && date.getMonth() == self.options.view_date.getMonth()) 
                            || !self.options.only_current_month
                            )
                        {
                            self.select_timestamp = timestamp
    
                            if(self.select_dom != null){
                                p.dom.unbindStyle(self.select_dom, "select")
                            }
                            p.dom.bindStyle(actor, "select")
                            self.select_dom = actor
                        }
                    }
                    for (var i = 1; i<= 42; i++) {
                        this.cells[i] = ctx["cell_" + i]
                        p.event.bind("click", ctx["cell_" + i], cell_click)
                    }
    
                    this.options.titles[0]  = dom.getAttribute('january');
                    this.options.titles[1]  = dom.getAttribute('february');
                    this.options.titles[2]  = dom.getAttribute('march');
                    this.options.titles[3]  = dom.getAttribute('april');
                    this.options.titles[4]  = dom.getAttribute('may');
                    this.options.titles[5]  = dom.getAttribute('june');
                    this.options.titles[6]  = dom.getAttribute('july');
                    this.options.titles[7]  = dom.getAttribute('august');
                    this.options.titles[8]  = dom.getAttribute('september');
                    this.options.titles[9]  = dom.getAttribute('october');
                    this.options.titles[10]  = dom.getAttribute('november');
                    this.options.titles[11]  = dom.getAttribute('december');
    
                    this.render()
    
                    p.event.bind("click",ctx.btn_back, (e)=>{self.previousMonth(e)})
                    p.event.bind("click",ctx.btn_next, (e)=>{self.nextMonth(e)})
    
                },
                render:function() {
                    
                    var self = this 
    
                    var remove_class = ['current','select']
    
                    this.options.layers.forEach(layer=>{
                        remove_class.push( layer.name )
                    });
    
                    this.cells.forEach((cell)=>{
                        remove_class.forEach((name)=>{
                            p.dom.unbindStyle(cell, name)
                        })
                    })
    
                    var helper = DateHelper;
    
                    var view_date = this.options.view_date;
    
                    view_date.setDate(1);
                    
                    var this_month = {
                        month:view_date.getMonth(),
                        year:view_date.getFullYear()
                    }
    
                    var last_month = helper.lastMonth(this_month);
                    var month_date = helper.dateOfMonth(this_month);
                    var last_month_date = helper.dateOfMonth(last_month);
    
                    var first_day = view_date.getDay();
    
                    var count = 1;
    
                    if(first_day == 0){
    
                        first_day = 7;
                    }
    
                    var last_month_begin = last_month_date - first_day;
    
                    var this_timestamp = view_date.getTime();
    
                    var min_timestamp = this_timestamp - ((first_day + 1) * 86400000);
    
                    this.options.view_port = {
                        min: min_timestamp,
                        max: min_timestamp +  3628800000,
                        zero: first_day + 1,
                        month_date: month_date
                    }
    
                    for(var i = 1; i<= first_day; i++, count++){
    
                        var val = this.options.only_current_month ? '' : (last_month_begin + i);
    
                        this.cells[count].innerHTML = val
                    }
    
                    if (first_day > 7) {
    
                        self.ctx.top.style.display =  'none'
    
                    } else {
    
                        self.ctx.top.style.display =  'unset'
                    }
                    
                    for(var i = 1; i<= month_date; i++, count++) {
    
                        p.dom.bindStyle(this.cells[count], "current")
                        this.cells[count].innerHTML = i
                    }
    
                    if(count <= 35 ){
    
                        self.ctx.bottom.style.display =  'none'
    
                    } else {
    
                        self.ctx.bottom.style.display =  'unset'
                    }
    
                    for(var i = count; i<= 42; i++){
    
                        var val = this.options.only_current_month ? '' : (i - count + 1);
    
                        this.cells[i].innerHTML = val
                    }
    
                    var month_title = this.options.titles[this_month.month];
    
                    this.ctx.title_month.innerHTML = month_title + " " + this_month.year;
    
                    this.shiftLayers();
                },
    
                shiftLayers:function(){
    
                    var view_date = this.options.view_date;
    
                    view_date.setHours(0,0,0,0);
                    
                    var view_timestamp = view_date.getTime();
    
                    var view_port = this.options.view_port;
    
                    var layers = this.options.layers;
    
                    layers.forEach(element => {
    
                        if(element.timePoints){
    
                            var class_name = element.name;
    
                            element.timePoints.forEach(point=>{
    
                                if(point >= view_port.min && point <= view_port.max){
    
                                    var delta_timestamp = point - view_timestamp;
    
                                    var delta = Math.floor(delta_timestamp/86400000);
    
                                    var pos = view_port.zero + delta;
    
                                    if(
                                        !this.options.only_current_month
                                        || (this.options.only_current_month && pos >= view_port.zero && pos < view_port.zero + view_port.month_date))
                                    {
                                        p.dom.bindStyle(this.cells[pos], class_name)
                                    }
                                }
                            });
                        }
                    });
                },
    
                previousMonth:function(e){
    
                    e.preventDefault();
    
                    var helper = DateHelper;
    
                    var view_date = this.options.view_date;
                    view_date.setDate(1);
                    view_date.setHours(0,0,0,0);
    
                    var this_month = {
                        month:view_date.getMonth(),
                        year:view_date.getFullYear()
                    }
                    var last_month = helper.lastMonth(this_month);
    
                    view_date.setFullYear(last_month.year);
                    view_date.setMonth(last_month.month);
    
                    this.render();
                },
    
                nextMonth:function(e){
    
                    e.preventDefault();
                    var helper = DateHelper;
                    var view_date = this.options.view_date;
                    view_date.setDate(1);
                    view_date.setHours(0,0,0,0);
    
                    var this_month = {
                        month:view_date.getMonth(),
                        year:view_date.getFullYear()
                    }
    
                    var next_month = helper.nextMonth(this_month);
    
                    view_date.setFullYear(next_month.year);
                    view_date.setMonth(next_month.month);
    
                    this.render();
                },
    
                setToday:function(timestamp)
                {
                    var date = new Date(timestamp);            
                    this.options.view_date = date;
                    this.options.view_date.setDate(1);
                    this.options.view_date.setHours(0,0,0,0);
                    this.render();
                },
    
                addLayer:function(layer){
    
                    if(layer && layer.name && layer.timePoints)
                    {
                        this.options.layers[this.options.layers.length] = layer;
                    }
                },
    
                addTimePoint:function(layer_name, timestamp){
    
                    var tmp_date = new Date(timestamp);
                    tmp_date.setHours(0,0,0,0);
                    timestamp = tmp_date.getTime();
    
                    var layers = this.options.layers;
                    for(var i = 0; i< layers.length; i++)
                    {
                        if(layers[i].name == layer_name)
                        {
                            layers[i].timePoints[layers[i].timePoints.length] = timestamp;
                            return;
                        }
                    }
                    layers[layers.length] = {
                        name:layer_name,
                        timePoints:[timestamp]
                    };
    
                },
    
                removeTimePoint:function(layer_name, timestamp)
                {
                    var tmp_date = new Date(timestamp);
                    tmp_date.setHours(0,0,0,0);
                    timestamp = tmp_date.getTime();
    
                    var layers = this.options.layers;
                    for(var i = 0; i< layers.length; i++)
                    {
                        if(layers[i].name == layer_name)
                        {
                            for( var j = 0; j < layers[i].timePoints.length; j++)
                            { 
                                if ( layers[i].timePoints[j] === timestamp) 
                                {
                                    layers[i].timePoints.splice(j, 1); 
                                }
                            }
                            return;
                        }
                    }
                },
    
                findLayerOfTimePoint:function(timestamp){
    
                    var rs = [];
                    
                    this.options.layers.forEach(function(layer){
    
                        layer.timePoints.forEach(function(time){
    
                            if(time == timestamp){
    
                                rs.push(layer.name);
                            }
                        });
                    });
    
                    return rs;
                }
            })
            window.nct.core.regType("calendar", calendar)
	}})
	if( typeof ( window.nct )!== 'undefined'){
		evt_handle.fn ()
	}
	else{
		window.__pure__.onTrigger ( "nct.init", evt_handle )
	}
})