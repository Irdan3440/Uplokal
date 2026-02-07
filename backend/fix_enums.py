import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings

async def fix_enum_data():
    settings = get_settings()
    try:
        engine = create_async_engine(
            settings.database_url,
            connect_args={"statement_cache_size": 0}
        )
        
        async with engine.begin() as conn:
            print("Standardizing Enum values in database to Uppercase...")
            
            # Update Subscription plans
            await conn.execute(text("UPDATE subscription_plans SET tier = UPPER(tier);"))
            print("✅ subscription_plans.tier updated to uppercase.")
            
            # Update User status etc.
            # (Users might not have data yet, but just in case)
            await conn.execute(text("UPDATE users SET role = UPPER(role);"))
            print("✅ users.role updated to uppercase.")
            
        await engine.dispose()
    except Exception as e:
        print(f"❌ Error fixing data: {e}")

if __name__ == "__main__":
    asyncio.run(fix_enum_data())
