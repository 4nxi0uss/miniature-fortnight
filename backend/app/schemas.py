from pydantic import BaseModel, ConfigDict, Field


class WorkoutSessionBase(BaseModel):
    day_of_week: str = Field(..., examples=["Monday"])
    exercise: str = Field(..., examples=["Squat"])
    sets: int | None = Field(default=None, ge=1, le=20)
    reps: int | None = Field(default=None, ge=1, le=100)
    duration_minutes: int | None = Field(default=None, ge=1, le=300)


class WorkoutSessionCreate(WorkoutSessionBase):
    pass


class WorkoutSessionRead(WorkoutSessionBase):
    id: int
    training_plan_id: int

    model_config = ConfigDict(from_attributes=True)


class TrainingPlanBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    goal: str | None = Field(default=None, max_length=240)
    start_date: str | None = Field(default=None, examples=["2026-01-01"])
    end_date: str | None = Field(default=None, examples=["2026-03-31"])
    notes: str | None = Field(default=None, max_length=1000)


class TrainingPlanCreate(TrainingPlanBase):
    sessions: list[WorkoutSessionCreate] = Field(default_factory=list)


class TrainingPlanRead(TrainingPlanBase):
    id: int
    sessions: list[WorkoutSessionRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
