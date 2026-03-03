"""add is_read to reports

Revision ID: 004
Revises: 003
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade():
    # Add is_read column to reports table
    op.add_column('reports', sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    # Remove is_read column from reports table
    op.drop_column('reports', 'is_read')
