# Copyright 2023 BlueCat Networks Inc.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
"""Routes and back-end implementation of workflow "update_text_record"."""
import os

from bluecat.gateway.decorators import (
    api_exc_handler,
    page_exc_handler,
    require_permission,
)
from bluecat.util import no_cache

from .base import bp

from flask import send_from_directory
from pathlib import Path


@bp.route("/")
@page_exc_handler(default_message='Failed to load page "update_text_record".')
@require_permission("update_text_record")
#@require_permission("all")
def page():
    """
    Render page "update_text_record".

    :return: Response with the page's HTML.
    """
    return send_from_directory(
         os.path.dirname(os.path.abspath(str(__file__))), "html/updateTextRecord/index.html"
    )



@bp.route("/update_text_record", methods=["POST"])
@no_cache
@api_exc_handler(default_message="Failed to perform the action.")
#@require_permission("all")
@require_permission("update_text_record")
def api_post_manage_text_record():
    """
    Perform an action based on the provided parameters.
    """
    # Validate the parameters.

    # Perform the action.

    # Respond with success.
    return {
        "message": "Operation successfully completed.",
    }

