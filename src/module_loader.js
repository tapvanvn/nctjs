var __pure__waiting__fn = window.__pure__waiting__fn || [];

__pure__waiting__fn.push( function()
{
    var evt_handle = new EventHandle({Context:this, fn: function(evt){

        var module_loader = __pure_mod__.Class.extend("module_load", {

            init:function(dom)
            {
                var queue = new TaskQueue();

                var modules = document.getElementsByTagName('module');

                modules.forEach((m)=>{
                    var src = m.getAttribute('src');

                    var type = m.getAttribute('type');

                    queue.add(new TaskResourceLoad({ url: src, type: type }));
                });

                var task_init = new Task();
                
                task_init.fn = function(task, param) {

                    console.log('all resources have been loaded. init something here');

                    window.nct.core.bind(dom);
                };
                queue.add(task_init);
            },
        })

        window.nct.core.regType("module_load", module_loader);

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