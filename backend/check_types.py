import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings

async def check_types():
    settings = get_settings()
    try:
        engine = create_async_engine(
            settings.database_url,
            connect_args={"statement_cache_size": 0}
        )
        
        async with engine.begin() as conn:
            print("Checking custom types in 'public' schema...")
            result = await conn.execute(text("SELECT typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public';"))
            types = [row[0] for row in result.fetchall()]
            print(f"Found types: {types}")
            
            # Check for specific ones
            for t in ['oauthprovider', 'userrole', 'subscriptiontier', 'subscriptionstatus', 'paymentstatus', 'paymentmethod']:
                if t in types:
                    print(f"✅ Type '{t}' exists.")
                else:
                    print(f"❌ Type '{t}' is MISSING.")
            
        await engine.dispose()
    except Exception as e:
        print(f"❌ Error checking types: {e}")

if __name__ == "__main__":
    asyncio.run(check_types())
