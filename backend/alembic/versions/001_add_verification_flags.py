"""add verification flags

Revision ID: 001
Revises: 
Create Date: 2024-02-15

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns for verification flags
    op.add_column('users', sa.Column('password_change_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('account_delete_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('verification_expiry', sa.DateTime(), nullable=True))


def downgrade():
    # Remove columns if rolling back
    op.drop_column('users', 'verification_expiry')
    op.drop_column('users', 'account_delete_verified')
    op.drop_column('users', 'password_change_verified')
