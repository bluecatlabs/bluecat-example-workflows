# Copyright 2024 BlueCat Networks Inc.

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

# pylint: disable=import-error
from bluecat.gateway.decorators import (
    api_exc_handler,
    page_exc_handler,
    require_permission,
)

# pylint: disable=import-error
from bluecat.util import no_cache

from .base import bp

from flask import g, request, send_from_directory


@bp.route("/delete_text_record")
@page_exc_handler(default_message='Failed to load page "update_text_record".')
@require_permission("delete_text_record")
def page():
    """
    Render page "Delete text record".

    :return: Response with the page's HTML.
    """
    return send_from_directory(
        os.path.dirname(os.path.abspath(str(__file__))),
        "html/deleteTextRecord/index.html",
    )


@bp.route("/delete_text_record/configurations")
@api_exc_handler(default_message="Failed to get configurations available on BAM.")
@require_permission("delete_text_record")
def api_get_configurations():
    """
    Get configurations for the dropDown in Delete text record page
    """
    rdata = g.user.bam_api.v2.http_get(
        "/configurations",
        params={"fields": "id,name", "orderBy": "desc(name)", "limit": "9999"},
    )
    configurations = rdata["data"]
    return {"configurations": configurations}


@bp.route("/delete_text_record/views", methods=["POST"])
@api_exc_handler(default_message="Failed to get views available on BAM.")
@require_permission("delete_text_record")
def api_get_views():
    """
    Get views under the selected configuration in Delete text record page
    """
    configuration_id = request.form["configuration"]

    rdata = g.user.bam_api.v2.http_get(
        f"/configurations/{configuration_id}/views",
        params={"fields": "id,name", "orderBy": "desc(name)", "limit": "9999"},
    )
    views = rdata["data"]
    return {"views": views}


@bp.route("/delete_text_record/zones", methods=["POST"])
@api_exc_handler(default_message="Failed to get zones available on BAM.")
@require_permission("delete_text_record")
def api_get_zones():
    """
    Get zones under the selected view in Delete text record page
    """
    view_id = request.form["view"]
    rdata = g.user.bam_api.v2.http_get(
        f"/views/{view_id}/zones",
        params={
            "fields": "id,name",
            "orderBy": "desc(name)",
            "limit": "9999",
            "filter": "type:eq('Zone')",
        },
    )
    zones = rdata["data"]
    return {"zones": zones}


@bp.route("/delete_text_record/records", methods=["POST"])
@api_exc_handler(default_message="Failed to get records available on BAM.")
@require_permission("delete_text_record")
def api_get_records():
    """
    Get records under the selected zone in Delete text record page
    """
    zone_id = request.form["zone"]
    rdata = g.user.bam_api.v2.http_get(
        f"/zones/{zone_id}/resourceRecords",
        params={
            "fields": "id,name,text",
            "orderBy": "desc(name)",
            "limit": "9999",
        },
    )

    records = rdata["data"]
    return {"records": records}


@bp.route("/delete_text_record/data", methods=["POST"])
@no_cache
@api_exc_handler(default_message="Failed to perform the action.")
@require_permission("delete_text_record")
def base_data():
    """
    get the list of configurations
    """

    data = {
        "configurations": [],
    }
    rdata = g.user.bam_api.v2.http_get(
        "/configurations",
        params={"fields": "id,name", "orderBy": "desc(name)", "limit": "9999"},
    )
    data["configurations"] = rdata["data"]

    return data


@bp.route("/delete_text_record/delete/<id>", methods=["DELETE"])
@no_cache
@api_exc_handler(default_message="Failed to delete text record.")
@require_permission("delete_text_record")
def api_delete_text_record(id):  # pylint: disable=redefined-builtin
    """Deletes a text record"""

    g.user.bam_api.v2.http_delete(
        f"/resourceRecords/{id}",
    )
    return {"message": "Deleted resource record successfully."}
