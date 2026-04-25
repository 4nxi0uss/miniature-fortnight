from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas


def list_training_plans(db: Session) -> list[models.TrainingPlan]:
    statement = (
        select(models.TrainingPlan)
        .options(selectinload(models.TrainingPlan.sessions))
        .order_by(models.TrainingPlan.id.desc())
    )
    return list(db.execute(statement).scalars().all())


def get_training_plan(db: Session, plan_id: int) -> models.TrainingPlan | None:
    statement = (
        select(models.TrainingPlan)
        .options(selectinload(models.TrainingPlan.sessions))
        .where(models.TrainingPlan.id == plan_id)
    )
    return db.execute(statement).scalars().first()


def create_training_plan(
    db: Session, payload: schemas.TrainingPlanCreate
) -> models.TrainingPlan:
    new_plan = models.TrainingPlan(
        name=payload.name,
        goal=payload.goal,
        start_date=payload.start_date,
        end_date=payload.end_date,
        notes=payload.notes,
    )
    db.add(new_plan)
    db.flush()

    for session in payload.sessions:
        new_session = models.WorkoutSession(
            training_plan_id=new_plan.id,
            day_of_week=session.day_of_week,
            exercise=session.exercise,
            sets=session.sets,
            reps=session.reps,
            duration_minutes=session.duration_minutes,
        )
        db.add(new_session)

    db.commit()
    db.refresh(new_plan)
    return new_plan


def delete_training_plan(db: Session, plan_id: int) -> bool:
    plan = db.get(models.TrainingPlan, plan_id)
    if plan is None:
        return False

    db.delete(plan)
    db.commit()
    return True
