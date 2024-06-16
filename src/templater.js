var __pure__waiting__fn = window.__pure__waiting__fn ||[]
__pure__waiting__fn.push ( function (){
	var Class = __pure__mod__.Class
	var p = __pure__mod__.Pure

	var Template = Class.extend ( "Template",{
		init : function ( path , callback ){
			this.path = path
			this.content = ""
			this.status = "loading"
			this.onLoaded =[]
			if( typeof callback === 'function'){
				this.onLoaded.push ( callback )
			}
			var self = this
			var xmlhttp = new XMLHttpRequest ()
			xmlhttp.onreadystatechange = function (){
				if( this.readyState == 4 && this.status == 200 ){
					self.content = this.responseText
					self.status = "ready"
					var delegate = self.onLoaded
					delegate.forEach ( fn =>{
						fn ( self )
					})
					self.onLoaded =[]
				}
				else if( this.readyState == 4 ){
					console.log ( "error:"+ this.status )
					self.status = "error"
				}
			}
			xmlhttp.open ( "GET", path , true )
			xmlhttp.send ()
		}
	})
	var Templater ={
		templates :{
		},
		load : function ( path , callback ){
			if( typeof this.templates [ path ]!== 'undefined'){
				var temp = this.templates [ path ]
				if( temp.status == 'ready'){
					if( typeof callback === 'function'){
						callback ( temp )
					}
				}
				else if( typeof callback === 'function'){
					temp.onLoaded.push ( callback )
				}
				return
			}
			this.templates [ path ]= new Template ( path , callback )
		},
		getDom : function ( content ){
			var div = document.createElement ( "div")
			div.innerHTML = content
			if( div.childNodes.length == 1 ){
				return div.firstChild
			}
			return div
		}
	}
	window.templater = Templater
	var template_loader = Class.extend ( "TemplateLoader",{
		init : function ( dom , ctx )
		{
			this.dom = dom 
			this.ctx = ctx
			var self = this
			var tpl = dom.getAttribute('tpl');
			window.templater.load(tpl,
			(template) => {
				var temp_dom = window.templater.getDom(template.content)
				window.nct.core.bind(temp_dom)
				dom.parentNode.appendChild(temp_dom)
				window.nct.core.unbindAll(dom)
				dom.parentNode.removeChild(dom)
			})
		},
	})
	window.nct.core.regType ( "template_loader", template_loader )
})