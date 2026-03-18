"""add owner notice to reports

Revision ID: 003
Revises: 002
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Add owner_notice column to reports table
    op.add_column('reports', 
        sa.Column('owner_notice', sa.Text(), nullable=True)
    )


def downgrade():
    # Remove owner_notice column from reports table
    op.drop_column('reports', 'owner_notice')
