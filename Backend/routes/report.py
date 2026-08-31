from fastapi import APIRouter, Depends, Request

from controllers.report_controller import (
    create_report,
    get_reports,
    get_report_by_id,
    delete_report,
    download_report,
)

from models.report import ReportCreate
from utils.auth import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# =========================================================
# CREATE REPORT
# =========================================================

@router.post("/")
async def create_new_report(
    report: ReportCreate,
    current_user=Depends(get_current_user)
):
    return await create_report(
        report,
        current_user
    )


# =========================================================
# GET ALL REPORTS
# =========================================================

@router.get("/")
async def get_all_reports(
    current_user=Depends(get_current_user)
):
    return await get_reports(
        current_user
    )


# =========================================================
# GET REPORT BY ID
# =========================================================

@router.get("/{report_id}")
async def get_single_report(
    report_id: str,
    current_user=Depends(get_current_user)
):
    return await get_report_by_id(
        report_id,
        current_user
    )


# =========================================================
# DELETE REPORT
# =========================================================

@router.delete("/{report_id}")
async def remove_report(
    report_id: str,
    current_user=Depends(get_current_user)
):
    return await delete_report(
        report_id,
        current_user
    )


# =========================================================
# DOWNLOAD REPORT PDF
# =========================================================

@router.post("/{report_id}/download")
async def download_report_pdf(
    report_id: str,
    request: Request,
    current_user=Depends(get_current_user)
):
    return await download_report(
        report_id,
        current_user,
        request
    )

