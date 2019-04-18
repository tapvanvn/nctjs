
function isset(check_var)
{
    return (typeof(check_var) !== 'undefined');
}

function assert(equation)
{
    if(!equation)
    {
        console.error("assert fail! some thing wrong with this equation!" );
    }
}

//we assume that pure/src/pure.min.js is there
var __pure__waiting__fn = window.__pure__waiting__fn || [];

__pure__waiting__fn.push( function()
{
    console.log("init nctjs");
    var nct = window.nct = {};

    nct.handler = 
    {
        module_load: Class.extend("module_load", {
            init:function(dom)
            {
                var queue = new TaskQueue();

                $(dom).find('module').each(function(){
                    var src = $(this).attr('src');
                    var type = $(this).attr('type');
                    $(this).remove();
                    queue.add(new TaskResourceLoad({ url: src, type: type }));
                });

                var task_init = new Task();
                task_init.fn = function(task, param) {
                    console.log('all resources have been loaded. init something here');

                    window.nct.core.bind(dom);
                };
                queue.add(task_init);
            },
        }),
        dom_binder: Class.extend("dom_binder", {
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
        })
    }

    //core
    nct.core = {
        _bind:[],
        _bind_class:[],

        regType:function(type, handle_class)
        {
            if( isset(this._bind_class[type]) )
            {
                console.log("class:" + type + " is existed.");
            }
            else 
            {
                this._bind_class[type] = {class:handle_class, _gen_id:1};
            }
            window.__pure__.trigger("nct.handler.reg",{type:type});
        },

        binding:function (type, dom)
        {
            var assert = isset(this._bind_class[type]);
            if(isset(this._bind_class[type]))
            {
                var prop_name = "nct-"+ type;

                if(typeof( $(dom).attr(prop_name) ) === 'undefined' ) 
                {
                    var id = this._bind_class[type]._gen_id ++;
                    
                    var handle_obj = new this._bind_class[type].class(dom);

                    if(this._bind[type])
                    {
                        this._bind[type][id] = handle_obj;
                    }
                    else 
                    {
                        this._bind[type] = [];
                        this._bind[type][id] = handle_obj;
                    }
                    $(dom).attr(prop_name, id);
                }
            }
            
            else
            {
                console.log("class:" + type + " is not defined");
            }
        },

        findHandle(type, dom)
        {
            var prop_name = "nct-" + type;
            var id = $(dom).attr( prop_name );
            return this._bind[type][id];
        },

        findParentHandle(type, dom)
        {
            if(typeof(dom.length) !== 'undefined')
            {
                var result = [];
                for(var i = 0; i< dom.length; i++)
                {
                    var element = dom[i];
                    var find = window.nct.core.findParentHandle(type, element);
                    if(find != null)
                    {
                        result[result.length] = find;
                    }
                }

                if(result.length == 1)
                {
                    return result[0];
                }
                else if (result.length > 1)
                {
                    return result;
                }
            }
            else 
            {
                var element = dom.parentNode;
                var prop_name = "nct-" + type;
                while(element)
                {
                    if(typeof $(element).attr(prop_name) !== 'undefined')
                    {
                        var id = $(element).attr( prop_name );
                        return this._bind[type][id];
                    }
                    element = element.parentNode;
                }
            }
            return null;
        },

        findChildrenHandle(type, dom)
        {
            var results = [];
            var prop_name = "nct-" + type;
            var selector = "["+ $.escapeSelector(  prop_name ) + "]";
            var self = this;
            $children = $(dom).find( selector );
            $children.each(function(){
                var id = $(this).attr(prop_name);
                results.push(self._bind[type][id]);
            });

            return results;
        },

        bind: function(element)
        {
            if(typeof $(element).attr("nct-init") !== 'undefined')
            {
                var types  = $(element).attr("nct-init");

                types.split(",").forEach(function(type){
    
                    nct.core.binding(type, element);
                });
            }

            $(element).find("[nct-init]").each(function(){
            
                var e = this;
                var types  = $(e).attr("nct-init");
                types.split(",").forEach(function(type){
                    nct.core.binding(type, e);
                });
            });
        }, 

        unbind: function(type, dom)
        {
            var prop_name = "nct-"+ type;

            if(typeof( $(dom).attr(prop_name) ) === 'undefined' ) 
            {
                var id = $(dom).attr(prop_name);
                this._bind[type].splice(id, 1);
            }
        }
    };

    nct.core.regType("module_load", nct.handler.module_load);
    nct.core.regType("dom_binder", nct.handler.dom_binder);

    window.__pure__.trigger("nct.init",{});

    $(document).ready(function()
    {
        nct.core.bind(document);
    });

});
