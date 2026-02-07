import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings

async def test_connection():
    settings = get_settings()
    print(f"Testing connection to: {settings.database_url.split('@')[-1]}")
    
    try:
        engine = create_async_engine(
            settings.database_url,
            connect_args={"statement_cache_size": 0}
        )
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT version();"))
            version = result.scalar()
            print(f"✅ Success! Connected to PostgreSQL: {version}")
            
            # Check for tables
            result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"))
            tables = [row[0] for row in result.fetchall()]
            print(f"Found {len(tables)} tables: {', '.join(tables)}")
            
        await engine.dispose()
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
