
//author: Duy Nguyen <tapvanvn@gmail.com>
//we assume that pure/src/pure.js is there

var __pure__waiting__fn = window.__pure__waiting__fn || [];

__pure__waiting__fn.push( function()
{
    console.log("init nctjs");
    var nct = window.nct = { ready: false };

    var nct_context = __pure__mod__.Class.extend("nct_conntext", {

        init: function(dom) {

            var self = this

            var findRole = (node)=>{

                if(typeof node.hasAttribute === 'function' && node.hasAttribute("nct-role")){

                    var role = node.getAttribute("nct-role")

                    if (typeof self[role] === 'undefined') {

                        self[role] = node
                    }
                }
            }

            __pure__mod__.Pure.dom.runChildren(dom, findRole)
        }
    })

    //core
    nct.core = {
        _debug: false,
        _bind:{},
        _bind_class:{},

        regType:function(type, handle_class)
        {
            if (this._debug) {

                console.log("nct:" + type)
            }
            if( typeof(this._bind_class[type]) != 'undefined')
            {
                console.log("class:" + type + " is existed.");
            }
            else 
            {
                this._bind_class[type] = {class:handle_class, _gen_id:1};
            }
            window.__pure__.trigger("nct.handler.reg",{type:type});
        },

        getHandleById(type, id) {

            if (Array.isArray( this._bind[type])) {

                return this._bind[type][id]
            }
            return undefined
        },

        binding:function (type, dom)
        {
            if (this._debug) {

                console.log("binding to type:" + type)
            }
            if(typeof(this._bind_class[type]) != 'undefined')
            {
                var prop_name = "nct-"+ type;
                
                if( !dom.hasAttribute(prop_name) )
                {
                    var id = this._bind_class[type]._gen_id ++;
                    
                    var handle_obj = new this._bind_class[type].class( dom, new nct_context(dom) );

                    if(this._bind[type])
                    {
                        this._bind[type][id] = handle_obj;
                    }
                    else 
                    {
                        this._bind[type] = [];
                        this._bind[type][id] = handle_obj;
                    }
                    dom.setAttribute(prop_name, id);

                    return handle_obj;
                }
            }
            else if (this._debug)
            {
                console.log("class:" + type + " is not defined");
            }
            return null;
        },

        findHandle: function (type, dom)
        {
            if (typeof dom.getAttribute === 'function' ){
                var prop_name = "nct-" + type;
                var id = dom.getAttribute( prop_name );
                if (this._bind[type] && this._bind[type][id]){
                    return this._bind[type][id];
                }
            }
            return null;
        },

        findParentHandle: function (type, dom)
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
                    if(typeof element.hasAttribute === 'function' && element.hasAttribute(prop_name))
                    {
                        var id = element.getAttribute(prop_name);
                        if (this._bind[type] && this._bind[type][id]){
                            return this._bind[type][id];
                        }
                    }
                    element = element.parentNode;
                }
            }
            return null;
        },

        findChildrenHandle(type, dom)
        {
            var self = this
            var results = [];
            var prop_name = "nct-" + type;

            var run = (node, fn)=>{
                fn(node);
                node.childNodes.forEach((node2)=>{
                    run(node2, fn)
                })
            }

            run(dom, (node)=>{

                if (typeof node.hasAttribute === 'function' && node.hasAttribute(prop_name)) {

                    var id = node.getAttribute(prop_name);
                    results.push(self._bind[type][id]);
                }
            })
            
            return results;
        },

        bind: function(element)
        {   
            if(element instanceof __pure__mod__.GuiClass) {
                element = element.dom
            }

            if( typeof element.hasAttribute !== 'undefined' 
            && typeof element.getAttribute !== 'undefined' 
            && element.hasAttribute("nct-init") ){
  
                var types  = element.getAttribute("nct-init") ;

                types.toString().split(",").forEach(function(type){
    
                    nct.core.binding(type, element);
                });
            }

            element.childNodes.forEach((node)=>{
                nct.core.bind(node);
            });
        }, 

        unbind: function(type, dom)
        {
            var prop_name = "nct-"+ type;

            if(dom.hasAttribute(prop_name) ) 
            {
                var id = dom.getAttribute(prop_name);
                this._bind[type][id] = null;
                //this._bind[type].splice(id, 1);
            }
        },

        unbindAll: function(element)
        {
            if(element instanceof __pure__mod__.GuiClass) {
                element = element.dom
            }

            if( typeof element.hasAttribute !== 'undefined' 
            && typeof element.getAttribute !== 'undefined' 
            && element.hasAttribute("nct-init") ){
  
                var types  = element.getAttribute("nct-init") ;

                types.toString().split(",").forEach(function(type){
    
                    nct.core.unbind(type, element);
                });
            }

            element.childNodes.forEach((node)=>{
                nct.core.unbindAll(node);
            });
        }
    };

    window.__pure__.trigger("nct.init",{});

    var waitReady = (fn) => {

        if (document.readyState != 'loading') {

            fn();
        } else if (document.addEventListener) {

            document.addEventListener('DOMContentLoaded', fn);

        } else {

            document.attachEvent('onreadystatechange', function () {

                if (document.readyState != 'loading')
                    fn();
            });
        }
    }

    waitReady(()=>{

        try{
            console.log("binding on document");

            nct.core.bind(document);
            nct.ready = true;
            window.__pure__.trigger("nct.ready",{});

        } catch(err) {

            console.error(err)
        }
    })
});
