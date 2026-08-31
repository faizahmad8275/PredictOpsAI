from fastapi import HTTPException, Request
from fastapi.responses import FileResponse
from bson import ObjectId
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth

import os
import re

from database.connection import db


# =========================================================
# DATABASE COLLECTIONS
# =========================================================

reports_collection = db["reports"]
predictions_collection = db["predictions"]
incidents_collection = db["incidents"]


# =========================================================
# COLORS
# =========================================================

DARK = colors.HexColor("#0F172A")
DARK_2 = colors.HexColor("#1E293B")

BLUE = colors.HexColor("#2563EB")
BLUE_LIGHT = colors.HexColor("#EFF6FF")

GREEN = colors.HexColor("#16A34A")
GREEN_DARK = colors.HexColor("#166534")
GREEN_LIGHT = colors.HexColor("#F0FDF4")

ORANGE = colors.HexColor("#EA580C")
ORANGE_DARK = colors.HexColor("#9A3412")
ORANGE_LIGHT = colors.HexColor("#FFF7ED")

RED = colors.HexColor("#DC2626")
RED_DARK = colors.HexColor("#991B1B")
RED_LIGHT = colors.HexColor("#FEF2F2")

PURPLE = colors.HexColor("#7C3AED")
PURPLE_LIGHT = colors.HexColor("#F5F3FF")

SLATE = colors.HexColor("#475569")
MUTED = colors.HexColor("#64748B")
LIGHT_TEXT = colors.HexColor("#94A3B8")

BORDER = colors.HexColor("#E2E8F0")
LIGHT_BG = colors.HexColor("#F8FAFC")
WHITE = colors.white


# =========================================================
# HELPERS
# =========================================================

def safe_text(value):
    if value is None:
        return ""

    return str(value)


def serialize_document(document):

    if document is None:
        return None

    if isinstance(document, ObjectId):
        return str(document)

    if isinstance(document, datetime):
        return document.isoformat()

    if isinstance(document, dict):

        result = {}

        for key, value in document.items():

            if key == "_id":
                result["id"] = str(value)

            else:
                result[str(key)] = serialize_document(value)

        return result

    if isinstance(document, (list, tuple)):

        return [
            serialize_document(item)
            for item in document
        ]

    return document


def wrap_text(
    text,
    font_name,
    font_size,
    max_width
):

    text = safe_text(text)

    words = text.split()

    if not words:
        return []

    lines = []
    current_line = ""

    for word in words:

        test_line = (
            word
            if not current_line
            else current_line + " " + word
        )

        if stringWidth(
            test_line,
            font_name,
            font_size
        ) <= max_width:

            current_line = test_line

        else:

            if current_line:
                lines.append(current_line)

            current_line = word

    if current_line:
        lines.append(current_line)

    return lines


def draw_wrapped_text(
    pdf,
    text,
    x,
    y,
    max_width,
    font_name="Helvetica",
    font_size=8,
    leading=4 * mm,
    max_lines=None
):

    lines = wrap_text(
        text,
        font_name,
        font_size,
        max_width
    )

    if max_lines:
        lines = lines[:max_lines]

    pdf.setFont(
        font_name,
        font_size
    )

    for line in lines:

        pdf.drawString(
            x,
            y,
            line
        )

        y -= leading

    return y


# =========================================================
# SECTION TITLE
# =========================================================

def draw_section_title(
    pdf,
    title,
    x,
    y
):

    heading_text = f"{title}:"

    pdf.setFillColor(DARK)

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(
        x,
        y,
        heading_text
    )

    text_width = stringWidth(
        heading_text,
        "Helvetica-Bold",
        10
    )

    pdf.setStrokeColor(DARK)

    pdf.setLineWidth(0.7)

    pdf.line(
        x,
        y - 1.5 * mm,
        x + text_width,
        y - 1.5 * mm
    )


# =========================================================
# METRIC CARD
# =========================================================

