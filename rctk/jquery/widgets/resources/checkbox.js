Onion.widget.CheckBox = function(jwin, parent, controlid) {
    Onion.widget.Control.apply(this, arguments);
    this.name = "checkbox";
}

Onion.widget.CheckBox.prototype = new Onion.widget.Control();

Onion.widget.CheckBox.prototype.create = function(data) {
    var controlid = "ctrl" + this.controlid;
    this.jwin.factory.append('<div id="' + controlid + '"><input type="checkbox" id="checkbox-' + controlid + '" ></input><label id="label-' + controlid + '" for="checkbox-' + controlid +'"></label></div>');
    this.control = $("#" + controlid);
    this.checkbox = this.control.find("input");
    this.control.addClass(this.cssclass);
    this.control.addClass(this.name);
    this.handle_click = false;

    var self=this;
    this.checkbox.change(
        function() { self.changed(); self.jwin.flush(); }
    );
    this.set_properties(data);
}

/*
 * Handle change events, which means syncing the updated state and possibly
 * firing the 'click' event. By (ab)using change to detect clicks we can
 * guarantee sync will take place before click
 */
Onion.widget.CheckBox.prototype.changed = function() {
    this.jwin.add_task("sync", "sync", this.controlid, {'checked':this.checkbox.attr('checked')});

    if(this.handle_click) {
        if(!this.busy) {
            this.jwin.add_task("event", "click", this.controlid);
            this.jwin.register_busy(this);
        }
    }
}

Onion.widget.CheckBox.prototype.set_properties = function(data) {
    Onion.widget.Control.prototype.set_properties.apply(this, arguments);
    if('checked' in data) {
        this.checkbox.attr('checked', data.checked);
    }
    if('text' in data) {
        $("#label-ctrl" + this.controlid).text(data.text);
    }
}

Onion.widget.register("checkbox", Onion.widget.CheckBox);
