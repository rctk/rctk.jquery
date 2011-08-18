/*
 * TODO:
 *
 * Support insertion at any position
 * Support deletion
 */
Onion.widget.List = function(jwin, parent, controlid) {
    Onion.widget.Control.apply(this, arguments);
    this.items = [];
    this.size = 5; // default
    this.name = "list";
};

Onion.widget.List.prototype = new Onion.widget.Control();

Onion.widget.List.prototype.create = function(data) {
    var controlid = "ctrl"+this.controlid;
    this.jwin.factory.append('<select id="' + controlid + '">' + "</select>");
    this.control = $("#"+controlid);
    this.control.addClass(this.cssclass);
    this.control.addClass(this.name);
    this.handle_click = false;
    this.handle_doubleclick = false;

    this.control.attr('multiple', false);

    if(data.items) {
        for(var i = 0; i < data.items.length; i++) {
            this.append_item(data.items[i][0], data.items[i][1]);
        }
    }
    if('multiple' in data) {
       if(data.multiple) {
           this.control.attr('multiple', true);
       }
    }
    var self=this;
    this.control.change(function() { self.changed(); self.jwin.flush(); });
    this.control.dblclick(function() { self.doubleclick(); self.jwin.flush(); });
    this.set_properties(data);

    if(data.size) {
        this.size = Math.max(2, data.size);
    }
    this.setsize();
};

Onion.widget.List.prototype.append_item = function(key, label) {
    this.control.append('<option value="' + key + '">' + label + "</option>");
    this.items.push({'key':key, 'label':label});    
    this.setsize();
};

Onion.widget.List.prototype.val = function() {
    var v = this.control.val();
    // a non-multiselect will return a single val. We want to be consistent
    // and always return arrays
    if(!jQuery.isArray(v)) {
        v = [v];
    }
    v = jQuery.map(v, function(v, i) { return parseInt(v, 10); });
    return v;    
};

Onion.widget.List.prototype.setsize = function() {
    this.control.attr('size', this.size);
};

Onion.widget.List.prototype.set_properties = function(data) {
    Onion.widget.Control.prototype.set_properties.apply(this, arguments);
    if(data.item) {
        this.append_item(data.item[0], data.item[1]);
    }
    if('multiple' in data) {
       if(data.multiple) {
           this.control.attr('multiple', true);
       }
       else {
           this.control.attr('multiple', false);
       }
    }
    if('selection' in data) {
        if(jQuery.isArray(data.selection)) {
            var converted = jQuery.map(data.selection, function(n, i) { return n.toString(); });
            this.control.val(converted);
        }
        else {
            this.control.val(data.selection.toString());
        }
    }
    if('clear' in data && data.clear) {
        this.control.empty(); // doesn't work on google chrome?
        this.items = [];
    }

    if(data.size) {
        this.size = Math.max(2, data.size);
        this.setsize();
    }
};


Onion.widget.List.prototype.changed = function() {
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

Onion.widget.List.prototype.doubleclick = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'selection':this.val()});
    if(this.handle_doubleclick) {
        // find current selection.
        if(!this.busy) {
            this.jwin.add_task("event", "doubleclick", this.controlid);
            this.jwin.register_busy(this);
        }
    }
};

Onion.widget.register("list", Onion.widget.List);
