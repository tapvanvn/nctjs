var __pure__waiting__fn = window.__pure__waiting__fn || [];

__pure__waiting__fn.push( function()
{
    var evt_handle = new EventHandle({Context:this, fn: function(evt){

        var dom_binder = __pure_mod__.Class.extend("dom_binder", {
            $dom:null,
            holder:{},
            explore:function()
            {
                var self = this;
                $doms = this.$dom.find("[nct-binder]").each(function(){
                    var bind_declare = $(this).attr('nct-binder');
                    var $bind_dom = $(this);
                    bind_declare.split(",").forEach(function(type){
                        var obj = self.holder;
                        $paths = type.split(".");
                        while($paths.length > 1)
                        {
                            var attr_name = $paths.shift();
                            if(!obj.hasOwnProperty(attr_name))
                            {
                                obj[attr_name] = {};
                            }
                            obj = obj[attr_name];
                        }
                        var attr_name = $paths.shift();
                        obj[attr_name] = $bind_dom;
                    });
                });
            },
            get(paths)
            {
                var obj = this.holder;
                var paths_array = paths.split(".");
                while(paths_array.length > 0)
                {
                    var attr_name = paths_array.shift();
                    if(!obj.hasOwnProperty(attr_name))
                    {
                        obj[attr_name] = {};
                    }
                    obj = obj[attr_name];
                }
                return obj;
            },
            bindText(paths, val)
            {
                var holder = this.get(paths);
                if(holder instanceof jQuery)
                {
                    holder.text(val);
                }
            },
            bindValue(paths, val)
            {
                var holder = this.get(paths);
                if(holder instanceof jQuery)
                {
                    holder.val(val);
                }
            },
            bindClass(paths, class_name)
            {
                var holder = this.get(paths);
                if(holder instanceof jQuery)
                {
                    holder.addClass(class_name);
                }
            },
            unbindClass(paths, class_name)
            {
                var holder = this.get(paths);
                if(holder instanceof jQuery)
                {
                    holder.removeClass(class_name);
                }
            },
            bindProperty(paths, prop_name, val)
            {
                var holder = this.get(paths);
                if(holder instanceof jQuery)
                {
                    holder.attr(prop_name, val);
                }
            },
            init(dom)
            {
                this.$dom = $(dom);
                this.explore();
            }
        });

        window.nct.core.regType("dom_binder", dom_binder);

    }});
  
    if(typeof (window.nct) !== 'undefined')
    {
        evt_handle.fn();
    }
    else 
    {
        window.__pure__.onTrigger("nct.init", evt_handle);
    }
});