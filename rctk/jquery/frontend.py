import os

import rctk.core

from rctk.resourceregistry import getResourceRegistry

from rctk.frontend import Frontend as Base
class JQueryFrontend(Base):
    name = "JQueryUI"

    @classmethod
    def workingdir(cls):
        return os.path.dirname(__file__)

    @classmethod
    def index_html(cls):
        """ return the main index.html template """
        import rctk.jquery.resources
        path = os.path.join(cls.workingdir(), 'main.html')
        tpl = open(path, "r").read()
        header = getResourceRegistry().header()
        return tpl.replace('<!-- rctk-header -->', header)

