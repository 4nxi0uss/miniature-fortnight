from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/plans", tags=["training-plans"])


@router.get("", response_model=list[schemas.TrainingPlanRead])
def list_plans(db: Session = Depends(get_db)):
    return crud.list_training_plans(db)


@router.get("/{plan_id}", response_model=schemas.TrainingPlanRead)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = crud.get_training_plan(db, plan_id)
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return plan


@router.post(
    "", response_model=schemas.TrainingPlanRead, status_code=status.HTTP_201_CREATED
)
def create_plan(payload: schemas.TrainingPlanCreate, db: Session = Depends(get_db)):
    return crud.create_training_plan(db, payload)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_training_plan(db, plan_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return None
