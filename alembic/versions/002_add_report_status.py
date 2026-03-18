"""add report status

Revision ID: 002
Revises: 001
Create Date: 2024-02-27

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    # Add status column to reports table with default value 'pending'
    op.add_column('reports', 
        sa.Column('status', 
            sa.Enum('pending', 'fixed', 'dismissed', name='reportstatus'), 
            nullable=False, 
            server_default='pending'
        )
    )


def downgrade():
    # Remove status column from reports table
    op.drop_column('reports', 'status')
    # Drop the enum type
    op.execute('DROP TYPE reportstatus')
