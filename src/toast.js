__pure__waiting__fn.push ( function (){
	var evt_handle = new __pure__mod__.EventHandle ({
		Context : this , fn : function ( evt ){
			var Class = __pure__mod__.Class
			var GuiClass = __pure__mod__.GuiClass
			var p = __pure__mod__.Pure
			var toast_item = Class.extend ( "ToastItem",{
				init : function ( dom , ctx ){
					var self = this
					self.dom = dom
					setTimeout ( function (){
					self.dom.parentNode.removeChild ( self.dom )}, 2500 )
				}
			})
			var toast = Class.extend ( "Toast",{
				init : function ( dom , ctx ){
					var self = this
					self.index = 100
					var template = "toast_item"
					if( dom.hasAttribute ( "template")){
						template = dom.getAttribute ( "template")
					}
					window.templater.load ( "template/"+ template + ".html",
					( template )=>{
						self.item_template = template
					}
					)
					var evt_handle_loaded = new EventHandle ({
						Context : self , fn : function ( message ){
							var dom = window.templater.getDom ( self.item_template.content )
							p.dom.appendRoot ( dom )
							if(typeof message == 'string')
							{
								dom.innerHTML = message
							}
							else if(typeof message == 'object')
							{
								if(typeof message.content == 'string')
									dom.innerHTML = message.content

								if(typeof message.class == 'string')
									p.dom.bindStyle(dom,message.class)
							}
							dom.style.zIndex = self.index ++
							window.nct.core.bind ( dom )
					}})
					window.__pure__.onTrigger ( "toast", evt_handle_loaded )
				},
			})
			window.nct.core.regType ( "toast", toast )
			window.nct.core.regType ( "toast_item", toast_item )
	}})
	if( typeof ( window.nct )!== 'undefined'){
		evt_handle.fn ()
	}
	else{
		window.__pure__.onTrigger ( "nct.init", evt_handle )
	}
})