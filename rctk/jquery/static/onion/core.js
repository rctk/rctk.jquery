var rctk = rctk || {};

rctk.jquery = (function() {
    return {
        run: function() {
            var o = new Onion.core.JWinClient();
            rctk.core.handlers.handle = rctk.util.proxy(o.do_work, o);
            rctk.core.handlers.request = rctk.util.proxy(this.rctk_request, this);
            rctk.core.handlers.dump = rctk.util.proxy(o.dump, o);
            rctk.core.run();
        },
        rctk_request: function(path, callback, sessionid, data) {
            $.ajax({
                url:path,
                type: "POST",
                dataType: "json",
                data: data,
                headers: {"rctk-sid":sessionid},
                success: function(data, textStatus, jqXHR) {
                    callback(jqXHR.getResponseHeader('rctk-sid'), data);
                }
            });
       }
    }
})(jQuery);

Onion.core.JWinClient = function() {
    this.crashed = false;
    var root = new Onion.widget.Root(this);
    root.create();

    this.controls = {0:root};
    // references to the actual div's
    this.root = $("#root");
    this.factory = $("#factory");
    this.toplevels = $("#toplevels");
    this.busy = []
    this.request_count = 0;
}

Onion.core.JWinClient.prototype.dump = function(data, debug) {
    if(debug) {
        this.root.append('<div id="system" class="jqmWindow" style="width: 600px; height: 600px"><b>The application ' + data.application + ' has crashed. </b><br><p>Click <a href="/">here</a> to restart</p><br><div style="overflow: auto; width: 600px; height: 500px;">' + data.traceback + '</div></div>');
    }
    else {
        this.root.append('<div id="system" class="jqmWindow" style="width: 600px; height: 300px"><b>The application ' + data.application + ' has crashed. </b><br><p>Click <a href="/">here</a> to restart</p></div>');

    }
    $("#system").jqm({'modal':true});
    $("#system").jqmShow();
    this.crashed = true;
    return;

}

Onion.core.JWinClient.prototype.do_work = function(data) {
    var control_class = Onion.widget.map(data.control);
    var parent = this.controls[data.parentid];
    var id = data.id;
                       
    if(this.crashed) {
        return;
    }

    if('crash' in data && data.crash) {
        this.dump(data, true); // true == debug, in core now.
        return;
    }
    switch(data.action) {
    case "append":
        var container = this.controls[data.id];
        var child = this.controls[data.child];
        container.append(child, data);
        break;
    case "remove":
        var container = this.controls[data.id];
        var child = this.controls[data.child];
        container.remove(child, data);
        break;
    case "create":
        // TODO?: if this fails 'the other side' is not informed!
        if(control_class) {
           c = new control_class(this, parent, id);
           c.create(data);
           this.controls[id] = c;
        }
        break;
    case "destroy":
        var control = this.controls[id];
        control.destroy();
        this.controls[id] = null
        break;
    case "update":
        // update a control. Rename to sync?
        var control = this.controls[id];
        control.set_properties(data.update);
        break;
    case "call":
        // call a method with arguments on a control
        var control = this.controls[id];
        var method = data.method;
        var args = data.args || [];
        control[method].apply(control, args)
        break;
    case "handler":
        var control = this.controls[id];
        control["handle_"+data.type] = true;
        break;
    case "layout":
        var container = this.controls[id];
        container.setLayout(data.type, data.config);
        break;
    case "relayout":
        var container = this.controls[id];
        container.relayout(data.config);
        break;
    case "timer":
        rctk.util.log("Handling timer " + id + ", " + data.milliseconds);
        var self=this;
        setTimeout(
          function() { 
             self.add_task("event", "timer", id);
             self.flush();
           }, data.milliseconds);
        break;
    }
}

Onion.core.JWinClient.prototype.handle_tasks = function (data, status) {
    this.request_count--;
    if(this.request_count == 0)  {
        $("body").css("cursor", "auto");
    }

    if(data) {
      for(var i=0; i < data.length; i++) {
        this.do_work(data[i]);
      }
    }

    /*
     * time to enable busy controls again
     */
    for(var i in this.busy) {
        rctk.util.log("Control no longer busy", c);
        this.busy[i].busy = false;
    }
    this.busy = [];

    this.flush();

}

Onion.core.JWinClient.prototype.add_task = function(method, type, id, data) {
    rctk.core.push({'method':method, 'type':type, 'id':id, 'data':data});
}

Onion.core.JWinClient.prototype.register_busy = function(control) {
    /*
     * A busy control cannot handle new events until the current
     * handler has finished handling. This means a control is marked
     * busy once it's clicked and marked unbusy once the (optional)
     * tasks generated by its handler have been handled.
     */
    control.busy = true;
    this.busy.push(control);
}

Onion.core.JWinClient.prototype.flush = function() {
    // widgets call this to flush through self.jwin
    // completely replacing self.jwin with rctk.core not an option yet
    // due to busy registration
    rctk.util.log("Deprecated JWinClient.flush called");
    rctk.core.flush();
}
