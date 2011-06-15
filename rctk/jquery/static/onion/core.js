var rctk = rctk || {};

rctk.jquery = (function($) {
  // return a functions so we can create instances using new
  return function() {
    var o = null;
    var core = null;

    return {
        run: function() {
            core = new rctk.core();
            o = new Onion.core.JWinClient(core);
            core.handlers.handle = rctk.util.proxy(o.do_work, o);
            core.handlers.request = rctk.util.proxy(this.rctk_request, this);
            core.handlers.dump = rctk.util.proxy(o.dump, o);
            core.handlers.construct = rctk.util.proxy(this.construct, this);
            var root = new Onion.widget.Root(this);
            root.create();
            core.run(root);
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
        },
        construct: function(class, parent, id) {
            var control_class = Onion.widget.map(class);
            c = new control_class(o, parent, id);
            return c;
        }
    }
  }
})(jQuery);

Onion.core.JWinClient = function(core) {
    this.core = core;

    // references to the actual div's
    this.root = $("#root");
    this.factory = $("#factory");
    this.toplevels = $("#toplevels");
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
    return;

}

Onion.core.JWinClient.prototype.register_busy = function(c) {
    rctk.util.log("Deprecated jwin register_busy called");
    this.core.register_busy(c);
}

Onion.core.JWinClient.prototype.get_control = function(id) {
    rctk.util.log("Deprecated jwin get_control called");
    return this.core.get_control(id);
}

Onion.core.JWinClient.prototype.add_task = function(method, type, id, data) {
    rctk.util.log("Deprecated jwin add_task called");
    this.core.push({'method':method, 'type':type, 'id':id, 'data':data});
}

Onion.core.JWinClient.prototype.flush = function() {
    // widgets call this to flush through self.jwin
    // completely replacing self.jwin with rctk.core not an option yet
    // due to busy registration
    rctk.util.log("Deprecated JWinClient.flush called");
    this.core.flush();
}
