from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(db: Session, request):
    existing_user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_user:
        raise Exception("User already exists")

    user = User(
        full_name=request.full_name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=request.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


def login_user(db: Session, request):
    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if not user:
        raise Exception("Invalid email or password")

    valid_password = verify_password(
        request.password,
        user.hashed_password
    )

    if not valid_password:
        raise Exception("Invalid email or password")

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }