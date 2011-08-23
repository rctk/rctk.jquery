Onion.widget.RadioButton = function(jwin, parent, controlid) {
    Onion.widget.Control.apply(this, arguments);
    this.name = "radiobutton";
}

Onion.widget.RadioButton.prototype = new Onion.widget.Control();

Onion.widget.RadioButton.prototype.create = function(data) {
    var controlid = "ctrl" + this.controlid;
    this.jwin.factory.append('<div id="' + controlid + '"><input type="radio" id="radio-' + controlid + '" ></input><label id="label-' + controlid + '" for="radio-' + controlid +'"></label></div>');    
    this.control = $("#" + controlid);
    this.radio = this.control.find("input");
    this.control.addClass(this.cssclass);
    this.control.addClass(this.name);
    this.handle_click = false;

    var self=this;
    this.radio.change(
        function() { self.changed(); self.jwin.flush(); }
    );
    this.set_properties(data);
}

Onion.widget.RadioButton.prototype.changed = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'checked':this.radio.attr('checked')});

    if(this.handle_click) {
        if(!this.busy) {
            this.jwin.add_task("event", "click", this.controlid);
            this.jwin.register_busy(this);
        }
    }
}

Onion.widget.RadioButton.prototype.set_properties = function(data) {
    Onion.widget.Control.prototype.set_properties.apply(this, arguments);
    if('checked' in data) {
        if(data.checked) {
            this.radio.attr('checked', "checked");
        } 
        else {
            this.radio.removeAttr('checked');
        }

    }
    if('group' in data && data.group) {
        this.radio.attr("name", data.group);
    }
    if('text' in data) {
        $("#label-ctrl" + this.controlid).text(data.text);
    }    
};

// register
Onion.widget.register("radiobutton", Onion.widget.RadioButton);
