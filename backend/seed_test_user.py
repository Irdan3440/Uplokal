import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.user import User, UserRole
from app.models.subscription import SubscriptionPlan, SubscriptionTier
from app.config import get_settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    settings = get_settings()
    engine = create_async_engine(
        settings.database_url,
        connect_args={"statement_cache_size": 0}
    )
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as db:
        try:
            # 1. Check if test user exists
            result = await db.execute(select(User).where(User.email == "test@uplokal.com"))
            user = result.scalar_one_or_none()
            
            if not user:
                print("Creating test user...")
                user = User(
                    email="test@uplokal.com",
                    password_hash=pwd_context.hash("password123"),
                    full_name="Budi Pengusaha",
                    role=UserRole.USER,
                    is_verified=True,
                    is_active=True
                )
                db.add(user)
                await db.commit()
                print("✅ Test user created: test@uplokal.com / password123")
            else:
                print("ℹ️ Test user already exists.")

            # 2. Plans are already seeded by SQL schema, but let's verify
            result = await db.execute(select(SubscriptionPlan))
            plans = result.scalars().all()
            print(f"✅ Found {len(plans)} subscription plans in database.")

        except Exception as e:
            print(f"❌ Seeding failed: {e}")
            await db.rollback()
        finally:
            await db.close()
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_data())
