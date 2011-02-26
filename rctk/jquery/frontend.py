import os

from rctk.frontend import Frontend as Base
class JQueryFrontend(Base):
    name = "JQueryUI"

    def __init__(self, tk):
        self.tk = tk
        import rctk.jquery.resources

    @classmethod
    def workingdir(cls):
        return os.path.dirname(__file__)

    def index_html(self):
        """ return the main index.html template """
        tpl = os.path.join(self.workingdir(), 'main.html')
        return open(tpl, "r").read()
