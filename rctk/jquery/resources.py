from rctk.resourceregistry import addResource, JSFileResource, CSSFileResource

addResource(JSFileResource('static/jqueryui-1.8.4/jquery-ui-1.8.4.custom.min.js'))
addResource(JSFileResource('core/onion.js'))
addResource(JSFileResource('core/core.js'))
addResource(CSSFileResource('core/onion.css'))
addResource(CSSFileResource('core/onion.jqueryui.css'))

import rctk.jquery.layouts.resources
import rctk.jquery.widgets.resources
