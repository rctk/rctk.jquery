Onion.widget.Frame = function(jwin, parent, controlid) {
    Onion.widget.Container.apply(this, arguments);
    this.name = "frame";
}

Onion.widget.Frame.prototype = new Onion.widget.Container();

Onion.widget.Frame.prototype.create = function(data) {
    var controlid = "ctrl"+this.controlid;

    // possibly request position, (open) state from the WindowManager
    var config = {'autoOpen':false, 'modal':false, 'resize':false, 'position':'top'};

    this.jwin.factory.append('<div id="' + controlid + '" title="' + data.title + '"></div>');
    this.control = $("#"+controlid);
    this.control.dialog(config);
    this.control = $("#"+controlid).parent();
    this.container = $("#"+controlid);
    // dialogBox class not currently used
    this.container.addClass(this.cssclass);
    this.container.addClass(this.name);
    
    this.control.appendTo(this.jwin.toplevels);
    this.set_properties(data);

    var self=this;
    this.container.bind('dialogclose', function() {
        self.closed();
        self.jwin.flush();
    });
};

Onion.widget.Frame.prototype.closed = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'opened':false});
    if(this.handle_close) {
        this.jwin.add_task("event", "close", this.controlid);
    }
};

Onion.widget.Frame.prototype.setLayout = function(type, config) {
    Onion.widget.Container.prototype.setLayout.apply(this, arguments);
    // dialogInner class not currently used
    //this.layout.layoutcontrol.addClass("dialogInner");
};

Onion.widget.Frame.prototype.set_properties = function(data) {
    Onion.widget.Container.prototype.set_properties.apply(this, arguments);
    if('opened' in data) {
        if(data.opened) {
            this.container.dialog('open');
        }
        else {
            this.container.dialog('close');
        }
    }
    if('title' in data && data.title) {
        this.container.dialog({title:data.title});
    }
    if('modal' in data) {
        this.container.dialog("option", 'modal', data.modal);
    }
    if('resizable' in data) {
        this.container.dialog("option", 'resize', data.resizable);
    }
    if('position' in data && data.position) {
        this.container.dialog("option", "position", data.position);
    }
};

Onion.widget.Frame.prototype.resize = function(width, height) {
    this.container.dialog({width:width, height: height});
    //this.container.dialog({minWidth:width, minHeight: height});
};

Onion.widget.register("window", Onion.widget.Frame);
