Onion.widget.Dropdown = function(jwin, parent, controlid) {
    Onion.widget.Control.apply(this, arguments);
    this.items = [];
    this.name = "dropdown";
};

Onion.widget.Dropdown.prototype = new Onion.widget.Control();

Onion.widget.Dropdown.prototype.create = function(data) {
    var controlid = "ctrl"+this.controlid;
    this.jwin.factory.append('<select id="' + controlid + '">' + "</select>");
    this.control = $("#"+controlid);
    this.control.addClass(this.cssclass);
    this.control.addClass(this.name);
    this.handle_click = false;

    if(data.items) {
        for(var i = 0; i < data.items.length; i++) {
            this.append_item(data.items[i][0], data.items[i][1]);
        }
    }
    var self=this;
    this.control.change(function() { self.changed(); self.jwin.flush(); });
    this.set_properties(data);
};

Onion.widget.Dropdown.prototype.append_item = function(key, label) {
    this.control.append('<option value="' + key + '">' + label + "</option>");
    this.items.push({'key':key, 'label':label});
};

Onion.widget.Dropdown.prototype.val = function() {
    var v = this.control.val();
    if(v !== undefined) {
        return parseInt(v, 10);
    }
    return null;
};

Onion.widget.Dropdown.prototype.changed = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'selection':this.val()});
    if(this.handle_click) {
        // find current selection.
        if(!this.busy) {
            // XXX Not sure if this is 100% correct behaviour. We're
            // mostly avoiding doubleclicks here, which means the selection
            // can't really have changed. Else we might actually miss a
            // relevant event!

            this.jwin.add_task("event", "click", this.controlid);
            this.jwin.register_busy(this);
        }
    }
};

Onion.widget.Dropdown.prototype.set_properties = function(data) {
    Onion.widget.Control.prototype.set_properties.apply(this, arguments);
    if(data.item) {
        this.append_item(data.item[0], data.item[1]);
    }
    if('selection' in data && data.selection !== null) {
        this.control.val(data.selection.toString());
    }
    if('clear' in data && data.clear) {
        this.control.empty(); // doesn't work on google chrome?
        this.items = [];
    }
};

// register
Onion.widget.register("dropdown", Onion.widget.Dropdown);
