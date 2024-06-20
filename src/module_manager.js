class ModuleDefine 
{
    constructor(name)
    {
        this.name = name
        this.resources = []
    }
    addResource(type, url) {
        this.resources[this.resources.length] = {
            type:type,
            url: url
        };
    }
}
class ResourceRecord 
{
    constructor(type)
    {
        this.type = type
        this.loaded = false
        this.useInModules = [];
    }
    isLoaded() 
    {
        return this.loaded
    }
    setLoaded(is_loaded)
    {
        this.loaded = is_loaded;
    }
    defineUseInModule(mod_name)
    {
        var found = false
        for(var i = 0; i< this.useInModules.length; i++)
        {
            if(this.useInModules[i] == mod_name) 
            {
                found = true;
                break;
            }
        }
        if(!found) 
        {
            this.useInModules[this.useInModules.length] = mod_name
        }
    }
}

var __pure__waiting__fn = window.__pure__waiting__fn || [];
__pure__waiting__fn.push( function()
{
    
    class ModuleManager  
    {
        constructor() 
        {
            this.registedModules = {}
            this.resources = {}
            this.loadedModules = {}
            this.moduleDefines = {}
        }
        isRegisted(mod_name)
        {
            return !(typeof this.registedModules[mod_name] == 'undefined' || this.registedModules[mod_name] == false)
        }
        isLoaded(mod_name)
        {
            return !(typeof this.loadedModules[mod_name] == 'undefined' || this.loadedModules[mod_name] == false)
        }
        //define information of module
        register(mod_define) 
        {
            if(mod_define instanceof ModuleDefine) 
            {
                if(this.isRegisted(mod_define.name) == false)
                {
                    this.moduleDefines[mod_define.name] = mod_define
                    for( var i = 0; i < mod_define.resources.length; i++)
                    {
                        let url = mod_define.resources[i].url
                        if(typeof this.resources[url] == 'undefined') 
                        {
                            this.resources[url] = new ResourceRecord(mod_define.resources[i].type)
                        } 
                        this.resources[url].defineUseInModule(mod_define)
                    }
                }
            }
        }
        load(mod_name, callback) 
        {
            if(this.isLoaded(mod_name) == false && typeof this.moduleDefines[mod_name] != 'undefined') 
            {
                var queue = new TaskQueue()
                var mod_define = this.moduleDefines[mod_name]
                var urls = [];
                for( var i = 0; i < mod_define.resources.length; i++)
                {
                    let url = mod_define.resources[i].url
                    
                    if(this.resources[url].isLoaded() == false) 
                    {
                        if(mod_define.resources[i].type == "template")
                        {
                            if(typeof window.templater == 'undefined')
                            {
                                console.log("templater is required for loading tempate")
                            } 
                            else 
                            {
                                var task = new Task();
                                task.fn = function(task, param) 
                                {
                                    window.templater.load(param.path)
                                    task.onDone.callDo()
                                }
                                task.Param = {
                                    path: url
                                }
                                queue.add(task);
                            }
                        }
                        else 
                        {
                            urls[urls.length] = url
                            queue.add(new TaskResourceLoad({ url: url, type: mod_define.resources[i].type }));
                        }
                    }
                    
                }
                var task_init = new Task();
                task_init.fn = function(task, param) 
                {
                    this.loadedModules[mod_name] = true
                    for(var i = 0; i < urls.length; i++) 
                    {
                        this.resources[urls[i]].setLoaded(true)
                    }
                    if(typeof callback == "function")
                    {
                        callback()
                    }
                };
                queue.add(task_init);
            }
            else if(typeof callback == "function")
            {
                callback();
            }
        }
        loadMultipleModules(mod_names, callback)
        {
            var queue = new TaskQueue()
            var urls = []
            var self = this

            for(var i = 0; i< mod_names.length; i++) 
            {
                let mod_name = mod_names[i]
                
                if(this.isLoaded(mod_name) == false && typeof this.moduleDefines[mod_name] != 'undefined') 
                {
                    console.log("load mod:", mod_name)
                    var mod_define = this.moduleDefines[mod_name]
                    
                    for( var j = 0; j < mod_define.resources.length; j++)
                    {
                        let url = mod_define.resources[j].url
                        
                        if(this.resources[url].isLoaded() == false) 
                        {
                            if(mod_define.resources[j].type == "template")
                            {
                                if(typeof window.templater == 'undefined')
                                {
                                    console.log("templater is required for loading tempate")
                                } 
                                else 
                                {
                                    var task = new Task();
                                    task.fn = function(task, param) 
                                    {
                                        window.templater.load(param.path)
                                        task.onDone.callDo()
                                    }
                                    task.Param = {
                                        path: url
                                    }
                                    queue.add(task);
                                }
                            }
                            else 
                            {
                                urls[urls.length] = url
                                queue.add(new TaskResourceLoad({ url: url, type: mod_define.resources[j].type }));
                            }
                        }
                    }
                } else {
                    console.log(this.isLoaded(mod_name), typeof this.moduleDefines[mod_name] != 'undefined');
                }
            }
            var task_init = new Task();
            task_init.fn = function(task, param) 
            {
                for(var i = 0; i< mod_names.length; i++) 
                {
                    let mod_name = mod_names[i]
                    self.loadedModules[mod_name] = true
                }
                for(var i = 0; i < urls.length; i++) 
                {
                    self.resources[urls[i]].setLoaded(true)
                }
                if(typeof callback == "function")
                {
                    callback()
                }
            };
            queue.add(task_init);
        }
    };

    window.moduleManager = new ModuleManager;
});