from rctk.resourceregistry import addResource, JSFileResource, CSSFileResource

addResource(JSFileResource('static/jqueryui-1.8.4/jquery-ui-1.8.4.custom.min.js'))
addResource(JSFileResource('static/onion/onion.js'))
addResource(JSFileResource('static/onion/core.js'))
addResource(CSSFileResource('static/onion/onion.css'))
addResource(CSSFileResource('static/onion/onion.jqueryui.css'))

addResource(JSFileResource('static/plugins/jqModal/jqModal.js'))
addResource(CSSFileResource('static/plugins/jqModal/jqModal.css'))

import rctk.jquery.layouts.resources
import rctk.jquery.widgets.resources