def draw_metric_card(
    pdf,
    x,
    y,
    width,
    height,
    label,
    value,
    accent,
    icon_text=None
):

    pdf.setFillColor(WHITE)

    pdf.roundRect(
        x,
        y - height,
        width,
        height,
        3 * mm,
        fill=1,
        stroke=0
    )

    pdf.setStrokeColor(BORDER)

    pdf.setLineWidth(0.6)

    pdf.roundRect(
        x,
        y - height,
        width,
        height,
        3 * mm,
        fill=0,
        stroke=1
    )

    pdf.setFillColor(accent)

    pdf.roundRect(
        x,
        y - height,
        2 * mm,
        height,
        1 * mm,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(MUTED)

    pdf.setFont(
        "Helvetica-Bold",
        6.7
    )

    pdf.drawString(
        x + 6 * mm,
        y - 7 * mm,
        label
    )

    pdf.setFillColor(DARK)

    pdf.setFont(
        "Helvetica-Bold",
        15
    )

    pdf.drawString(
        x + 6 * mm,
        y - 15.5 * mm,
        safe_text(value)
    )


# =========================================================
# HEADER
# =========================================================

def draw_pdf_header(
    pdf,
    width,
    height,
    margin
):

    header_height = 51 * mm

    pdf.setFillColor(DARK)

    pdf.rect(
        0,
        height - header_height,
        width,
        header_height,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(
        colors.HexColor("#1D4ED8")
    )

    pdf.circle(
        width + 4 * mm,
        height - 2 * mm,
        38 * mm,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(BLUE)

    pdf.roundRect(
        margin,
        height - 37 * mm,
        13 * mm,
        13 * mm,
        3 * mm,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(WHITE)

    pdf.setFont(
        "Helvetica-Bold",
        16
    )

    pdf.drawCentredString(
        margin + 6.5 * mm,
        height - 32.5 * mm,
        "P"
    )

    pdf.setFillColor(WHITE)

    pdf.setFont(
        "Helvetica-Bold",
        20
    )

    pdf.drawString(
        margin + 18 * mm,
        height - 30 * mm,
        "PredictOpsAI"
    )

    pdf.setFillColor(
        colors.HexColor("#CBD5E1")
    )

    pdf.setFont(
        "Helvetica",
        7.5
    )

    pdf.drawString(
        margin + 18 * mm,
        height - 36 * mm,
        "AI-POWERED OPERATIONS INTELLIGENCE"
    )

    pdf.setFillColor(WHITE)

    pdf.setFont(
        "Helvetica-Bold",
        17
    )

    pdf.drawString(
        margin,
        height - 44 * mm,
        "AI Operations Analytics Report"
    )


# =========================================================
# FOOTER
# =========================================================

def draw_pdf_footer(
    pdf,
    width,
    margin
):

    line_y = 17 * mm

    pdf.setStrokeColor(BORDER)

    pdf.setLineWidth(0.7)

    pdf.line(
        margin,
        line_y + 8 * mm,
        width - margin,
        line_y + 8 * mm
    )

    pdf.setFillColor(DARK)

    pdf.setFont(
        "Helvetica-Bold",
        7.5
    )

    pdf.drawString(
        margin,
        line_y,
        "PredictOpsAI"
    )

    pdf.setFillColor(MUTED)

    pdf.setFont(
        "Helvetica",
        6.8
    )

    pdf.drawString(
        margin,
        line_y - 4 * mm,
        "AI-Powered Operations Intelligence"
    )

    pdf.setFillColor(MUTED)

    pdf.setFont(
        "Helvetica",
        6.8
    )

    pdf.drawRightString(
        width - margin,
        line_y,
        "AI Operations Analytics Report"
    )


# =========================================================
# CREATE REPORT
# =========================================================

async def create_report(
    report,
    current_user
):

    try:

        user_id = str(
            current_user["_id"]
        )

        user_name = safe_text(
            current_user.get(
                "name",
                "User"
            )
        )

        report_data = {

            "report_name": safe_text(
                report.report_name
            ),

            "report_type": safe_text(
                report.report_type
            ),

            "description": safe_text(
                report.description
            ),

            "user_id": user_id,

            "user_name": user_name,

            "status": "completed",

            # =================================================
            # SAVE CREATED TIME AS UTC
            # =================================================

            "created_at": datetime.now(
                timezone.utc
            ).isoformat(),

            "downloads": 0
        }

        result = reports_collection.insert_one(
            report_data
        )

        report_data["id"] = str(
            result.inserted_id
        )

        clean_report = serialize_document(
            report_data
        )

        return {
            "message": "Report generated successfully",
            "report": clean_report
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Create report error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create report"
        )


# =========================================================
# GET ALL REPORTS
# =========================================================

async def get_reports(
    current_user
):

    try:

        user_id = str(
            current_user["_id"]
        )

        reports = []

        cursor = reports_collection.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        )

        for report in cursor:

            reports.append(
                serialize_document(report)
            )

        return reports

    except Exception as e:

        print(
            "Get reports error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch reports"
        )


# =========================================================
# GET REPORT BY ID
# =========================================================

async def get_report_by_id(
    report_id: str,
    current_user
):

    try:

        object_id = ObjectId(
            report_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid report ID"
        )

    try:

        user_id = str(
            current_user["_id"]
        )

        report = reports_collection.find_one(
            {
                "_id": object_id,
                "user_id": user_id
            }
        )

        if not report:

            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        return serialize_document(report)

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Get report by ID error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch report"
        )


# =========================================================
# DELETE REPORT
# =========================================================

async def delete_report(
    report_id: str,
    current_user
):

    try:

        try:

            object_id = ObjectId(
                report_id
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid report ID"
            )

        current_user_id = str(
            current_user["_id"]
        )

        report = reports_collection.find_one(
            {
                "_id": object_id,
                "user_id": current_user_id
            }
        )

        if not report:

            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        result = reports_collection.delete_one(
            {
                "_id": object_id,
                "user_id": current_user_id
            }
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Report could not be deleted"
            )

        return {
            "message": "Report deleted successfully",
            "report_id": report_id
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Delete report error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete report"
        )


# =========================================================
# GET USER PREDICTIONS
# =========================================================

def get_user_predictions(
    current_user_id
):

    try:

        current_user_id = str(
            current_user_id
        ).strip()

        print(
            "=============================================="
        )

        print(
            "REPORT PREDICTION DEBUG"
        )

        print(
            "Current User ID:",
            current_user_id
        )

        print(
            "=============================================="
        )

        user_id_values = [
            current_user_id
        ]

        try:

            user_object_id = ObjectId(
                current_user_id
            )

            user_id_values.append(
                user_object_id
            )

        except Exception:

            user_object_id = None

        direct_predictions = list(
            predictions_collection.find(
                {
                    "created_by": {
                        "$in": user_id_values
                    }
                }
            )
        )

        print(
            "Direct Predictions Found:",
            len(direct_predictions)
        )

        incident_documents = list(
            incidents_collection.find(
                {
                    "created_by": {
                        "$in": user_id_values
                    }
                },
                {
                    "_id": 1
                }
            )
        )

        print(
            "User Incidents:",
            len(incident_documents)
        )

        incident_ids = []

        for incident in incident_documents:

            incident_id = incident.get(
                "_id"
            )

            if incident_id:

                incident_ids.append(
                    incident_id
                )

                incident_ids.append(
                    str(incident_id)
                )

        incident_predictions = []

        if incident_ids:

            incident_predictions = list(
                predictions_collection.find(
                    {
                        "incident_id": {
                            "$in": incident_ids
                        }
                    }
                )
            )

        print(
            "Incident Predictions Found:",
            len(incident_predictions)
        )

        all_predictions = (
            direct_predictions
            + incident_predictions
        )

        unique_predictions = []

        seen_ids = set()

        for prediction in all_predictions:

            prediction_id = str(
                prediction.get("_id")
            )

            if prediction_id not in seen_ids:

                seen_ids.add(
                    prediction_id
                )

                unique_predictions.append(
                    prediction
                )

        for prediction in unique_predictions:

            print(
                "Prediction:",
                str(
                    prediction.get("_id")
                ),
                "| created_by:",
                prediction.get("created_by"),
                "| incident_id:",
                prediction.get("incident_id"),
                "| risk:",
                prediction.get("risk_level")
            )

        print(
            "=============================================="
        )

        print(
            "TOTAL UNIQUE PREDICTIONS:",
            len(unique_predictions)
        )

        print(
            "=============================================="
        )

        return unique_predictions

    except Exception as e:

        print(
            "Get user predictions error:",
            repr(e)
        )

        return []


# =========================================================
# DOWNLOAD / GENERATE PDF
# =========================================================

async def download_report(
    report_id: str,
    current_user,
    request: Request
):

    try:

        # =================================================
        # VALIDATE REPORT ID
        # =================================================

        try:

            object_id = ObjectId(
                report_id
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid report ID"
            )

        # =================================================
        # CURRENT USER
        # =================================================

        current_user_id = str(
            current_user["_id"]
        )

        current_user_name = safe_text(
            current_user.get(
                "name",
                "User"
            )
        )

        # =================================================
        # USER TIMEZONE
        # =================================================
        #
        # Dashboard4 already displays the correct
        # Asia/Kolkata time.
        #
        # We keep PDF timezone handling on backend.
        #
        # If frontend sends X-Timezone, it will be used.
        # If it does not send anything, Asia/Kolkata
        # will be used instead of UTC.
        #
        # =================================================

        user_timezone = request.headers.get(
            "X-Timezone",
            "Asia/Kolkata"
        )

        try:

            user_tz = ZoneInfo(
                user_timezone
            )

        except Exception:

            print(
                "Invalid timezone received:",
                user_timezone,
                "| Using Asia/Kolkata"
            )

            user_tz = ZoneInfo(
                "Asia/Kolkata"
            )

        # =================================================
        # FIND REPORT
        # =================================================

        report = reports_collection.find_one(
            {
                "_id": object_id,
                "user_id": current_user_id
            }
        )

        if not report:

            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        # =================================================
        # FETCH PREDICTIONS
        # =================================================

        predictions = get_user_predictions(
            current_user_id
        )

        total_predictions = len(
            predictions
        )

        # =================================================
        # COUNTERS
        # =================================================

        successful_predictions = 0
        high_risk_predictions = 0
        critical_predictions = 0

        # =================================================
        # ANALYZE PREDICTIONS
        # =================================================

        for prediction in predictions:

            predicted_status = str(
                prediction.get(
                    "predicted_status",
                    ""
                )
            ).lower().strip()

            risk_level = str(
                prediction.get(
                    "risk_level",
                    ""
                )
            ).lower().strip()

            if (
                risk_level == "critical"
                or predicted_status in [
                    "critical",
                    "critical_risk"
                ]
            ):

                critical_predictions += 1

            elif (
                risk_level == "high"
                or predicted_status == "high_risk"
            ):

                high_risk_predictions += 1

            elif (
                risk_level in [
                    "low",
                    "safe",
                    "normal"
                ]
                or predicted_status in [
                    "low",
                    "low_risk",
                    "safe",
                    "normal",
                    "success",
                    "successful"
                ]
            ):

                successful_predictions += 1

        # =================================================
        # SUCCESS RATE
        # =================================================

        success_rate = (

            (
                successful_predictions
                / total_predictions
            )
            * 100

            if total_predictions > 0

            else 0
        )

        # =================================================
        # RESPONSE TIME
        # =================================================

        response_times = []

        response_fields = [
            "response_time",
            "response_time_ms",
            "processing_time",
            "processing_time_ms",
            "execution_time",
            "latency",
            "latency_ms"
        ]

        for prediction in predictions:

            response_time = None

            for field in response_fields:

                if prediction.get(field) is not None:

                    response_time = prediction.get(
                        field
                    )

                    break

            try:

                if response_time is not None:

                    response_time = float(
                        response_time
                    )

                    if response_time > 0:

                        response_times.append(
                            response_time
                        )

            except (
                ValueError,
                TypeError
            ):

                pass

        average_response = (

            sum(response_times)
            / len(response_times)

            if response_times

            else 0
        )

        # =================================================
        # RISK COUNT
        # =================================================

        total_risk_predictions = (
            high_risk_predictions
            + critical_predictions
        )

        # =================================================
        # REPORT DIRECTORY
        # =================================================

        base_dir = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        reports_folder = os.path.join(
            base_dir,
            "generated_reports"
        )

        os.makedirs(
            reports_folder,
            exist_ok=True
        )

        # =================================================
        # SAFE FILE NAME
        # =================================================

        safe_name = safe_text(
            report.get(
                "report_name",
                "PredictOpsAI_Report"
            )
        )

        safe_name = re.sub(
            r"[^a-zA-Z0-9_-]",
            "_",
            safe_name
        )

        file_name = (
            f"{safe_name}_{report_id}.pdf"
        )

        file_path = os.path.join(
            reports_folder,
            file_name
        )

        # =================================================
        # CREATE PDF
        # =================================================

        pdf = canvas.Canvas(
            file_path,
            pagesize=A4
        )

        width, height = A4

        margin = 18 * mm

        # =================================================
        # BACKGROUND
        # =================================================

        pdf.setFillColor(WHITE)

        pdf.rect(
            0,
            0,
            width,
            height,
            fill=1,
            stroke=0
        )

        # =================================================
        # HEADER
        # =================================================

        draw_pdf_header(
            pdf,
            width,
            height,
            margin
        )

        # =================================================
        # GENERATED META
        # =================================================

        generated_at = report.get(
            "created_at",
            ""
        )

        try:

            if generated_at:

                dt = datetime.fromisoformat(
                    str(generated_at).replace(
                        "Z",
                        "+00:00"
                    )
                )

                # =================================================
                # OLD DATABASE RECORDS
                # =================================================
                #
                # If old records do not have timezone info,
                # treat them as UTC.
                #
                # =================================================

                if dt.tzinfo is None:

                    dt = dt.replace(
                        tzinfo=timezone.utc
                    )

                # =================================================
                # CONVERT UTC TO USER TIMEZONE
                # =================================================

                dt = dt.astimezone(
                    user_tz
                )

                generated_at = dt.strftime(
                    "%d %b %Y, %I:%M %p"
                )

            else:

                generated_at = "-"

        except Exception as e:

            print(
                "Timezone conversion error:",
                repr(e)
            )

            generated_at = safe_text(
                generated_at
            )

        # =================================================
        # SHOW TIMEZONE IN PDF
        # =================================================
        #
        # Example:
        # Generated • 29 Aug 2026, 10:30 PM IST
        #
        # =================================================

        timezone_label = safe_text(
            getattr(
                user_tz,
                "key",
                "Asia/Kolkata"
            )
        )

        if timezone_label == "Asia/Kolkata":

            timezone_display = "IST"

        else:

            timezone_display = timezone_label

        pdf.setFillColor(
            colors.HexColor("#CBD5E1")
        )

        pdf.setFont(
            "Helvetica",
            7
        )

        pdf.drawRightString(
            width - margin,
            height - 38.5 * mm,
            f"Generated • {generated_at} {timezone_display}"
        )

        pdf.drawRightString(
            width - margin,
            height - 44 * mm,
            f"Generated by • {current_user_name}"
        )

        # =================================================
        # CONTENT START
        # =================================================

        y = (
            height
            - 51 * mm
            - 8 * mm
        )

        # =================================================
        # REPORT OVERVIEW
        # =================================================

        draw_section_title(
            pdf,
            "REPORT OVERVIEW",
            margin,
            y
        )

        y -= 7 * mm

        overview_height = 22 * mm

        pdf.setFillColor(
            LIGHT_BG
        )

        pdf.roundRect(
            margin,
            y - overview_height,
            width - 2 * margin,
            overview_height,
            3.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setStrokeColor(
            BORDER
        )

        pdf.roundRect(
            margin,
            y - overview_height,
            width - 2 * margin,
            overview_height,
            3.5 * mm,
            fill=0,
            stroke=1
        )

        report_name = safe_text(
            report.get(
                "report_name",
                "Operations Analytics Report"
            )
        )

        pdf.setFillColor(DARK)

        pdf.setFont(
            "Helvetica-Bold",
            10.5
        )

        pdf.drawString(
            margin + 6 * mm,
            y - 7 * mm,
            report_name
        )

        pdf.setFillColor(MUTED)

        pdf.setFont(
            "Helvetica",
            6.7
        )

        pdf.drawString(
            margin + 6 * mm,
            y - 12.5 * mm,
            "REPORT TYPE"
        )

        pdf.setFillColor(SLATE)

        pdf.setFont(
            "Helvetica-Bold",
            7.5
        )

        pdf.drawString(
            margin + 27 * mm,
            y - 12.5 * mm,
            safe_text(
                report.get(
                    "report_type",
                    "Analytics"
                )
            )
        )

        description = safe_text(
            report.get(
                "description",
                "AI-Driven Operational Performance Analysis"
            )
        )

        pdf.setFillColor(MUTED)

        pdf.setFont(
            "Helvetica",
            7.1
        )

        description_lines = wrap_text(
            description,
            "Helvetica",
            7.1,
            103 * mm
        )

        if description_lines:

            pdf.drawString(
                margin + 6 * mm,
                y - 18 * mm,
                description_lines[0]
            )

        badge_width = 29 * mm
        badge_height = 7 * mm

        badge_x = (
            width
            - margin
            - badge_width
            - 5 * mm
        )

        badge_y = (
            y
            - 7 * mm
        )

        pdf.setFillColor(
            GREEN_LIGHT
        )

        pdf.roundRect(
            badge_x,
            badge_y - badge_height,
            badge_width,
            badge_height,
            3.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(
            GREEN_DARK
        )

        pdf.setFont(
            "Helvetica-Bold",
            7
        )

        pdf.drawCentredString(
            badge_x + badge_width / 2,
            badge_y - 4.8 * mm,
            "●  COMPLETED"
        )

        y -= (
            overview_height
            + 6 * mm
        )

        # =================================================
        # EXECUTIVE SUMMARY
        # =================================================

        draw_section_title(
            pdf,
            "EXECUTIVE SUMMARY",
            margin,
            y
        )

        y -= 7 * mm

        summary = (
            f"PredictOpsAI processed {total_predictions} "
            f"AI-driven prediction"
            f"{'s' if total_predictions != 1 else ''} "
            f"during the reporting period. "
            f"{successful_predictions} "
            f"prediction"
            f"{'s were' if successful_predictions != 1 else ' was'} "
            f"classified as successful, while "
            f"{total_risk_predictions} high or critical-risk "
            f"event"
            f"{'s were' if total_risk_predictions != 1 else ' was'} "
            f"identified."
        )

        pdf.setFillColor(SLATE)

        y = draw_wrapped_text(
            pdf,
            summary,
            margin,
            y,
            width - 2 * margin,
            "Helvetica",
            7.8,
            4 * mm,
            2
        )

        y -= 3 * mm

        # =================================================
        # AI PERFORMANCE METRICS
        # =================================================

        draw_section_title(
            pdf,
            "AI PERFORMANCE METRICS",
            margin,
            y
        )

        y -= 7 * mm

        card_width = (
            (
                width
                - 2 * margin
                - 2 * 4 * mm
            )
            / 3
        )

        card_height = 18 * mm

        gap_x = 4 * mm

        gap_y = 3.5 * mm

        metrics = [

            (
                "TOTAL PREDICTIONS",
                total_predictions,
                BLUE
            ),

            (
                "SUCCESSFUL",
                successful_predictions,
                GREEN
            ),

            (
                "HIGH RISK",
                high_risk_predictions,
                ORANGE
            ),

            (
                "CRITICAL RISK",
                critical_predictions,
                RED
            ),

            (
                "SUCCESS RATE",
                f"{success_rate:.1f}%",
                BLUE
            ),

            (
                "AVG RESPONSE",
                f"{average_response:.0f} ms",
                PURPLE
            )
        ]

        for index, (
            label,
            value,
            accent
        ) in enumerate(metrics):

            column = index % 3
            row = index // 3

            x = (
                margin
                + column
                * (
                    card_width
                    + gap_x
                )
            )

            card_y = (
                y
                - row
                * (
                    card_height
                    + gap_y
                )
            )

            draw_metric_card(
                pdf,
                x,
                card_y,
                card_width,
                card_height,
                label,
                value,
                accent
            )

        y -= (
            2 * card_height
            + gap_y
            + 6 * mm
        )

        # =================================================
        # AI RISK INTELLIGENCE
        # =================================================

        draw_section_title(
            pdf,
            "AI RISK INTELLIGENCE",
            margin,
            y
        )

        y -= 7 * mm

        risk_height = 25 * mm

        if critical_predictions > 0:

            risk_title = (
                "Critical Risk Detected"
            )

            risk_message = (
                f"{critical_predictions} critical-risk "
                f"prediction(s) were identified. These events "
                f"should be prioritized for immediate investigation "
                f"and root-cause analysis."
            )

            risk_color = RED
            risk_bg = RED_LIGHT

        elif high_risk_predictions > 0:

            risk_title = (
                "Elevated Risk Detected"
            )

            risk_message = (
                f"{high_risk_predictions} high-risk prediction(s) "
                f"were identified. Proactive monitoring and "
                f"preventive action are recommended."
            )

            risk_color = ORANGE
            risk_bg = ORANGE_LIGHT

        else:

            risk_title = (
                "System Risk Stable"
            )

            risk_message = (
                "No high or critical-risk predictions were detected. "
                "The current operational risk profile remains stable."
            )

            risk_color = GREEN
            risk_bg = GREEN_LIGHT

        pdf.setFillColor(
            risk_bg
        )

        pdf.roundRect(
            margin,
            y - risk_height,
            width - 2 * margin,
            risk_height,
            3.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(
            risk_color
        )

        pdf.roundRect(
            margin,
            y - risk_height,
            2.5 * mm,
            risk_height,
            1.2 * mm,
            fill=1,
            stroke=0
        )

        pdf.circle(
            margin + 9 * mm,
            y - 11 * mm,
            3.2 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(WHITE)

        pdf.setFont(
            "Helvetica-Bold",
            7
        )

        pdf.drawCentredString(
            margin + 9 * mm,
            y - 12.1 * mm,
            "!"
        )

        pdf.setFillColor(DARK)

        pdf.setFont(
            "Helvetica-Bold",
            9
        )

        pdf.drawString(
            margin + 16 * mm,
            y - 8.5 * mm,
            risk_title
        )

        pdf.setFillColor(SLATE)

        draw_wrapped_text(
            pdf,
            risk_message,
            margin + 16 * mm,
            y - 14 * mm,
            width - 2 * margin - 22 * mm,
            "Helvetica",
            7.4,
            3.8 * mm,
            2
        )

        y -= (
            risk_height
            + 5 * mm
        )

        # =================================================
        # RECOMMENDED ACTIONS
        # =================================================

        draw_section_title(
            pdf,
            "RECOMMENDED ACTIONS",
            margin,
            y
        )

        y -= 7 * mm

        recommendations = [

            (
                "Prioritize critical-risk events",
                "Investigate critical events immediately."
            ),

            (
                "Analyze recurring risk patterns",
                "Perform root-cause analysis on repeated high-risk predictions."
            ),

            (
                "Monitor affected services",
                "Track service health and optimize response performance."
            )
        ]

        action_height = 8 * mm

        action_gap = 1.5 * mm

        for index, (
            title,
            description_text
        ) in enumerate(recommendations):

            row_y = y

            pdf.setFillColor(
                LIGHT_BG
            )

            pdf.roundRect(
                margin,
                row_y - action_height,
                width - 2 * margin,
                action_height,
                2.5 * mm,
                fill=1,
                stroke=0
            )

            pdf.setFillColor(
                BLUE
            )

            pdf.circle(
                margin + 5 * mm,
                row_y - 4 * mm,
                2.4 * mm,
                fill=1,
                stroke=0
            )

            pdf.setFillColor(WHITE)

            pdf.setFont(
                "Helvetica-Bold",
                6.2
            )

            pdf.drawCentredString(
                margin + 5 * mm,
                row_y - 4.9 * mm,
                str(index + 1)
            )

            pdf.setFillColor(DARK)

            pdf.setFont(
                "Helvetica-Bold",
                7.1
            )

            pdf.drawString(
                margin + 11 * mm,
                row_y - 3.2 * mm,
                title
            )

            pdf.setFillColor(MUTED)

            pdf.setFont(
                "Helvetica",
                6.5
            )

            pdf.drawString(
                margin + 11 * mm,
                row_y - 6 * mm,
                description_text
            )

            y -= (
                action_height
                + action_gap
            )

        # =================================================
        # OPERATIONAL INSIGHTS
        # =================================================

        y -= 3 * mm

        draw_section_title(
            pdf,
            "OPERATIONAL INSIGHTS",
            margin,
            y
        )

        y -= 6.5 * mm

        if total_predictions == 0:

            activity_text = (
                "No prediction activity was available."
            )

        else:

            activity_text = (
                f"{total_predictions} prediction"
                f"{'s were' if total_predictions != 1 else ' was'} "
                f"processed during the reporting period."
            )

        if total_risk_predictions > 0:

            risk_text = (
                f"{total_risk_predictions} prediction"
                f"{'s require' if total_risk_predictions != 1 else ' requires'} "
                f"additional monitoring."
            )

        else:

            risk_text = (
                "No elevated operational risk was detected."
            )

        if average_response > 0:

            response_text = (
                f"Average prediction response time was "
                f"{average_response:.0f} ms."
            )

        else:

            response_text = (
                "Response-time metrics were not available."
            )

        insight_gap = 4 * mm

        insight_width = (
            (
                width
                - 2 * margin
                - insight_gap
            )
            / 2
        )

        insight_height = 13 * mm

        # =================================================
        # INSIGHT CARD 1
        # =================================================

        insight_x = margin
        insight_y = y

        pdf.setFillColor(
            BLUE_LIGHT
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            insight_width,
            insight_height,
            2.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setStrokeColor(
            BORDER
        )

        pdf.setLineWidth(
            0.5
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            insight_width,
            insight_height,
            2.5 * mm,
            fill=0,
            stroke=1
        )

        pdf.setFillColor(
            BLUE
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            1.8 * mm,
            insight_height,
            0.9 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(
            DARK
        )

        pdf.setFont(
            "Helvetica-Bold",
            7
        )

        pdf.drawString(
            insight_x + 5 * mm,
            insight_y - 4.5 * mm,
            "Prediction Activity"
        )

        pdf.setFillColor(
            SLATE
        )

        draw_wrapped_text(
            pdf,
            activity_text,
            insight_x + 5 * mm,
            insight_y - 8 * mm,
            insight_width - 9 * mm,
            "Helvetica",
            6.2,
            3 * mm,
            2
        )

        # =================================================
        # INSIGHT CARD 2
        # =================================================

        insight_x = (
            margin
            + insight_width
            + insight_gap
        )

        pdf.setFillColor(
            ORANGE_LIGHT
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            insight_width,
            insight_height,
            2.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setStrokeColor(
            BORDER
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            insight_width,
            insight_height,
            2.5 * mm,
            fill=0,
            stroke=1
        )

        pdf.setFillColor(
            ORANGE
        )

        pdf.roundRect(
            insight_x,
            insight_y - insight_height,
            1.8 * mm,
            insight_height,
            0.9 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(
            DARK
        )

        pdf.setFont(
            "Helvetica-Bold",
            7
        )

        pdf.drawString(
            insight_x + 5 * mm,
            insight_y - 4.5 * mm,
            "Risk Exposure"
        )

        pdf.setFillColor(
            SLATE
        )

        draw_wrapped_text(
            pdf,
            risk_text,
            insight_x + 5 * mm,
            insight_y - 8 * mm,
            insight_width - 9 * mm,
            "Helvetica",
            6.2,
            3 * mm,
            2
        )

        # =================================================
        # RESPONSE PERFORMANCE INSIGHT
        # =================================================

        y -= (
            insight_height
            + 2.5 * mm
        )

        response_height = 11 * mm

        pdf.setFillColor(
            PURPLE_LIGHT
        )

        pdf.roundRect(
            margin,
            y - response_height,
            width - 2 * margin,
            response_height,
            2.5 * mm,
            fill=1,
            stroke=0
        )

        pdf.setStrokeColor(
            BORDER
        )

        pdf.roundRect(
            margin,
            y - response_height,
            width - 2 * margin,
            response_height,
            2.5 * mm,
            fill=0,
            stroke=1
        )

        pdf.setFillColor(
            PURPLE
        )

        pdf.roundRect(
            margin,
            y - response_height,
            1.8 * mm,
            response_height,
            0.9 * mm,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(
            DARK
        )

        pdf.setFont(
            "Helvetica-Bold",
            7
        )

        pdf.drawString(
            margin + 5 * mm,
            y - 4.3 * mm,
            "Response Performance"
        )

        pdf.setFillColor(
            SLATE
        )

        draw_wrapped_text(
            pdf,
            response_text,
            margin + 5 * mm,
            y - 7.7 * mm,
            width - 2 * margin - 10 * mm,
            "Helvetica",
            6.2,
            3 * mm,
            1
        )

        # =================================================
        # FOOTER
        # =================================================

        draw_pdf_footer(
            pdf,
            width,
            margin
        )

        # =================================================
        # SAVE PDF
        # =================================================

        pdf.save()

        # =================================================
        # INCREMENT DOWNLOAD COUNT
        # =================================================

        reports_collection.update_one(
            {
                "_id": object_id,
                "user_id": current_user_id
            },
            {
                "$inc": {
                    "downloads": 1
                }
            }
        )

        # =================================================
        # RETURN FILE
        # =================================================

        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=file_name
        )

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Report generation error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate report"
        )