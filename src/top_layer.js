__pure__waiting__fn.push ( function (){
	var Class = __pure__mod__.Class
	var GuiClass = __pure__mod__.GuiClass
	var p = __pure__mod__.Pure
	var TopLayerClass = GuiClass.extend ( "TopLayer",{
		init : function ( zIndex ){
			this.base ({
				className : "toplayer",
			})
			this.dom.style.zIndex = zIndex
			this.container = new GuiClass ({
				className : "container"
			})
			this.head = new GuiClass ({
				className : "head",
				innerHTML : "<div class='title'></div><div class='btn-close'><i class='far fa-times-circle'></i></div>"
			})
			this.title = this.head.dom.getElementsByClassName ( 'title')[ 0 ]
			this.content = new GuiClass ({
				className : "content",
				innerHTML : "content"
			})
			this.foot = new GuiClass ({
				className : "foot",
				innerHTML : "foot"
			})
			this.container.append ( this.head )
			this.container.append ( this.content )
			this.container.append ( this.foot )
			this.append ( this.container )
			p.dom.appendRoot ( this.dom )
			var self = this
			p.event.bind ( "click", this.head.dom.getElementsByClassName ( 'btn-close')[ 0 ],
			()=>{
				self.hide ()
			}
			)
		},
		showContent : function ( title , content , behave ){
			this.content.dom.innerHTML = ""
			this.foot.dom.innerHTML = ""
			this.title.innerHTML = title
			if( typeof content === 'string'){
				this.content.dom.innerHTML = content
			}
			else if( content instanceof GuiClass ){
				this.content.append ( content )
			}
			else{
				this.content.dom.appendChild ( content )
			}
			if( typeof behave !== 'undefined'){
				if( Array.isArray ( behave.buttons )){
					var self = this
					behave.buttons.forEach (
					( button )=>{
						var title = button.title ? button.title : "button"
						var btn = new GuiClass ({
						innerHTML : title})
						if( typeof button.click === 'function'){
							p.event.bind ( "click", btn.dom , button.click )
						}
						self.foot.append ( btn )
					}
					)
				}
				if( typeof behave.callback !== 'undefined'){
					behave.callback ( this )
				}
			}
			this.show ()
		},
		hide : function (){
			this.unbindStyle ( "active")
			if( this.dom.parentNode != null ){
				this.dom.parentNode.removeChild ( this.dom )
			}
		},
		show : function (){
			this.bindStyle ( "active")
		}
	})
	var Popup = GuiClass.extend ( "Popup",{
		init : function ( zIndex , pos ){
			this.base ({
				className : "toplayer popup",
			})
			this.dom.style.zIndex = zIndex
			this.container = new GuiClass ({
				className : "container"
			})
			this.content = new GuiClass ({
				className : "content"
			})
			this.container.append ( this.content )
			this.append ( this.container )
			p.dom.appendRoot ( this.dom )
			var self = this
			p.event.bind ( "click", this.dom ,
			( evt )=>{
				if( evt.target == self.dom ){
					self.hide ()
				}
			}
			)
		},
		showContent : function ( content , behave ){
			this.content.dom.innerHTML = ""
			if( typeof content === 'string'){
				this.content.dom.innerHTML = content
			}
			else if( content instanceof GuiClass ){
				this.content.append ( content )
			}
			else{
				this.content.dom.appendChild ( content )
			}
			if( typeof behave !== 'undefined'){
				if( typeof behave.callback !== 'undefined'){
					behave.callback ( this )
				}
			}
			this.show ()
		},
		hide : function (){
			this.unbindStyle ( "active")
		},
		show : function (){
			this.bindStyle ( "active")
		}
	})
	window.topLayer ={
		zIndex : 1000 ,
		showForm : function ( title , content , behave ){
			this.zIndex ++
			var layer = new TopLayerClass ( this.zIndex )
			layer.showContent ( title , content , behave )
			return layer
		},
		showPopup : function ( content , behave ){
			this.zIndex ++
			var layer = new Popup ( this.zIndex )
			layer.showContent ( content , behave )
			return layer
		}
	}
})