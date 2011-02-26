
/* Define the Onion global namespace object */
if (typeof Onion === 'undefined' || !Onion) {
    var Onion = {};
}

Onion.env = Onion.env || {
    framework: null
};

/* Namespace registration, shamelessly ripped from YUI2. */
Onion.namespace = function() {
    var o = null, d;
    
    for (var i = 0; i < arguments.length; i = i + 1) {
        d = ("" + arguments[i]).split(".");
        o = Onion;

        // Onion is implied, so it is ignored if it is included
        for (j = (d[0] == "Onion") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

Onion.log = function() {
    if (Onion.util.log) {
        return Onion.util.log.apply(Onion.util, arguments);
    } else {
        return false;
    }
};

function registry() {
    var map = [];
    
    return {
        /* Register a class with a name */
        register: function(name, klass) {
            if (!map[name]) {
                map[name] = klass;
            }
        },
        /* Lookup the class using a name */
        map: function(name) {
            return map[name] || null;
        }
    }
};

(function() {
    /* declare neccesary namespaces, setup registries. */
    Onion.namespace('core');
    Onion.widget = registry();
    Onion.layout = registry();    
})();
