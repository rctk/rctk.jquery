/*
 * A panel is a simple container-control. Mostly used to
 * nest layoutmanagers. It support scrolling (horizontally
 * for now, using defaults), but we're not using the default
 * html/css "overflow" scrolling because we can't properly 
 * predict the exact size of the panel:
 * - the width of the panel will be the outer width of the entire
 *   panel includign scrollbar, so the available area will be smaller
 * - scrollbars won't be shown until really necessary which means either
 *   the panel will expand or the inner area will shrink.
 * using jScrollingPane makes all of this predictable.
 *
 * See also: http://stackoverflow.com/questions/4334366/
 */
Onion.widget.Panel = function(jwin, parent, controlid) {
    Onion.widget.Container.apply(this, arguments);
    this.name = "panel";
};

Onion.widget.Panel.prototype = new Onion.widget.Container();

Onion.widget.Panel.prototype.create = function(data) {
    Onion.widget.Container.prototype.create.apply(this, arguments);

    if(data.scrolling) {
        this.scrolling = true;

        this.control.jScrollPane({maintainPosition:true});
        this.api = this.control.data('jsp');
        this.container = this.api.getContentPane();
    }
    else {
        this.scrolling = false;
    }
};

Onion.widget.Panel.prototype.update_scrolling = function() {
    if(this.scrolling) {
        this.api.reinitialise();
    }
};

Onion.widget.Panel.prototype.append = function(control, data) {
    Onion.widget.Container.prototype.append.apply(this, arguments);
    this.update_scrolling();
};

Onion.widget.Panel.prototype.layout_updated = function() {
    Onion.widget.Container.prototype.layout_updated.apply(this, arguments);
    this.update_scrolling();
};

Onion.widget.Panel.prototype.max_size = function() {
    /*
     * A scolling panel has an unlimited height. If restricted,
     * no scrollbar may appear
     */
    if(this.scrolling) {
        return {width:this.maxwidth, height:0};
    }
    else {
        return {width:this.maxwidth, height:this.maxheight};
    }
};

Onion.widget.Panel.prototype.set_properties = function(data) {
    Onion.widget.Container.prototype.set_properties.apply(this, arguments);

    if(this.scrolling && 'scrollto' in data) {
        if(data.scrollto == "top") {
            this.api.scrollToPercentY(0);
        }
        else if(data.scrollto == "bottom") {
            this.api.scrollToPercentY(1);
        }
        else if(data.scrollto == "left") {
            this.api.scrollToPercentX(0);
        }
        else if(data.scrollto == "right") {
            this.api.scrollToPercentX(1);
        }
    }
    // ignore scrolling, it can only be set at create
};

Onion.widget.register("panel", Onion.widget.Panel);
