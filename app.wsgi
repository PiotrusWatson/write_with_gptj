import os
# Change working directory so relative paths (and template lookup) work again
os.chdir(os.path.dirname(__file__))

from main import application
application = application