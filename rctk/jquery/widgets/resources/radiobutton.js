Onion.widget.RadioButton = function(jwin, parent, controlid) {
    Onion.widget.Control.apply(this, arguments);
    this.name = "checkbox";
}

Onion.widget.RadioButton.prototype = new Onion.widget.Control();

Onion.widget.RadioButton.prototype.create = function(data) {
    var controlid = "ctrl" + this.controlid;
    if (data.group) {
        var groupid = "ctrl" + data.group;
        this.jwin.factory.append('<input type="radio" id="' + controlid + '" name="' + groupid + '"></input>');
    } else {
        this.jwin.factory.append('<input type="checkbox" id="' + controlid + '"></input>');
    }
    this.control = $("#" + controlid);
    this.control.attr('defaultChecked', data.defaultChecked);
    this.control.addClass(this.cssclass);
    this.control.addClass(this.name);
    this.handle_click = false;

    var self=this;
    this.control.change(
        function() { self.changed(); self.jwin.flush(); }
    );
    this.set_properties(data);
}

/*
 * Handle change events, which means syncing the updated state and possibly
 * firing the 'click' event. By (ab)using change to detect clicks we can
 * guarantee sync will take place before click
 */
Onion.widget.RadioButton.prototype.changed = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'checked':this.control.attr('checked')});

    if(this.handle_click) {
        if(!this.busy) {
            this.jwin.add_task("event", "click", this.controlid);
            this.jwin.register_busy(this);
        }
    }
}

Onion.widget.RadioButton.prototype.set_properties = function(data) {
    Onion.widget.Control.prototype.set_properties.apply(this, arguments);
    // use === operator because we're testing a boolean
    if('checked' in data) {
        this.control.attr('checked', data.checked);
    }
}

// register
Onion.widget.register("checkbox", Onion.widget.RadioButton);
