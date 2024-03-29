/*
 * The tabbed layout comes from jqueryui. It's not JLayout based, which is
 * why it currently can't use everything from the JLayout baseclass.
 * XXX needs refactoring!
 */
Onion.layout.Tabbed = function(jwin, parent, config) {
    Onion.layout.Layout.apply(this, arguments);
    this.controls = [];
}

Onion.layout.Tabbed.prototype = new Onion.layout.Layout();

Onion.layout.Tabbed.prototype.create = function() {
    // don't inherit - assumes jlayout's .layout()
    if(this.created) {
        return;
    }
    this.parent.container.append("<div id='layoutmgr" + this.parent.controlid + "'></div>");
    this.layoutcontrol = $("#layoutmgr" + this.parent.controlid);
    this.layoutcontrol.append("<ul id='tabs" + this.parent.controlid + "' />");
    this.tabs = $("#tabs" + this.parent.controlid);
    this.layoutcontrol.tabs();
    this.created = true;
};

/*
 * Perhaps too primitive for tabs - you want to get hold of the tab
 */
Onion.layout.Tabbed.prototype.append = function(control, data) {
    this.create();

    var title = data.title;
    this.layoutcontrol.append("<div id='layoutctr" + control.controlid + "'></div>");
    var ctr = $("#layoutctr" + control.controlid);
    ctr.addClass("tab");
    control.control.appendTo(ctr);
    control.containingparent = this.parent;
    this.layoutcontrol.tabs('add', '#layoutctr' + control.controlid, title);
    this.controls.push(control);
};

Onion.layout.Tabbed.prototype.layout = function() {
    rctk.util.log("Parent w, h " + this.parent.control.width() + ", " + this.parent.control.height());
    this.layoutcontrol.width(this.parent.control.width());
    this.layoutcontrol.height(this.parent.control.height());
    var tabheight = this.layoutcontrol.find("ul").height();
    for(var i = 0; i < this.controls.length; i++) {
        console.log("Setting width");
        console.log(this.controls[i]);
        this.controls[i].control.css("width", this.parent.control.width());
        this.controls[i].control.css("height", this.parent.control.height() - tabheight);
        this.controls[i].layout_updated();
    }
};

Onion.layout.register('tabbed', Onion.layout.Tabbed);
