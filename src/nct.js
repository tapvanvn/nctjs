
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
    console.log("init nctphp");
    var nct = window.nct = {};

    nct.handler = 
    {
        form: Class.extend("nctphp_form",{

            _options:{},
            init:function(dom)
            {
                //be sure dom is form;
                assert(dom.nodeName.toLowerCase() == 'form');
                this._options.dom = dom;
                $(dom).submit(this.onSubmit);
            },
            onSubmit:function(event)
            {
                
                var form = Pure.event.getActor(event);
                var handler = nct.core.findHandle("form", form);
                console.log ( "hey i am submitting. will you do some check?");

                var validate_result = handler.validate();
                console.log(validate_result);
                var total_result = true;
                validate_result.forEach(function(element)
                {
                    console.log(element);

                    var require = $(element.element).data("require") == "true" || $(element.element).data("require") == true;

                    for(key in element.points)
                    {
                        if(!element.points[key])
                        {
                            if(require)
                            {
                                total_result = false;
                                $(element.element).addClass("validate--error");
                                break;
                            }
                            else 
                            {
                                $(element.element).addClass("validate--warning");
                            }
                        }
                    }

                });

                if(total_result)
                {
                    console.log("it is ok");

                }
                else 
                {
                    event.preventDefault();
                    console.log("recheck your self man, some thing wrong with your data!");
                }
                
            },
            validate_null : function(val)
            {
                console.log("check_null:" + val);
                return val.length > 0;
            },
            validate_full_name: function(val)
            {
                console.log("check_full_name:" + val);
                return val.length > 0;
            },
            validate_phone_number : function(val)
            {
                console.log("check_phone_number:" + val);
                return true;
            },
            validate_email_address : function(val)
            {
                console.log("check_email_address:" + val);
                return true;
            },
            validate:function()
            {
                var result = [];
                function validate_element(element, rs)
                {
                    
                    var q_element = $(element);
                    
                    if(q_element.attr("name"))
                    {
                        q_element.removeClass('validate--error validate--warning');

                        var rs_obj = {element: element, points:[]};
                        
                        var val = q_element.val();

                        console.log(val);

                        var require = q_element.data("require");

                        if(require == "true" || require == true)
                        {
                            if(element.nodeName.toLowerCase() == 'select' && val.toLowerCase() == 'none')
                            {
                                val = '';
                            }
                            rs_obj.points['null'] = this.validate_null(val);
                        }

                        var data_type = q_element.data("type");

                        if(data_type == 'email_address')
                        {
                            rs_obj.points[data_type] = this.validate_email_address(val);
                        }
                        else if(data_type == 'phone_number') 
                        {
                            rs_obj.points[data_type] = this.validate_phone_number(val);
                        } 
                        else if(data_type == 'full_name')
                        {
                            rs_obj.points[data_type] = this.validate_full_name(val);
                        }

                        rs[rs.length] = rs_obj;
                    }
                    else 
                    {
                        if(element.childNodes.length > 0)
                        {
                            var context = this;
                            element.childNodes.forEach(function(node){
                                validate_element.call(context, node, rs);
                            });
                        }
                    }
                }
                //data-type: [full_name, phone_number, email_address]
                //data-require : [true, false] 
                var form = this._options.dom;
                validate_element.call(this, form, result);

                console.log("sure man");


                return result;
            }
        }),
        module_load: Class.extend("nctphp_module_load", {
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
        dom_binder: Class.extend("nctphp_dom_binder", {
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

    window.__pure__.trigger("nct.init",{});

    nct.core.regType("form", nct.handler.form);
    nct.core.regType("module_load", nct.handler.module_load);
    nct.core.regType("dom_binder", nct.handler.dom_binder);

    $(document).ready(function()
    {
        nct.core.bind(document);
    });

});
